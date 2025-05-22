const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");

const NoticeBoard = sequelize.define("NoticeBoard", {
  noticeId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
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
}, {
  tableName: "NoticeBoard",
});

sequelize.sync()
  .then(() => console.log("NoticeBoard table synced"))
  .catch((err) => console.error("Sync error:", err));

module.exports = NoticeBoard;
