


const express = require("express");
const router = express.Router();
const ExcelData = require("../../modals/excelData");
const { Sequelize, Op } = require("sequelize");
const Remarks = require("../../modals/remarks");
const Employees = require("../../modals/employees");
const authenticate = require("../../Middleware/authenticate");

const accecableModules = [
  { permission: "USER_MANAGEMENT" },
  { permission: "LEAD_MANAGEMENT" },
];

router.get("/api/getLead", authenticate(accecableModules), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const whereClause = {};

    // === 1. Text filters with LIKE ===
    if (req.query.SrNo) {
      whereClause.SrNo = { [Op.like]: `%${req.query.SrNo}%` };
    }
    if (req.query.fullName) {
      whereClause.fullName = { [Op.like]: `%${req.query.fullName}%` };
    }
    if (req.query.mobile) {
      whereClause.mobile = { [Op.like]: `%${req.query.mobile}%` };
    }
    if (req.query.city) {
      whereClause.city = { [Op.like]: `%${req.query.city}%` };
    }
    if (req.query.pincode) {
      whereClause.pincode = { [Op.like]: `%${req.query.pincode}%` };
    }
    if (req.query.query) {
      whereClause.query = { [Op.like]: `%${req.query.query}%` };
    }
    if (req.query.status) {
      whereClause.status = { [Op.like]: `%${req.query.status}%` };
    }
    if (req.query.source) {
      whereClause.source = { [Op.like]: `%${req.query.source}%` };
    }

    // === 2. Exact match (dropdown/select) ===
    if (req.query.telecaller) {
      whereClause.telecaller = req.query.telecaller;
    }

    // === 3. Date Filters ===
    if (req.query.nextfollowFrom || req.query.nextfollowTo) {
      whereClause.nextfollow = {};
      if (req.query.nextfollowFrom) {
        whereClause.nextfollow[Op.gte] = new Date(req.query.nextfollowFrom);
      }
      if (req.query.nextfollowTo) {
        whereClause.nextfollow[Op.lte] = new Date(req.query.nextfollowTo);
      }
    }

    if (req.query.createdAtFrom || req.query.createdAtTo) {
      whereClause.createdAt = {};
      if (req.query.createdAtFrom) {
        whereClause.createdAt[Op.gte] = new Date(req.query.createdAtFrom);
      }
      if (req.query.createdAtTo) {
        whereClause.createdAt[Op.lte] = new Date(req.query.createdAtTo);
      }
    }

    if (req.query.updatedAtFrom || req.query.updatedAtTo) {
      whereClause.updatedAt = {};
      if (req.query.updatedAtFrom) {
        whereClause.updatedAt[Op.gte] = new Date(req.query.updatedAtFrom);
      }
      if (req.query.updatedAtTo) {
        whereClause.updatedAt[Op.lte] = new Date(req.query.updatedAtTo);
      }
    }

    // === Debug Logging ===
    console.log("Page:", page, "Offset:", offset, "Limit:", limit);
    console.log("nextfollowFrom:", req.query.nextfollowFrom);
    console.log("nextfollowTo:", req.query.nextfollowTo);

    // === Fetch paginated and filtered data ===
    const data = await ExcelData.findAll({
      offset,
      limit,
      where: whereClause,
      attributes: [
        "SrNo",
        "LeadId",
        "telecaller",
        "fullName",
        "mobile",
        "altMobile",
        "email",
        "state",
        "city",
        "pincode",
        "query",
        "status",
        "rating",
        "source",
        "personName",
        "personContact",
        "createdAt",
        "updatedAt",
        "nextfollow",
      ],
      include: [
        {
          model: Remarks,
          attributes: ["remark", "remarkDateTime", "empId", "createdAt"],
          include: [
            {
              model: Employees,
              attributes: ["fname", "role"],
              required: true,
            },
          ],
          limit: 1,
          separate: true,
          order: [["createdAt", "DESC"]],
        },
      ],
      order: [["createdAt", "DESC"]], // ✅ KEY FIX: Use unique, time-based ordering
    });

    const totalCount = await ExcelData.count({
      where: whereClause,
      distinct: true,
      col: "LeadId", // or "SrNo" if it's the unique column
    });

    return res.status(200).send({
      data,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      message: "Data fetched successfully",
    });
  } catch (error) {
    console.error("Error in /api/getLead:", error);
    return res.status(500).send({
      message: "An error occurred while fetching leads",
      error,
    });
  }
});

module.exports = router;
