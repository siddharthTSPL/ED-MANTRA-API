const express = require("express");
const router = express.Router();
const Employees = require("../../modals/employees");

router.get(
  "/api/getAllVendorManagementExecutive",
  //   authenticate(accecableModules),
  async (req, res) => {
    try {
      const result = await Employees.findAll({
        where: {
          role: "VendorManagementExecutive",
          empStatus: 'active'
        },
      });
      const data = result[0];

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
