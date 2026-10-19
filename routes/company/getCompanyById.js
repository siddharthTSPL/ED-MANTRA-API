const express = require("express");
const router = express.Router();

const Company = require("../../modals/company");
const CompanyRemarks = require("../../modals/companyRemarks");

const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.post("/api/getCompanyById", async (req, res) => {
  try {
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({
        errorCode: 1,
        message: "Company ID is required",
        data: null,
      });
    }

    // Get company
    const company = await Company.findOne({
      where: { companyId },
    });

    if (!company) {
      return res.status(404).json({
        errorCode: 1,
        message: "Company not found",
        data: null,
      });
    }

    // Get all remarks for this company
    const remarks = await CompanyRemarks.findAll({
      where: { companyId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      errorCode: 0,
      message: "Company details fetched successfully",
      data: {
        company,
        remarks,
      },
    });
  } catch (error) {
    console.error("Error fetching company:", error);

    return res.status(500).json({
      data: null,
      error: commonErrorCodes.somthingWentWrong.msg,
      status: commonErrorCodes.somthingWentWrong.code,
      message: null,
    });
  }
});

module.exports = router;