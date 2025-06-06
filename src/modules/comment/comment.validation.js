import Joi from "joi";
import customMessages from "../../utils/validationMessages.js";

/* Validation schema for add Comment  */

const createCommentValidation = {
  body: Joi.object({
    content: Joi.string()
      .min(5)
      .max(2000)
      .trim()
      .required()
      .messages(customMessages("The Comment Content")),
  }),
  params: Joi.object({
    postId: Joi.string()
      .hex()
      .length(24)
      .required()
      .messages(customMessages("The post ID")),
  }),
};

/* Validation schema for update post  */

const updateCommentValidation = {
  body: Joi.object({
    content: Joi.string()
      .min(5)
      .max(2000)
      .trim()
      .messages(customMessages("The Comment Content")),
  }),
  params: Joi.object({
    commentId: Joi.string()
      .hex()
      .length(24)
      .messages(customMessages("The comment ID")),
    postId: Joi.string()
      .hex()
      .length(24)
      .messages(customMessages("The post ID")),
  }),
};

export { createCommentValidation, updateCommentValidation };
