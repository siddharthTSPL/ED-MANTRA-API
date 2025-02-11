const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");

const Company = sequelize.define(
  "CompanyMangement",
  {


    SrNo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true, // Ensure uniqueness for SrNo
    },

    companyId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    primaryPOCName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    primaryPOCMobile: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true, // Unique constraint
    },
    primaryPOCEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    primaryPOCDesignation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    secondaryPOCName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    secondaryPOCMobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    secondaryPOCEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    secondaryPOCDesignation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orgCategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    orgRate: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    orgAgree: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  },
  {
    tableName: "CompanyMangement",
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

module.exports = Company;
