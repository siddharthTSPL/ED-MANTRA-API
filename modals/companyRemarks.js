const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");

const CompanyRemarks = sequelize.define(
  "CompanyRemarks",
  {
    SrNo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
    },

    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    remarksId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "CompanyRemarks",
    timestamps: true,
  }
);

sequelize
  .sync()
  .then(() => {
    console.log("CompanyRemarks table synchronized successfully.");
  })
  .catch((error) => {
    console.error("Error synchronizing CompanyRemarks:", error);
  });

module.exports = CompanyRemarks;