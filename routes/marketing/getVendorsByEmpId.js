const express = require("express");
const router = express.Router();
const { Sequelize } = require("sequelize");
const sequelize = require("../../connections/db");
const authenticate = require("../../Middleware/authenticate");
const MarketingLeads = require("../../modals/marketingLeads");
const Employees = require("../../modals/employees");
const MarketingRemarks = require("../../modals/marketingRemarks");

const accessibleModules = [
  { permission: "USER_MANAGEMENT" },
  { permission: "MARKETING_MANAGEMENT" },
];

router.get("/api/getVendorsByEmpId/:employeeId", async (req, res) => {
    try {
      const empId = req.params.employeeId;
  
      const results = await sequelize.query(`
        SELECT 
          ml."SrNo",
          ml."LeadId",
          ml."telecaller",
          ml."clientName",
          ml."collegeCategory",
          ml."brief",
          ml."pocName",
          ml."pocMobile",
          ml."pocEmail",
          ml."pocDesignation",
          ml."address",
          ml."location",
          ml."objective",
          ml."otherObjective",
          ml."interestLevel",
          ml."status",
          ml."source",
          ml."otherSource",
          ml."refSourceName",
          ml."refSourceMobile",
          ml."decisionMaker",
          ml."dmMobile",
          ml."dmDesignation",
          ml."dmEmail",
          ml."preferredContactTiming",
          ml."nextfollow",
          ml."createdAt" as "leadCreatedAt",
          ml."updatedAt" as "leadUpdatedAt",
          COALESCE(json_agg(
            DISTINCT jsonb_build_object(
              'remark', mr."remark",
              'remarkDateTime', mr."remarkDateTime",
              'empId', mr."empId",
              'employee', jsonb_build_object(
                'fname', e."fname",
                'role', e."role"
              )
            )
          ) FILTER (WHERE mr."remark" IS NOT NULL), '[]') AS "remarks"
        FROM "MarketingLeads" ml
        LEFT JOIN "MarketingRemarks" mr ON ml."LeadId" = mr."LeadId"
        LEFT JOIN "Employees" e ON mr."empId" = e."empId"
        WHERE ml."telecaller" = :empId
        GROUP BY ml."SrNo", ml."LeadId"
        ORDER BY ml."SrNo" ASC
      `, {
        replacements: { empId },
        type: Sequelize.QueryTypes.SELECT,
      });
  
      if (results && results.length > 0) {
        return res.status(200).send({ data: results, message: "Data found" });
      } else {
        return res.status(404).send({ data: null, message: "No data found for the provided employee ID" });
      }
    } catch (error) {
      console.error("ERROR:", error);
      return res.status(500).send({ message: "Internal server error", error });
    }
  });
  
  

module.exports = router;
