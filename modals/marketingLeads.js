const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");

const MarketingLeads = sequelize.define(
  "MarketingLeads",
  {
    SrNo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true, // Make it primary if necessary
    },

    LeadId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      defaultValue: () => {
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
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    collegeCategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    brief: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    pocName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    pocMobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    pocEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    pocDesignation: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    objective: {
      type: DataTypes.STRING, // Changed from DATE to STRING
      allowNull: false,
    },

    otherObjective: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    interestLevel: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    otherSource: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    refSourceName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    refSourceMobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    decisionMaker: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    dmMobile: {
      type: DataTypes.STRING, // Fixed spelling from dmMobole to dmMobile
      allowNull: false,
    },

    dmDesignation: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    dmEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    preferredContactTiming: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    nextfollow: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "MarketingLeads",
  }
);

// Sync database
sequelize
  .sync()
  .then(() => {
    console.log("Database and tables created successfully.");
  })
  .catch((error) => {
    console.error("Error synchronizing database:", error);
  });

module.exports = MarketingLeads;
