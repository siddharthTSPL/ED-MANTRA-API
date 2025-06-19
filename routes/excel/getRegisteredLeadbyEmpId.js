const express = require("express");
const router = express.Router();
const ExcelData = require("../../modals/excelData");
const { Op } = require("sequelize");
const Remarks = require("../../modals/remarks");
const Employees = require("../../modals/employees");

router.get("/api/getRegisteredLeadbyEmpId/:employeeId", async (req, res) => {
  try {
    const empId = req.params.employeeId;

    // 🔢 Pagination params from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const offset = (page - 1) * limit;

    const { count, rows } = await ExcelData.findAndCountAll({
      where: {
        telecaller: empId,
        status: "Registration",
      },
      include: [
        {
          model: Remarks,
          attributes: ["remark", "remarkDateTime", "empId", "createdAt"],
          include: [
            {
              model: Employees,
              attributes: ["fname", "role"],
              where: {
                empId: {
                  [Op.col]: "Remarks.empId",
                },
              },
              required: true,
            },
          ],
          separate: true, // 🧠 Prevents N+1 joins issue
          order: [["createdAt", "ASC"]],
        },
      ],
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
        "createdAt",
        "updatedAt",
        "nextfollow",
        "source",
        "personName",
        "personContact",
      ],
      offset,
      limit,
      order: [["SrNo", "ASC"]],
      nest: true,
    });

    return res.status(200).send({
      data: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalRecords: count,
      message: "Registered leads fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching registered leads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
