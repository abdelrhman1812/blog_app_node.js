import mongoose, { model, Schema, Types } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      minLength: [3, "Title must be at least 3 characters"],
      maxLength: [50, "Title must be at most 50 characters"],
      required: [true, "Title is required"],
    },
    content: {
      type: String,
      trim: true,
      minLength: [10, "Content must be at least 10 characters"],
      maxLength: [2000, "Content must be at most 2000 characters"],
    },
    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Post owner is required"],
      immutable: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.models.Posts || model("Post", postSchema);

export default PostModel;
