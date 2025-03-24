const router = require("express").Router();

const BadRequest = require("../../utils/error");
const userModel = require("../../../models/users");
const contactModel = require("../../../models/contacts");
const joi = require("joi");
const { requireToken, haveAdminRole } = require("../../middlewares/jwt");

const listUsers = async (req, res, next) => {
  try {
    // find all list user
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
    // validation request params
    const bodyValidationSchema = joi.object({
      userId: joi.string().required(),
    });

    const { error, value } = bodyValidationSchema.validate(req.params);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const { userId } = value;

    // validate user exists
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
    // validation request params
    const bodyValidationSchema = joi.object({
      userId: joi.string().required(),
    });

    const { error, value } = bodyValidationSchema.validate(req.params);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const { userId } = value;

    // validate user exists
    const user = await userModel.findByPk(userId, {
      where: {
        user_id: userId,
      },
    });
    if (!user) {
      throw new BadRequest("User not found");
    }

    // find contact model for all message
    const contact = await contactModel.findAll({
      where: {
        user_id: userId,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

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
    // validation request params
    const bodyValidationSchema = joi.object({
      userId: joi.string().required(),
      contactId: joi.string().required(),
    });

    const { error, value } = bodyValidationSchema.validate(req.params);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const { userId, contactId } = value;

    // validate user exists
    const user = await userModel.findByPk(userId, {
      where: {
        user_id: userId,
      },
    });
    if (!user) {
      throw new BadRequest("User not found");
    }

    // validate contact exists
    const contact = await contactModel.findByPk(contactId, {
      where: {
        contact_id: contactId,
      },
    });
    if (!contact) {
      throw new BadRequest("Contact not found");
    }

    return res.json({
      status: "OK",
      message: "Detail message",
      data: contact,
    });
  } catch (error) {
    return next(error);
  }
};

const editMessage = async (req, res, next) => {
  try {
    // validation request body
    const bodyValidationSchema = joi.object({
      message: joi.string().required(),
    });

    const { error, value } = bodyValidationSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const { userId, contactId } = req.params;
    const { message } = value;

    // validate user exists
    const user = await userModel.findByPk(userId, {
      where: {
        user_id: userId,
      },
    });
    if (!user) {
      throw new BadRequest("User not found");
    }

    // validate contact exists
    const contact = await contactModel.findByPk(contactId, {
      where: {
        contact_id: contactId,
      },
    });
    if (!contact) {
      throw new BadRequest("Contact not found");
    }

    // update message in the contact
    await contact.update({ message });

    return res.status(200).json({
      status: "UPDATED",
      message: "Message updated successfully",
      data: contact,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const { userId, contactId } = req.params;

    // validate user exists
    const user = await userModel.findByPk(userId, {
      where: {
        user_id: userId,
      },
    });
    if (!user) {
      throw new BadRequest("User not found");
    }

    // validate contact exists
    const contact = await contactModel.findByPk(contactId, {
      where: {
        contact_id: contactId,
      },
    });
    if (!contact) {
      throw new BadRequest("Contact not found");
    }

    // delete the contact message
    await contact.destroy();

    return res.status(200).json({
      status: "DELETED",
      message: "Message deleted successfully",
      data: null,
    });
  } catch (error) {
    return next(error);
  }
};

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
router.patch(
  "/users/:userId/contacts/:contactId",
  requireToken,
  haveAdminRole,
  editMessage
);
router.delete(
  "/users/:userId/contacts/:contactId",
  requireToken,
  haveAdminRole,
  deleteMessage
);

module.exports = router;
