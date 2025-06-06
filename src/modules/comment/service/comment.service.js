import CommentModel from "../../../DB/models/comment.model.js";
import PostModel from "../../../DB/models/post.model.js";
import AppError from "../../../utils/appError.js";

const createComment = async (req, res, next) => {
  const userId = req.user._id;
  const { postId } = req.params;
  const { content } = req.body;

  const post = await PostModel.findById(postId);
  if (!post) {
    return next(new AppError("post is not exist", 404));
  }

  const comment = await CommentModel.create({
    content,
    createdBy: userId,
    post: postId,
  });

  return res.status(200).json({
    message: "success",
    success: true,
    data: {
      comment,
    },
  });
};

/* ================= Update Comment ================ */
const updateComment = async (req, res, next) => {
  const userId = req.user._id;
  const { postId, commentId } = req.params;
  const { content } = req.body;

  const comment = await CommentModel.findOne({
    post: postId,
    createdBy: userId,
    _id: commentId,
  });

  if (!comment) {
    return next(new AppError("comment is not exist", 404));
  }

  comment.content = content;
  await comment.save();

  return res
    .status(200)
    .json({ message: "success update comment", data: { comment } });
};

/* ================= Delete Comment ================ */
const deleteComment = async (req, res, next) => {
  const userId = req.user._id;
  const { postId, commentId } = req.params;

  console.log(userId);
  const comment = await CommentModel.findOne({
    post: postId,
    _id: commentId,
  }).populate("post");

  if (!comment) {
    return next(new AppError("Invalid comment id", 404));
  }

  if (
    comment.createdBy.toString() !== userId.toString() &&
    comment.post.owner.toString() !== req.user._id
  ) {
    return next(new AppError("You can't delete this comment", 403));
  }

  await CommentModel.findByIdAndDelete(commentId);

  res.status(200).json({
    message: "success delete comment",
    success: true,
    data: {
      comment,
    },
  });
};

export { createComment, deleteComment, updateComment };
