const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");
const CompanyMangement = require("./company")

const Vacancy = sequelize.define(
  "Vacancy",
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
      },
      allowNull: false,
    },
    vacancyId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },


    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    companyName:{
      type: DataTypes.STRING,
      allowNull: true,

    },

    primaryPOCMobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },

   
    vacancyStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    jobProfile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    noOfVacancy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salaryRangeMin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salaryRangeMax: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    experience: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    genderpref: {
      type: DataTypes.STRING,
      allowNull: true,

    },
    dateOfCreation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recruitementManager: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    jobDiscription: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    pdcDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    tANDc: {

      type: DataTypes.STRING,
      allowNull: true,
    },
    
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  },
  {
    tableName: "Vacancy",
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

module.exports = Vacancy;
