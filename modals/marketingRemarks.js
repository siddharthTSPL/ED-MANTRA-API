const sequelize = require("../connections/db");
const { DataTypes } = require("sequelize");
const MarketingLeads = require("./marketingLeads");
const Employees = require("./employees");

const MarketingRemarks = sequelize.define(
  "MarketingRemarks",
  {
    LeadId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: MarketingLeads, // Corrected reference
        key: "LeadId",
      },
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
      type: DataTypes.DATE, // Changed from STRING to DATE
      allowNull: false,
    },
    empId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Employees, // Corrected reference
        key: "empId",
      },
    },
  },
  {
    tableName: "MarketingRemarks",
  }
);

// Corrected Associations
MarketingLeads.hasMany(MarketingRemarks, { foreignKey: "LeadId" });
MarketingRemarks.belongsTo(MarketingLeads, { foreignKey: "LeadId" });

Employees.hasMany(MarketingRemarks, { foreignKey: "empId" });
MarketingRemarks.belongsTo(Employees, { foreignKey: "empId" });

MarketingRemarks.belongsTo(Employees, { foreignKey: 'empId', as: 'employee' });

// Sync database
sequelize
  .sync()
  .then(() => {
    console.log("Database and tables created successfully.");
  })
  .catch((error) => {
    console.error("Error synchronizing database:", error);
  });

module.exports = MarketingRemarks;
