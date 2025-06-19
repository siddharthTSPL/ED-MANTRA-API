/** 
const sequelize = require("../connections/db"); // Adjust path if needed
const { DataTypes } = require("sequelize");

const Sector = sequelize.define(
  "Sector",
  {
    SrNo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    sectorId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    empId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Sectors",
  }
);

// Sync model to DB
sequelize
  .sync()
  .then(() => console.log("Sector table synced"))
  .catch((err) => console.error("Sync error:", err));

module.exports = Sector;
*/