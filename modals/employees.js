const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");

const Employees = sequelize.define(
  "Employees",
  {
    empId: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    empCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nationalId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    perAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    doj: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otpCreatedTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ctc: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    empStatus:{
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    tableName: "Employees",
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

module.exports = Employees;
