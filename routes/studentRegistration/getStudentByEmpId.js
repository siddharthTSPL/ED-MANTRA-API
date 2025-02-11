const express = require("express");
const router = express.Router();
const Student = require("../../modals/studentRegistration");


router.get("/api/getStudentByEmpId/:employeeId", async (req, res) => {
  try {
    const empId = req.params.employeeId;

    const data = await Student.findAll({
      where: {
        registeredBy: empId,
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
