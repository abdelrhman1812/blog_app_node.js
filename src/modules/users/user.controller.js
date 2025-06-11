import { Router } from "express";
import authentication from "../../middleware/authentication.js";
import catchError from "../../middleware/catchError.js";
import multerHost, { validationExtensions } from "../../utils/multerHost.js";
import {
  followUser,
  getProfileById,
  getUserProfile,
  getUserUnfollow,
  updateImageProfile,
} from "./service/user.service.js";

const usersRouter = Router();

/* ================= Get User Profile ================ */
usersRouter.get("/", authentication, catchError(getUserProfile));

/* ================= Get Users For Follow ================ */
usersRouter.get("/unfollow", authentication, catchError(getUserUnfollow));

/* ================= Get Profile By Id ================ */

usersRouter.get("/:id", authentication, catchError(getProfileById));

/* ================= Update Image Profile ================ */

usersRouter.patch(
  "/update-image",
  authentication,
  multerHost(validationExtensions.image).single("image"),
  catchError(updateImageProfile)
);

/* ================= Handle Follow User ================= */

usersRouter.patch("/:userId/follow", authentication, catchError(followUser));

export default usersRouter;
