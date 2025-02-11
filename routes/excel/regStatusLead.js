const express = require("express");
const router = express.Router();
const ExcelData = require("../../modals/excelData");
// const { Op } = require("sequelize");

router.get("/api/getRegLeadByEmpId/:employeeId", async (req, res) => {
  try {
    const empId = req.params.employeeId;

    const data = await ExcelData.findAll({
      where: {
        telecaller: empId,
        status: "Registration"
      },
    });

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
