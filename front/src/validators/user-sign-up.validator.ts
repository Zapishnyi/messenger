import Joi from "joi";

import IUserSignUp from "../interfaces/IUserSignUp";

const userSingUpValidator: Joi.ObjectSchema<IUserSignUp> = Joi.object({
  password: Joi.string()
    .pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)\S*$/)
    .required()
    .empty()
    .min(5)
    .max(16)
    .messages({
      "string.pattern.base": `digit, lowercase letter, uppercase letter, 
       special character, no space`,
      "string.min": "5 characters min",
      "string.max": "16 characters max",
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .empty()
    .required()
    .min(3)
    .max(100)
    .messages({
      "string.email.base": "must be valid email address",
      "string.min": "3 characters min",
      "string.max": "100 characters max",
    }),

  nick_name: Joi.string()
    .required()
    .pattern(/^[a-zA-Z0-9!#=$%&()_<>-]*$/)
    .empty()
    .min(1)
    .max(25)
    .messages({
      "string.pattern.base":
        "Letters, numbers, and symbols (!#=$%&()_<>-) are allowed",
      "string.min": "1 characters min",
      "string.max": "25 characters max",
    }),
});

export default userSingUpValidator;
