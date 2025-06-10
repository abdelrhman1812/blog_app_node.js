import { nanoid } from "nanoid";
import CommentModel from "../../../DB/models/comment.model.js";
import PostModel from "../../../DB/models/post.model.js";
import cloudinary from "../../../service/cloudinary.js";
import { destroyImages, uploadImages } from "../../../service/handlerImages.js";
import AppError from "../../../utils/appError.js";

/* ================= Get Posts ================ */

const getPosts = async (req, res) => {
  const posts = await PostModel.find()
    .sort({ createdAt: -1 })
    .populate("owner", "userName email image")
    .populate("likes", "userName email image")
    .populate({
      path: "comments",
      populate: {
        path: "createdBy",
        select: "userName email image",
      },
    });
  return res
    .status(200)
    .json({ message: "success", data: { posts }, success: true });
};

/* ================= Create Post ================ */
const createPost = async (req, res) => {
  const userId = req.user._id;
  const { title, content } = req.body;

  const customId = nanoid(5);
  const folderPath = `social_app/posts/Images/${customId}`;

  let listImages = [];

  if (req.files?.images?.length) {
    listImages = await uploadImages(req.files.images, folderPath);
  }

  const post = await PostModel.create({
    title,
    content,
    images: listImages,
    owner: userId,
    customId,
  });

  return res.status(201).json({
    message: "Post created successfully",
    success: true,
    data: { post },
  });
};

/* ================= Update Post ================ */

const updatePost = async (req, res, next) => {
  const { title, content } = req.body;
  const { id } = req.params;
  const userId = req.user._id;

  const post = await PostModel.findById(id);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  if (post.owner.toString() !== userId.toString()) {
    return next(
      new AppError("You are not authorized to update this post", 403)
    );
  }

  if (title) post.title = title;
  if (content) post.content = content;
  await post.save();

  return res.status(200).json({
    success: true,
    message: "Post updated successfully",
    data: { post },
  });
};

/* ================= Delete Post ================ */

const deletePost = async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;

  const post = await PostModel.findById(id);
  if (!post) {
    return next(new AppError("post is not exist", 404));
  }
  if (userId.toString() !== post.owner.toString()) {
    return next(
      new AppError("you can't delete this post , You are not owner", 403)
    );
  }

  if (post.images.length) {
    const postImages = post.images;
    await destroyImages(postImages);

    const folderPath = `social_app/posts/Images/${post.customId}`;
    await cloudinary.api.delete_folder(folderPath);
  }
  const deletedPost = await PostModel.findByIdAndDelete(id);
  await CommentModel.deleteMany({ post: id });

  return res
    .status(200)
    .json({ message: "success delete", success: true, data: { deletedPost } });
};

/* ================= Create Like For Post ================ */
const createLike = async (req, res, next) => {
  const userId = req.user._id;
  const { postId } = req.params;
  const { action } = req.query;

  if (!action || !["like", "unlike"].includes(action)) {
    return next(
      new AppError("Invalid action. Must be 'like' or 'unlike'", 400)
    );
  }

  const post = await PostModel.findById(postId);
  if (!post) {
    return next(new AppError("Post does not exist", 404));
  }

  let data =
    action === "like"
      ? { $addToSet: { likes: userId } }
      : { $pull: { likes: userId } };

  const updatedPost = await PostModel.findByIdAndUpdate(postId, data, {
    new: true,
  });

  return res.status(200).json({
    message: `${action === "like" ? "liked" : "unlike"} successfully`,
    success: true,
    data: {
      post: updatedPost,
    },
  });
};

export { createLike, createPost, deletePost, getPosts, updatePost };
