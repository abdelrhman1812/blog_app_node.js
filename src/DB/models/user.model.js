import mongoose, { model, Schema, Types } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      trim: true,
      minLength: [3, "userName must be at least 3 characters"],
      maxLength: [20, "userName must be at most 20 characters"],
      required: [true, "userName is required"],
    },
    email: {
      type: String,
      trim: true,
      unique: [true, "email already exist"],
      required: [true, "email is required"],
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    address: {
      type: String,
    },
    phone: String,
    image: {
      secure_url: String,
      public_id: String,
    },
    customId: String,
    DOB: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    followers: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    bio: String,
  },
  { timestamps: true }
);

/*
userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "owner",
});

userSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "createdBy",
});

 */

const userModel = mongoose.models.Users || model("User", userSchema);

export default userModel;
