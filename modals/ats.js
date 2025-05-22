const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");

const NoticeBoard = sequelize.define(
  "NoticeBoard",
  {
    SrNo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    noticeId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    noticeDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    attachmentName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "NoticeBoard",
  }
);

// Sync the model with the database
sequelize
  .sync()
  .then(() => {
    console.log("NoticeBoard table created successfully.");
  })
  .catch((error) => {
    console.error("Error syncing NoticeBoard table:", error);
  });

  module.exports = NoticeBoard;
