import mongoose, { model, Schema, Types } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
      minLength: [1, "Content must be at least 5 characters"],
      maxLength: [2000, "Content must be at most 2000 characters"],
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Comment createdBy is required"],
    },
    post: {
      type: Types.ObjectId,
      ref: "Post",
      required: [true, "Post is required"],
    },
  },
  {
    timestamps: true,
  }
);

const CommentModel =
  mongoose.models.Comments || model("Comment", commentSchema);

export default CommentModel;
