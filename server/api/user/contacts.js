const router = require("express").Router();

const BadRequest = require("../../utils/error");
const contactModel = require("../../../models/contacts");
const joi = require("joi");
const { requireToken } = require("../../middlewares/jwt");

const listMessages = async (req, res, next) => {
  try {
    const { id } = req.user;

    const contact = await contactModel.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    return res.json({
      status: "OK",
      message: `List of all message userId ${id}`,
      data: contact,
    });
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const bodyValidationSchema = joi.object({
      message: joi.string().required(),
    });

    const { error, value } = bodyValidationSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const { id } = req.user;
    const { message } = value;

    await contactModel.create({
      user_id: id,
      message,
    });

    return res.status(201).json({
      status: "CREATED",
      message: "Create Contact Us Successfully",
      data: null,
    });
  } catch (error) {
    return next(error);
  }
};

router.post("/", requireToken, create);
router.get("/", requireToken, listMessages);

module.exports = router;
