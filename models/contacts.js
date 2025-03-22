const sequelize = require("./sequelize");
const { DataTypes } = require("sequelize");
const userModel = require("./users");

const Contact = sequelize.define("Contact", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Contact.belongsTo(userModel, {
  foreignKey: "id",
  onDelete: "CASCADE",
});

module.exports = Contact;
