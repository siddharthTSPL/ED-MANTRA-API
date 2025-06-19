/** 
const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");

const Locations = sequelize.define(
  "Locations",
  {
    SrNo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    locationId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    empId: { type: DataTypes.STRING, allowNull: false },
    state: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  },
  {
    tableName: "Locations",
  }
);


sequelize
  .sync()
  .then(() => console.log("Location table synced"))
  .catch((err) => console.error("Sync error:", err));

module.exports = Locations;
*/