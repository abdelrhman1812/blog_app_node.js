import { Router } from "express";
import authentication from "../../middleware/authentication.js";
import catchError from "../../middleware/catchError.js";
import { validation } from "../../middleware/validation.js";
import multerHost, { validationExtensions } from "../../utils/multerHost.js";
import commentRouter from "../comment/comment.controller.js";
import {
  createPostValidation,
  updatePostValidation,
} from "./post.validation.js";
import {
  createLike,
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "./service/post.service.js";

const postsRouter = Router();

postsRouter.use("/:postId/comments", commentRouter);

/* =============== Get Posts =============== */

postsRouter.get("/", catchError(getPosts));

/* =============== Get Post By Id =============== */
postsRouter.get("/:id", catchError(getPostById));

/* =============== Create Post =============== */

postsRouter.post(
  "/",
  authentication,
  multerHost(validationExtensions.image).fields([
    { name: "images", maxCount: 10 },
  ]),
  validation(createPostValidation),
  catchError(createPost)
);

/* =============== Update Post =============== */

postsRouter.patch(
  "/:id",
  authentication,
  validation(updatePostValidation),
  catchError(updatePost)
);

/* =============== Delete Post ===============  */

postsRouter.delete("/:id", authentication, catchError(deletePost));

/* =============== Create Like For Post ===============  */

postsRouter.patch("/:postId/like", authentication, catchError(createLike));

export default postsRouter;
