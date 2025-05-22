const express = require("express");
const router = express.Router();
const CompanyRegistration = require("../../modals/company");

router.post("/api/deleteBulkCompany", async (req, res) => {
    const { company } = req.body; // ✅ match frontend
  
    // Validate that company is an array
    if (!Array.isArray(company)) {
      return res.status(400).send({ errorCode: 1, message: "Invalid input format" });
    }
  
    const companyIds = company.map(c => c.companyId); // ✅ fix variable name here too
  
    try {
      await CompanyRegistration.destroy({ where: { companyId: companyIds } });
      res.status(200).send({ errorCode: 0, message: "Companies deleted successfully" });
    } catch (error) {
      console.error("Error deleting companies:", error);
      res.status(500).send({ errorCode: 2, message: "Internal server error" });
    }
  });
  

module.exports = router;
