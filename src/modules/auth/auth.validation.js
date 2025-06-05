import Joi from "joi";
import customMessages from "../../utils/validationMessages.js";

/* Validation schema for email and password */

const emailField = Joi.string()
  .email()
  .required()
  .messages(customMessages("email"));
const passwordField = Joi.string()
  // .pattern(/^[A-Z][A-Za-z0-9]{3,40}$/)
  .required()
  .messages(customMessages("password"));

/* Validation schema for register  */

const signupValidation = {
  body: Joi.object({
    userName: Joi.string()
      .max(15)
      .min(3)
      .required()
      .messages(customMessages("name")),
    email: emailField,
    password: passwordField,
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages(customMessages("confirm password")),
    phone: Joi.number().messages(customMessages("phone number")),
    address: Joi.string().messages(customMessages("address")),
  }),
};

/* Validation schema for login  */

const signinValidation = {
  body: Joi.object({
    email: emailField,
    password: passwordField,
  }),
};

export { signinValidation, signupValidation };
