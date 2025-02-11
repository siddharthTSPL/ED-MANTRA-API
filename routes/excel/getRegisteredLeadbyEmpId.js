const express = require("express");
const router = express.Router();
const ExcelData = require("../../modals/excelData");
const { Op, Sequelize } = require("sequelize");
const Remarks = require("../../modals/remarks");
const Employees = require("../../modals/employees");


router.get("/api/getRegisteredLeadbyEmpId/:employeeId", async (req, res) => {
  try {
    const empId = req.params.employeeId;
    const data = await ExcelData.findAll({
      where: {
        telecaller: empId,
        // counselor: empId,
        status: "Registration", // Filter by status "Registration"
      },
      include: [
        {
          model: Remarks,
          attributes: ['remark', 'remarkDateTime', 'empId' , "createdAt"],
          include: [
            {
              model: Employees,
              attributes: ['fname', 'role'],
              where: {
                empId: {
                  [Op.col]: 'Remarks.empId' // Using Op.col to reference column
                }
              },
              required: true,
            },
          ],
        },
      ],
      attributes: [
        'SrNo',
        'LeadId',
        'telecaller',
        'fullName',
        'mobile',
        'altMobile',
        'email',
        'state',
        'city',
        'pincode',
        'query',
        'status',
        'rating',
        // 'remark',
        'createdAt',
        'updatedAt',
        'nextfollow',
        'source',
        'personName',
        'personContact',
        
      ],
      order: [["SrNo", "ASC"]], // Sort by SrNo in ascending order
      nest: true,
    });

    const jsonData = data.map(lead => lead.toJSON());
    console.log(jsonData)

    if (data && data.length > 0) {
      res.status(200).send({ data, message: "Data found" });
    } else {
      res
        .status(404)
        .send({ message: "No data found for the provided employee ID" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
