import { Router } from "express";
import authentication from "../../middleware/authentication.js";
import catchError from "../../middleware/catchError.js";
import { validation } from "../../middleware/validation.js";
import {
  createCommentValidation,
  updateCommentValidation,
} from "./comment.validation.js";
import {
  createComment,
  deleteComment,
  updateComment,
} from "./service/comment.service.js";

const commentRouter = Router({
  mergeParams: true,
});

commentRouter.post(
  "/",
  authentication,
  validation(createCommentValidation),
  catchError(createComment)
);

/* ================= Update Comment ================ */

commentRouter.patch(
  "/:commentId",
  authentication,
  validation(updateCommentValidation),
  catchError(updateComment)
);

/* ================= Delete Comment ================ */

commentRouter.delete("/:commentId", authentication, catchError(deleteComment));

export default commentRouter;
