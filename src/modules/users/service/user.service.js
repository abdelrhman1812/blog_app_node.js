import { nanoid } from "nanoid";
import PostModel from "../../../DB/models/post.model.js";
import userModel from "../../../DB/models/user.model.js";
import {
  destroyImage,
  uploadCoverImage,
} from "../../../service/handlerImages.js";
import AppError from "../../../utils/appError.js";

/* ================= Get User Profile ================ */
const getUserProfile = async (req, res, next) => {
  const userId = req.user._id;
  const user = await userModel.findById(userId, "-password");
  const posts = await PostModel.find({ owner: userId })
    .populate("comments")
    .populate("owner")
    .sort({ createdAt: -1 });
  if (!user) return next(new AppError("user is not exist", 404));
  return res.status(200).json({ message: "success", data: { user, posts } });
};

/* ================= Get Profile By Id ================ */

const getProfileById = async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findById(id, "-password");
 const posts = await PostModel.find({ owner: id })
    .populate({
      path: "owner" 
    })
    .populate({
      path: "comments",
      populate: {
        path: "createdBy" 
      }
    })

  if (!user) return next(new AppError("user is not exist", 404));
  return res.status(200).json({ message: "success", data: { user, posts } });
};

/* ================= Update Image Profile ================ */
const updateImageProfile = async (req, res, next) => {
  const userId = req.user._id;
  const user = await userModel.findById(userId);

  if (!user) {
    return next(new AppError("User does not exist", 404));
  }

  if (!user.customId) {
    user.customId = nanoid(5);
  }

  if (user.image?.public_id) {
    await destroyImage(user.image.public_id);
  }

  if (!req.file) {
    return next(new AppError("No image file provided", 400));
  }

  const { secure_url, public_id } = await uploadCoverImage(
    req.file,
    `social_app/users/Images/${user.userName}/${user.customId}`
  );

  user.image = { secure_url, public_id };
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile image updated successfully",
    data: { user },
  });
};

export { getProfileById, getUserProfile, updateImageProfile };
