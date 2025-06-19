const express = require("express");
const router = express.Router();
const ExcelData = require("../../modals/excelData");
const { Op } = require("sequelize");
const Remarks = require("../../modals/remarks");
const Employees = require("../../modals/employees");

router.get("/api/getLeadByEmpId/:employeeId", async (req, res) => {
  try {
    const empId = req.params.employeeId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Total count for pagination
    const totalCount = await ExcelData.count({
      where: {
        telecaller: empId,
        status: { [Op.notIn]: ["Registration", "Admission"] },
      },
    });

    const leads = await ExcelData.findAll({
      where: {
        telecaller: empId,
        status: { [Op.notIn]: ["Registration", "Admission"] },
      },
      attributes: [
        'SrNo', 'LeadId', 'telecaller', 'fullName', 'mobile', 'altMobile', 'email',
        'state', 'city', 'pincode', 'query', 'status', 'rating',
        'createdAt', 'updatedAt', 'nextfollow', 'source', 'personName', 'personContact',
      ],
      include: [
        {
          model: Remarks,
          attributes: ['remark', 'remarkDateTime', 'empId', 'createdAt'],
          include: [
            {
              model: Employees,
              attributes: ['fname', 'role'],
              where: {
                empId: { [Op.col]: 'Remarks.empId' },
              },
              required: true,
            },
          ],
          separate: true,
          order: [["createdAt", "ASC"]],
        },
      ],
      order: [["SrNo", "ASC"]],
      offset,
      limit,
      nest: true,
    });

    res.status(200).json({
      data: leads,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
      message: "Data fetched successfully",
    });
  } catch (error) {
    console.error("Error in getLeadByEmpId API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
