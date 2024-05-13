import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .regex(/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+(?!(\.ru|\.su))\.[a-zA-Z]{2,}$/)
    .message("Enter email of an existing country")
    .required(),
  phone: Joi.string()
    .regex(/^[0-9]{10}$/)
    .message("Phone number must have 10 digits.")
    .required(),
  favorite: Joi.bool(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string()
    .regex(/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+(?!(\.ru|\.su))\.[a-zA-Z]{2,}$/)
    .message("Enter email of an existing country"),

  phone: Joi.string()
    .regex(/^[0-9]{10}$/)
    .message("Phone number must have 10 digits."),
  favorite: Joi.bool(),
});

export const updateStatusContactSchema = Joi.object({
  favorite: Joi.bool().required(),
});
