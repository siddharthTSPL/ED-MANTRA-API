// models/Audio.js

const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");

const Audio = sequelize.define(
  "Audio",
  {
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lead_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emp_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Lead_Audio",
  }
);
sequelize
  .sync()
  .then(() => {
    console.log("Database and tables created successfully.");
  })
  .catch((error) => {
    console.error("Error synchronizing database:", error);
  });
module.exports = Audio;
