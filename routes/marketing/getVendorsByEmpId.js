const express = require("express");
const router = express.Router();
const { Sequelize } = require("sequelize");
const sequelize = require("../../connections/db");

// GET vendors by employee ID with pagination
router.get("/api/getVendorsByEmpId/:employeeId", async (req, res) => {
  try {
    const empId = req.params.employeeId;

    // Pagination input
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await sequelize.query(`
      SELECT COUNT(*) AS "totalCount"
      FROM "MarketingLeads"
      WHERE "telecaller" = :empId
    `, {
      replacements: { empId },
      type: Sequelize.QueryTypes.SELECT,
    });

    const totalRecords = parseInt(countResult.totalCount);

    // Get paginated data
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
        ml."createdAt" AS "leadCreatedAt",
        ml."updatedAt" AS "leadUpdatedAt",
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'remark', mr."remark",
              'remarkDateTime', mr."remarkDateTime",
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
      WHERE ml."telecaller" = :empId
      GROUP BY ml."SrNo", ml."LeadId"
      ORDER BY ml."SrNo" ASC
      LIMIT :limit OFFSET :offset
    `, {
      replacements: { empId, limit, offset },
      type: Sequelize.QueryTypes.SELECT,
    });

    return res.status(200).send({
      data: results,
      message: "Data found",
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    });
  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).send({ message: "Internal server error", error });
  }
});

module.exports = router;
