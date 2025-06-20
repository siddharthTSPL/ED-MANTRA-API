const express = require("express");
const router = express.Router();
const ExcelData = require("../../modals/excelData");
const { Sequelize } = require("sequelize");
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
          limit: 1,
          separate: true,
          order: [["createdAt", "DESC"]],
        },
      ],
      order: [["SrNo", "ASC"]],
    });

    const cleanData = data.filter(
      (row) => row && typeof row.SrNo !== "undefined"
    );

    const totalCount = await ExcelData.count({
      distinct: true,
      col: "LeadId", // Or use "SrNo" if that's your unique ID
    });

    return res.status(200).send({
      data: cleanData,
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
