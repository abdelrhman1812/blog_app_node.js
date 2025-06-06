import { nanoid } from "nanoid";
import PostModel from "../../../DB/models/post.model.js";
import cloudinary from "../../../service/cloudinary.js";
import { destroyImages, uploadImages } from "../../../service/handlerImages.js";
import AppError from "../../../utils/appError.js";

/* ================= Get Posts ================ */

const getPosts = async (req, res) => {
  const posts = await PostModel.find().populate("owner", "userName");
  res.status(200).json({ message: "success", data: { posts } });
};

/* ================= Get Logged In User Posts ================  */
const getLoggedInUserPosts = async (req, res) => {
  const posts = await PostModel.find();
  res.status(200).json({ message: "success", posts });
};

/* ================= Create Post ================ */
const createPost = async (req, res, next) => {
  try {
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
      success: true,
      data: { post },
    });
  } catch (err) {
    next(err);
  }
};

/* ================= Update Post ================ */

const updatePost = async (req, res, next) => {
  const { title, content } = req.body;
  const { id } = req.params;
  const post = await PostModel.findByIdAndUpdate(
    id,
    { title, content },
    { new: true }
  );
  if (!post) {
    return next(new AppError("post is not exist", 404));
  }
  return res.status(200).json({ message: "success", post });
};

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

  return res
    .status(200)
    .json({ message: "success delete", success: true, deletedPost });
};

export { createPost, deletePost, getPosts, updatePost };
