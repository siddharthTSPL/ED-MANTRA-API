const express = require("express");
const router = express.Router();
const db = require("../../connections/db");
const Employees = require("../../modals/employees");
router.get(
  "/api/getAllEmployees",
  // authenticate(accecableModules),
  async (req, res) => {
    try {
      const result = await Employees.findAll({
        where: {
          empStatus: 'active',
          departmentId: ['sales', 'adminHO']
        }
      });
      res
        .status(200)
        .send({ data: result, message: "Data Fetched Successfully" });
    } catch (error) {
      console.error("Error getting data:", error);
      res.status(500).send({ error: "Internal server error" });
    }
  }
);

module.exports = router;