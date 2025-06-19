const express = require("express");
const router = express.Router();
const ExcelData = require("../../modals/excelData");
const { Op } = require("sequelize");
const Remarks = require("../../modals/remarks");
const Employees = require("../../modals/employees");

router.get("/api/getAdmissionLeadbyEmpId/:employeeId", async (req, res) => {
  try {
    const empId = req.params.employeeId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const offset = (page - 1) * limit;

    const totalRecords = await ExcelData.count({
      where: {
        telecaller: empId,
        status: "Admission",
      },
    });

    const data = await ExcelData.findAll({
      where: {
        telecaller: empId,
        status: "Admission",
      },
      include: [
        {
          model: Remarks,
          attributes: ['remark', 'remarkDateTime', 'empId', 'createdAt'],
          include: [
            {
              model: Employees,
              attributes: ['fname', 'role'],
              where: {
                empId: {
                  [Op.col]: 'Remarks.empId',
                },
              },
              required: true,
            },
          ],
          separate: true,
          order: [['createdAt', 'ASC']],
        },
      ],
      attributes: [
        'SrNo', 'LeadId', 'telecaller', 'fullName', 'mobile', 'altMobile', 'email',
        'state', 'city', 'pincode', 'query', 'status', 'rating',
        'createdAt', 'updatedAt', 'nextfollow', 'source', 'personName', 'personContact'
      ],
      order: [['SrNo', 'ASC']],
      offset,
      limit,
      nest: true,
    });

    const jsonData = data.map(lead => lead.toJSON());

    if (data && data.length > 0) {
      res.status(200).send({
        data: jsonData,
        message: "Data found",
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
      });
    } else {
      res.status(404).send({ message: "No data found for the provided employee ID" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
