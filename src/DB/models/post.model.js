import mongoose, { model, Schema, Types } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      minLength: [1, "Title must be at least 3 characters"],
      maxLength: [50, "Title must be at most 50 characters"],
      required: [true, "Title is required"],
    },
    content: {
      type: String,
      trim: true,
      minLength: [1, "Content must be at least 5 characters"],
      maxLength: [2000, "Content must be at most 2000 characters"],
    },
    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Post owner is required"],
      immutable: true,
    },
    images: [
      {
        secure_url: String,
        public_id: String,
      },
    ],
    customId: {
      type: String,
    },

    likes: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual("comments", {
  localField: "_id",
  foreignField: "post",
  ref: "Comment",
});

const PostModel = mongoose.models.Posts || model("Post", postSchema);

export default PostModel;
