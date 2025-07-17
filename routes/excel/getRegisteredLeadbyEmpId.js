const express = require("express");
const router = express.Router();
const ExcelData = require("../../modals/excelData");
const { Op } = require("sequelize");
const Remarks = require("../../modals/remarks");
const Employees = require("../../modals/employees");
const authenticate = require("../../Middleware/authenticate");

const accessibleModules = [
  { permission: "USER_MANAGEMENT" },
  { permission: "LEAD_MANAGEMENT" },
];

router.get(
  "/api/getRegisteredLeadbyEmpId/:employeeId",
  authenticate(accessibleModules),
  async (req, res) => {
    try {
      const empId = req.params.employeeId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;

      // Build where clause
      const whereClause = {
        telecaller: empId,
        status: "Registration", // ✅ fixed status
      };

      // === Text filters ===
      const likeFields = ["fullName", "mobile", "city", "pincode", "query", "source", "telecaller"];
      likeFields.forEach((field) => {
        if (req.query[field]) {
          whereClause[field] = { [Op.like]: `%${req.query[field]}%` };
        }
      });

      // === Date filter helper ===
      const applyDateRange = (key) => {
        const from = req.query[`${key}From`];
        const to = req.query[`${key}To`];
        if (from || to) {
          whereClause[key] = {};
          if (from) whereClause[key][Op.gte] = new Date(from);
          if (to) whereClause[key][Op.lte] = new Date(to);
        }
      };

      applyDateRange("nextfollow");
      applyDateRange("createdAt");
      applyDateRange("updatedAt");

      // === Fetch paginated, filtered, full-remark data ===
      const leads = await ExcelData.findAll({
        where: whereClause,
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
            separate: true, // ✅ fetch all without affecting pagination
            attributes: ["remark", "remarkDateTime", "empId", "createdAt"],
            include: [
              {
                model: Employees,
                attributes: ["fname", "role"],
                required: true,
              },
            ],
            order: [["createdAt", "DESC"]],
          },
        ],
        order: [["SrNo", "ASC"]],
      });

      const cleanData = leads.filter((row) => row && typeof row.SrNo !== "undefined");

      const totalCount = await ExcelData.count({ where: whereClause });

      return res.status(200).send({
        data: cleanData,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        message: "Registered leads fetched successfully",
      });
    } catch (error) {
      console.error("Error in /api/getRegisteredLeadbyEmpId:", error);
      return res.status(500).json({
        message: "An error occurred while fetching registered leads",
        error,
      });
    }
  }
);

module.exports = router;
