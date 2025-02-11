const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");
const Onboarding = require("../modals/candidateOnboarding"); // Import the Onboarding model

const Interview = sequelize.define(
  "Interview",
  {


    SrNo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true, // Ensure uniqueness for SrNo
    },

    companyId: {
      type: DataTypes.UUID,
      references: {
        model: "CompanyMangement",
        key: "companyId",
      },allowNull: false,
    },

      scheduleId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      interviewDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      candidateName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      jobProfile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      candidateStatus: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
  {
    tableName: "Interview",
  }
);

// Set up the association
Interview.hasOne(Onboarding, { foreignKey: "recordId", sourceKey: "scheduleId" });
Onboarding.belongsTo(Interview, { foreignKey: "recordId", targetKey: "scheduleId" });

module.exports = Interview;
