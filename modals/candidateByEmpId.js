/** 
const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");

const CandidateRegistration = sequelize.define(
  "CandidateManagementByEmp",
  {

    SrNo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true, // Ensure uniqueness for SrNo
    },


    candidateId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maritalStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true, // Ensure uniqueness for SrNo
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    highestQualification: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otherQualification: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    experience: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    keySkills: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    language: {
      type: DataTypes.JSONB, 
      allowNull: true,
    },
    aadharDocName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    agreementDocName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resumeDocName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    latestPhoto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    yearsOfExperience: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    monthsOfExperience: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currentCTC: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expectedCTC: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    registeredDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    personName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    personContact: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    residentialAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    residentialCity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mailingAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mailingCity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },

     createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  },
  {
    tableName: "CandidateManagementByEmp",
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

module.exports = CandidateRegistration;
*/