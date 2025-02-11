const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");

const ExcelData = sequelize.define(

  "ExcelData",
  {


    SrNo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true, // Ensure uniqueness for SrNo
    },


    LeadId: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
      defaultValue: () => {
        // Generate alphanumeric LeadId
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let leadId = "L";
        for (let i = 1; i <= 5; i++) {
          leadId += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }
        return leadId;
      },
    },
    telecaller: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
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
      allowNull: true,
    },
    query: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    nextfollow: {
      type: DataTypes.DATE, // Use DATE data type for storing date and time values
      allowNull: false,
    },
    

    rating: {
      type: DataTypes.STRING,
      allowNull: false,
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

    remark: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
  },
  {
    tableName: "ExcelData",
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

module.exports = ExcelData;
