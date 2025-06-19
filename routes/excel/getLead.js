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
    // ✅ Pagination parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    // ✅ Fetch paginated data with only the latest remark
    const data = await ExcelData.findAll({
      offset,
      limit,
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
          // ✅ Only fetch latest remark per lead
          limit: 1,
          order: [["createdAt", "DESC"]],
        },
      ],
      order: [["SrNo", "ASC"]],
    });

    // ✅ Optional: Count total records for pagination
    const totalCount = await ExcelData.count();

    return res.status(200).send({
      data,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      message: "Data fetched successfully",
    });
  } catch (error) {
    console.error("Error in /api/getLead:", error);
    return res.status(500).send({ message: "An error occurred", error });
  }
});

module.exports = router;
