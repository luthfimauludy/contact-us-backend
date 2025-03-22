const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

// Option 1: Passing a connection URI
const sequelize = new Sequelize(process.env.DATABASE_URL); // Example for postgres

module.exports = sequelize;
