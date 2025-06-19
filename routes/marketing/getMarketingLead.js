const express = require("express");
const router = express.Router();
const { Sequelize, Op } = require("sequelize");
const sequelize = require("../../connections/db");
const authenticate = require("../../Middleware/authenticate");

// Optional: Authentication Middleware
const accecableModules = [
  { permission: "USER_MANAGEMENT" },
  { permission: "MARKETING_MANAGEMENT" },
];

// router.get("/api/getMarketingLead", authenticate(accecableModules), async (req, res) => {
router.get("/api/getMarketingLead", async (req, res) => {
  try {
    // Pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const offset = (page - 1) * limit;

    // Total count query
    const [countResult] = await sequelize.query(`
      SELECT COUNT(*) AS "totalCount" FROM "MarketingLeads"
    `);
    const totalRecords = parseInt(countResult[0].totalCount);

    // Paginated data query
    const [results] = await sequelize.query(`
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
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'remark', mr."remark",
              'createdAt', mr."createdAt",
              'empId', mr."empId",
              'employee', jsonb_build_object(
                'fname', e."fname",
                'role', e."role"
              )
            )
          ) FILTER (WHERE mr."remark" IS NOT NULL), '[]'
        ) AS "remarks"
      FROM "MarketingLeads" ml
      LEFT JOIN "MarketingRemarks" mr ON ml."LeadId" = mr."LeadId"
      LEFT JOIN "Employees" e ON mr."empId" = e."empId"
      GROUP BY ml."SrNo", ml."LeadId"
      ORDER BY ml."SrNo" ASC
      LIMIT ${limit} OFFSET ${offset}
    `);

    if (results.length > 0) {
      return res.status(200).send({
        data: results,
        message: "Data found",
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
      });
    } else {
      return res.status(200).send({ data: [], message: "No data found" });
    }
  } catch (error) {
    console.error("Error fetching marketing leads:", error);
    return res.status(500).send({ message: "An error occurred", error });
  }
});

module.exports = router;
