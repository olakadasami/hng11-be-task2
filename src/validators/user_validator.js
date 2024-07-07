const Joi = require("joi");

exports.registerSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().min(3).required(),
  lastName: Joi.string().min(3).required(),
  password: Joi.string().required(),
  phone: Joi.string(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
