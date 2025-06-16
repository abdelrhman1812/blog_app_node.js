import Joi from "joi";
import sharedValidation from "../../utils/sharedValidation.js";
import customMessages from "../../utils/validationMessages.js";

/* Validation schema for add product  */

const createPostValidation = {
  body: Joi.object({
    title: Joi.string()
      .min(1)
      .max(60)
      .trim()
      .required()
      .messages(customMessages("The Post Title")),
    content: Joi.string()

      .max(2000)
      .trim()

      .messages(customMessages("The Post Content")),
  }),
  files: Joi.object({
    images: Joi.array()
      .items(sharedValidation.file)
      .min(1)
      .messages(customMessages("The Post images")),
  }),
};

/* Validation schema for update post  */

const updatePostValidation = {
  body: Joi.object({
    title: Joi.string()
      .min(1)
      .max(60)
      .trim()
      .messages(customMessages("The Post Title")),
    content: Joi.string()
      .max(2000)
      .trim()
      .messages(customMessages("The Post Content")),
  }),
};

export { createPostValidation, updatePostValidation };
