const express = require("express");
const router = express.Router();
const ExcelData = require("../../modals/excelData");
const { Op } = require("sequelize");
const Remarks = require("../../modals/remarks");
const Employees = require("../../modals/employees");

router.get("/api/getAdmissionLeadbyAdmin", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const offset = (page - 1) * limit;

    const totalRecords = await ExcelData.count({
      where: { status: "Admission" },
    });

    const data = await ExcelData.findAll({
      where: { status: "Admission" },
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
      res.status(404).send({ message: "No admission leads found." });
    }
  } catch (error) {
    console.error("Error fetching admission leads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
