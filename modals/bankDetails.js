const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");
const Employees = require("./employees");

const BankDetails = sequelize.define(
  "BankDetails",
  {
    empId: {
      type: DataTypes.STRING,
      references: {
        model: Employees,
        key:"empId",
      },
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountNum: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ifsc: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  },
  {
    tableName: "BankDetails",
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

module.exports = BankDetails
