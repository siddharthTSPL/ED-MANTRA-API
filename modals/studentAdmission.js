const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");

const StudentAdmission = sequelize.define(
  "StudentAdmission",
  {
    traineeId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course_fees: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: null
    },
    admission_fees: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "StudentAdmission",
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

module.exports = StudentAdmission;
