const router = require("express").Router();

const validation = require("../helpers/validationHelper");
const AuthHelper = require("../helpers/authHelper");
const BadRequest = require("../utils/error");

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const { error } = validation.validateRegister(req.body);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const response = await AuthHelper.register({
      firstName,
      lastName,
      email,
      password,
    });

    return res.send(response);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { error } = validation.validateLogin(req.body);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const response = await AuthHelper.login({ email, password });

    return res.send(response);
  } catch (error) {
    return next(error);
  }
};

router.post("/register", register);
router.post("/login", login);

module.exports = router;
