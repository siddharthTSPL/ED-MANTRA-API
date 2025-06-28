/*const express = require("express");
const router = express.Router();
const Company = require("../../modals/company"); // assuming modal is correctly named
const authenticate = require("../../Middleware/authenticate");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

// Existing: Get company by companyId
router.post("/api/getCompanyById", async (req, res) => {
  try {
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({
        errorCode: 1,
        message: "companyId is required",
        data: null,
      });
    }

    const result = await Company.findOne({ where: { companyId } });

    if (!result) {
      return res.status(404).json({
        errorCode: 1,
        message: "No company found with the provided ID",
        data: null,
      });
    }

    return res.status(200).json({
      errorCode: 0,
      message: "Company fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in /api/getCompanyById:", error);
    return res.status(500).json({
      errorCode: commonErrorCodes.somthingWentWrong.code,
      message: commonErrorCodes.somthingWentWrong.msg,
      data: null,
    });
  }
});


// ✅ New: Get all companies by empId (createdBy)
router.post("/api/getAllCompanies", async (req, res) => {
  try {
    const { empId } = req.body;

    if (!empId) {
      return res.status(400).json({
        errorCode: 1,
        message: "empId is required",
        data: null,
      });
    }

    const companies = await Company.findAll({
      where: { createdBy: empId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      errorCode: 0,
      message: "Companies fetched successfully",
      data: companies,
    });
  } catch (error) {
    console.error("Error in /api/getAllCompanies:", error);
    return res.status(500).json({
      errorCode: commonErrorCodes.somthingWentWrong.code,
      message: commonErrorCodes.somthingWentWrong.msg,
      data: null,
    });
  }
});

module.exports = router;
*/