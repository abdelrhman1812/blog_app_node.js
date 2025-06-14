import { Router } from "express";
import authentication from "../../middleware/authentication.js";
import catchError from "../../middleware/catchError.js";
import { validation } from "../../middleware/validation.js";
import multerHost, { validationExtensions } from "../../utils/multerHost.js";
import {
  followUser,
  getProfileById,
  getUserFollower,
  getUserProfile,
  getUserUnfollow,
  updateImageProfile,
  updateProfile,
} from "./service/user.service.js";
import { updateUserProfileValidation } from "./user.validation.js";

const usersRouter = Router();

/* ================= Get User Profile ================ */
usersRouter.get("/", authentication, catchError(getUserProfile));

/* ================= Get Users For Follow ================ */
usersRouter.get("/unfollow", authentication, catchError(getUserUnfollow));

/* ================= Get Users Follower ================ */

usersRouter.get("/followers", authentication, catchError(getUserFollower));

/* ================= Get Profile By Id ================ */

usersRouter.get("/:id", authentication, catchError(getProfileById));

/* ================= Update Image Profile ================ */

usersRouter.patch(
  "/update-image",
  authentication,
  multerHost(validationExtensions.image).single("image"),
  catchError(updateImageProfile)
);

/* ================= Update Profile ================ */

usersRouter.patch(
  "/update-profile",
  authentication,
  validation(updateUserProfileValidation),
  catchError(updateProfile)
);

/* ================= Handle Follow User ================= */

usersRouter.patch("/:userId/follow", authentication, catchError(followUser));

export default usersRouter;
