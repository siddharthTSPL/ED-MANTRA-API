const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");

const StudentRegistration = sequelize.define(
  "StudentRegistration",
  {
    LeadId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    traineeId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    registeredBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    altMobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regFees: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "StudentRegistration",
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

module.exports = StudentRegistration;
