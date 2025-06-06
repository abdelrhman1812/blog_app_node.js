import { Router } from "express";
import authentication from "../../middleware/authentication.js";
import catchError from "../../middleware/catchError.js";
import multerHost, { validationExtensions } from "../../utils/multerHost.js";
import { getUserProfile, updateImageProfile } from "./service/user.service.js";

const usersRouter = Router();

usersRouter.get("/", authentication, catchError(getUserProfile));

usersRouter.patch(
  "/update-image",
  authentication,
  multerHost(validationExtensions.image).single("image"),
  catchError(updateImageProfile)
);

export default usersRouter;
