const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");
const ExcelData = require("./excelData");
const Employees = require("./employees");


const Remarks = sequelize.define(
  "Remarks",
  {
    LeadId: {
      type: DataTypes.STRING,
      references: {
        model: "ExcelData",
        key: "LeadId",
      },
      allowNull: false,
    },
    remarkId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    remarkDateTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    empId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Employees",
        key: "empId",
      },
    },
  },
  {
    tableName: "Remarks",
  }
);

ExcelData.hasMany(Remarks, { foreignKey: 'LeadId' });
Remarks.belongsTo(ExcelData , { foreignKey: 'LeadId' });

Employees.hasMany(Remarks, { foreignKey: 'empId' });
Remarks.belongsTo(Employees , { foreignKey: 'empId' });

sequelize
  .sync()
  .then(() => {
    console.log("Database and tables created successfully.");
  })
  .catch((error) => {
    console.error("Error synchronizing database:", error);
  });

module.exports = Remarks;
