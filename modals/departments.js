const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");

const Departments = sequelize.define(
  "Departments",
  {
    departmentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departmentManagerID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Departments",
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

module.exports = Departments
