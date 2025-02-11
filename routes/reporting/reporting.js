const express = require('express');
const router = express.Router();
const { Sequelize, Op} = require('sequelize');
const ExcelData = require('../../modals/excelData');
const Remarks = require('../../modals/remarks');
const Employees = require('../../modals/employees');


router.get('/api/reporting', async (req, res) => {
  try {
    const data = await ExcelData.findAll({
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
          attributes: [
            "remark",
            "remarkDateTime",
            "empId",
            "createdAt",
          ],
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
          separate: true,  // This forces Sequelize to use a subquery for Remarks
          order: [["createdAt", "DESC"]],
          limit: 1, // Only include the most recent remark
        },
      ],
      order: [["SrNo", "ASC"]],
    });

    if (data) {
      return res.status(200).send({ data, message: "Data found " });
    } else {
      return res.status(200).send({ data: null, message: "Data not found " });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "An error occurred", error });
  }
});

module.exports = router;
