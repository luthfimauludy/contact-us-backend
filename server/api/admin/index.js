const router = require("express").Router();

const BadRequest = require("../../utils/error");
const userModel = require("../../../models/users");
const contactModel = require("../../../models/contacts");
const joi = require("joi");
const { requireToken, haveAdminRole } = require("../../middlewares/jwt");

const listUsers = async (req, res, next) => {
  try {
    const users = await userModel.findAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });

    return res.json({
      status: "OK",
      message: "List of all user",
      data: {
        users,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const detailUser = async (req, res, next) => {
  try {
    const bodyValidationSchema = joi.object({
      userId: joi.string().required(),
    });

    const { error, value } = bodyValidationSchema.validate(req.params);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const { userId } = value;

    const user = await userModel.findByPk(userId, {
      where: {
        user_id: userId,
      },
    });
    if (!user) {
      throw new BadRequest("User not found");
    }

    return res.json({
      status: "OK",
      message: "Detail user",
      data: {
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};

const listMessages = async (req, res, next) => {
  try {
    // validasi parameter
    const bodyValidationSchema = joi.object({
      userId: joi.string().required(),
    });

    const { error, value } = bodyValidationSchema.validate(req.params);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    // dapetin user dan validasi kalau usernya ada
    const { userId } = value;

    const user = await userModel.findByPk(userId, {
      where: {
        user_id: userId,
      },
    });
    if (!user) {
      throw new BadRequest("User not found");
    }

    // dapetin list message punya user
    const contact = await contactModel.findAll({
      where: {
        user_id: userId,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    // return data
    return res.json({
      status: "OK",
      message: "List messages",
      data: contact,
    });
  } catch (error) {
    return next(error);
  }
};

const detailMessage = async (req, res, next) => {
  try {
    // validasi parameter
    const bodyValidationSchema = joi.object({
      userId: joi.string().required(),
    });

    const { error, value } = bodyValidationSchema.validate(req.params);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    // dapetin user dan validasi kalau usernya ada
    const { userId } = value;

    const user = await userModel.findByPk(userId, {
      where: {
        user_id: userId,
      },
    });
    if (!user) {
      throw new BadRequest("User not found");
    }

    // dapetin message dan validasi kalau messagenya ada
    const contact = await contactModel.findOne({
      where: {
        contact_id: contact.id,
      },
    });
    if (!contact.message) {
      throw new BadRequest("Message not found");
    }

    // return data
    return res.json({
      status: "OK",
      message: "Detail message",
      data: contact,
    });
  } catch (error) {
    return next(error);
  }
};

// const editMessage = async (req, res, next) => {
//   try {
//   } catch (error) {
//     return next(error);
//   }
// };

router.get("/users", requireToken, haveAdminRole, listUsers);
router.get("/users/:userId", requireToken, haveAdminRole, detailUser);
router.get(
  "/users/:userId/contacts",
  requireToken,
  haveAdminRole,
  listMessages
);
router.get(
  "/users/:userId/contacts/:contactId",
  requireToken,
  haveAdminRole,
  detailMessage
);
// router.patch(
//   "/users/:userId/contacts/:contactId",
//   requireToken,
//   haveAdminRole,
//   editMessage
// );

module.exports = router;
