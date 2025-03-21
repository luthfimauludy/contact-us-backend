const joi = require("joi");

const validateRegister = (data) => {
  const schema = joi.object({
    firstName: joi.string().max(20).required(),
    lastName: joi.string().max(20).required(),
    email: joi.string().max(50).email().required(),
    password: joi.string().min(8).required(),
  });

  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = joi.object({
    email: joi.string().max(50).email().required(),
    password: joi.string().min(8).required(),
  });

  return schema.validate(data);
};

module.exports = {
  validateRegister,
  validateLogin,
};
