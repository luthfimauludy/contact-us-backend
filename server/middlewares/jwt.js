const BadRequest = require("../utils/error");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const jwtSecretToken = process.env.JWT_SECRET_TOKEN;

const requireToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      const payload = jwt.verify(token, jwtSecretToken);
      if (payload) {
        req.user = payload;
        return next();
      }
    } else {
      throw new BadRequest("Invalid access token", 401);
    }
  } catch (error) {
    throw new BadRequest("Missing access token", 401);
  }
};

const haveAdminRole = (req, res, next) => {
  const { role } = req.user;
  if (role === "admin") {
    return next();
  } else {
    throw new BadRequest("You do not have permission", 403);
  }
};

module.exports = {
  requireToken,
  haveAdminRole,
};
