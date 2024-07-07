const Joi = require("joi");

exports.createOrgSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
});

exports.addUserToOrgSchema = Joi.object({
  userId: Joi.string().required(),
});
