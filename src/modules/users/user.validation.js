import Joi from "joi";
import customMessages from "../../utils/validationMessages.js";

const updateUserProfileValidation = {
  body: Joi.object({
    userName: Joi.string().min(3).max(20).messages(customMessages(" The name")),
    email: Joi.string().email().messages(customMessages(" The email")),
    address: Joi.string().messages(customMessages(" The address")),
    phone: Joi.string().messages(customMessages(" The phone number")),
    bio: Joi.string().messages(customMessages(" The bio")),
    linkProfile: Joi.string()
      .uri()
      .messages(customMessages(" The link profile")),
  }),
};

export { updateUserProfileValidation };
