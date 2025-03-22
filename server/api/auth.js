const router = require("express").Router();

const BadRequest = require("../utils/error");
const userModel = require("../../models/users");
const joi = require("joi");
const bcrypt = require("bcrypt");

const register = async (req, res, next) => {
  try {
    const bodyValidationSchema = joi.object({
      firstname: joi.string().max(20).required(),
      lastname: joi.string().max(20).required(),
      email: joi.string().max(50).email().required(),
      password: joi.string().min(8).required(),
    });

    const { error, value } = bodyValidationSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const { firstname, lastname, email, password } = value;

    const userExist = await userModel.findOne({
      where: { email },
    });
    if (userExist) {
      throw new BadRequest("User already exist");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    userModel.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword,
    });

    return res.status(201).json({
      status: "CREATED",
      message: "Register Successfully",
      data: null,
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const bodyValidationSchema = joi.object({
      email: joi.string().max(50).email().required(),
      password: joi.string().min(8).required(),
    });

    const { error, value } = bodyValidationSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const { email, password } = value;

    const user = await userModel.findOne({
      where: { email },
    });
    if (!user) {
      throw new BadRequest("User not found");
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new BadRequest("Password incorrect");
    }

    return res.json(user);
  } catch (error) {
    return next(error);
  }
};

router.post("/register", register);
router.post("/login", login);

module.exports = router;
