const express = require("express");
const router = express.Router();
const { Sequelize, Op } = require("sequelize");
const sequelize = require("../../connections/db");
const authenticate = require("../../Middleware/authenticate");

const accessibleModules = [
  { permission: "USER_MANAGEMENT" },
  { permission: "MARKETING_MANAGEMENT" },
];

router.get("/api/getMarketingLead", authenticate(accessibleModules), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    // ✅ Get total record count
    const [countResult] = await sequelize.query(`
      SELECT COUNT(*) AS "totalCount" FROM "MarketingLeads"
    `);
    const totalCount = parseInt(countResult[0]?.totalCount || 0);

    // ✅ Fetch paginated data with remarks + employee details
    const [leads] = await sequelize.query(`
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
        ml."createdAt" AS "leadCreatedAt",
        ml."updatedAt" AS "leadUpdatedAt",
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
          ) FILTER (WHERE mr."remark" IS NOT NULL),
          '[]'
        ) AS "remarks"
      FROM "MarketingLeads" ml
      LEFT JOIN "MarketingRemarks" mr ON ml."LeadId" = mr."LeadId"
      LEFT JOIN "Employees" e ON mr."empId" = e."empId"
      GROUP BY ml."SrNo", ml."LeadId"
      ORDER BY ml."SrNo" ASC
      LIMIT ${limit} OFFSET ${offset}
    `);

    return res.status(200).json({
      data: leads,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      message: leads.length > 0 ? "Marketing leads fetched successfully" : "No marketing leads found",
    });
  } catch (error) {
    console.error("Error in /api/getMarketingLead:", error);
    return res.status(500).json({
      message: "An error occurred while fetching marketing leads",
      error,
    });
  }
});

module.exports = router;
