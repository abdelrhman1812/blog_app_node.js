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
  //   .populate({
  //     path: "following",
  //     select: "userName email image",
  //   })
  //   .populate({
  //     path: "followers",
  //     select: "userName email image",
  //   });
  // const posts = await PostModel.find({ owner: userId })
  //   .populate("likes", "userName email image")

  //   .populate("comments")
  //   .populate("owner")

  //   .sort({ createdAt: -1 });
  if (!user) return next(new AppError("user is not exist", 404));
  return res.status(200).json({ message: "success", data: { user } });
};

/* ================= Get Profile By Id ================ */

const getProfileById = async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel
    .findById(id, "-password")
    .populate({
      path: "following",
      select: "userName email image",
    })
    .populate({
      path: "followers",
      select: "userName email image",
    });

  const posts = await PostModel.find({ owner: id })
    .populate("likes", "userName email image")
    .populate({
      path: "owner",
      select: "userName email image",
    })
    .populate({
      path: "comments",
      populate: {
        path: "createdBy",
        select: "userName email image",
      },
    });

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

/* ================= handler Follow User ================ */

const followUser = async (req, res, next) => {
  const currentUserId = req.user._id;
  const targetUserId = req.params.userId;
  const { action } = req.query;

  if (!action || !["follow", "unfollow"].includes(action)) {
    return next(
      new AppError("Invalid action , Must be 'follow' or 'unfollow'", 400)
    );
  }

  if (currentUserId.toString() === targetUserId.toString()) {
    return next(new AppError("You cannot follow/unfollow yourself", 400));
  }

  /* Check  user is exists */
  const targetUser = await userModel.findById(targetUserId);
  if (!targetUser) {
    return next(new AppError("User not found", 404));
  }

  /* Follow form current user  */

  const currentUserUpdate =
    action === "follow"
      ? { $addToSet: { following: targetUserId } }
      : { $pull: { following: targetUserId } };

  const targetUserUpdate =
    action === "follow"
      ? { $addToSet: { followers: currentUserId } }
      : { $pull: { followers: currentUserId } };

  /* Save updates */

  const updatedCurrentUser = await userModel.findByIdAndUpdate(
    currentUserId,
    currentUserUpdate,
    {
      new: true,
    }
  );
  const updatedTargetUser = await userModel.findByIdAndUpdate(
    targetUserId,
    targetUserUpdate,
    {
      new: true,
    }
  );
  
    const isFollowing = action === "follow";


  return res.status(200).json({
    status: "success",
    message: `Successfully ${action} user`,
    data: {
      action,
      currentUserFollowing: updatedCurrentUser.following,
      targetUserFollowers: updatedTargetUser.followers,
      isFollowing
    },
  });
};

/* ================ Get Users For Follow ================ */

const getUserUnfollow = async (req, res, next) => {
  const userId = req.user._id;

  const currentUser = await userModel.findById(userId).select("following");

  const followingIds = currentUser.following.map((id) => id.toString());

  followingIds.push(userId.toString());

  const users = await userModel
    .find({ _id: { $nin: followingIds } })
    .select("userName email image followers bio address ");

  return res.status(200).json({ message: "success", data: { users } });
};

/* ================= Update Profile ================ */
const updateProfile = async (req, res, next) => {
  const userId = req.user._id;
  const { userName, email, address, phone, bio, linkProfile } = req.body;

  const user = await userModel.findById(userId);
  if (!user) {
    return next(new AppError("User does not exist", 404));
  }

  if (email) {
    const emailIsExist = await userModel.findOne({
      email: email.toLowerCase(),
      _id: { $ne: userId },
    });
    if (emailIsExist) {
      return next(new AppError("Email already in use", 403));
    }
    user.email = email.toLowerCase();
  }

  if (userName !== undefined) user.userName = userName;
  if (address !== undefined) user.address = address;
  if (phone !== undefined) user.phone = phone;
  if (bio !== undefined) user.bio = bio;
  if (linkProfile !== undefined) user.linkProfile = linkProfile;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: { user },
  });
};

/* ================= Get User FOllower ================ */

const getUserFollower = async (req, res, next) => {
  const userId = req.user._id;
  const user = await userModel
    .findById(userId, "-password")
    .populate({
      path: "following",
      select: "userName email image",
    })
    .populate({
      path: "followers",
      select: "userName email image",
    });

  if (!user) return next(new AppError("user is not exist", 404));
  return res.status(200).json({ message: "success", data: { user } });
};

export {
  followUser,
  getProfileById,
  getUserFollower,
  getUserProfile,
  getUserUnfollow,
  updateImageProfile,
  updateProfile,
};
