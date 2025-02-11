const express = require("express");
const router = express.Router();
const Employees = require("../../modals/employees");

router.get("/api/getEmployeeByEmpId/:employeeId", async (req, res) => {
  try {
    const empId = req.params.employeeId;
    const data = await Employees.findOne({
      where: {
        empId: empId,
      },
    });

    if (data) {
      res.status(200).send({ data, message: "Employee found" });
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
