const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");
const Employees = require("./employees");

const Roles = sequelize.define(
  "Roles",
  {
    roleId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    empId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PlaybleModule: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    NonPlayble_module: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Roles",
  }
);

Employees.hasMany(Roles, { foreignKey: "empId" });
Roles.belongsTo(Employees, { foreignKey: "empId" });

sequelize
  .sync()
  .then(() => {
    console.log("Database and tables created successfully.");
  })
  .catch((error) => {
    console.error("Error synchronizing database:", error);
  });

module.exports = Roles;
