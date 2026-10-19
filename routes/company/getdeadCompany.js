const express = require("express");
const router = express.Router();

const Company = require("../../modals/company");

router.get("/api/getdeadCompany", async (req, res) => {
  try {
    const data = await Company.findAll({
      where: {
        companyStatus: "Dead Company"
      },
      attributes: [
        "companyId",
        "primaryPOCName",
        "primaryPOCMobile",
        "primaryPOCEmail",
        "primaryPOCDesignation",

        "secondaryPOCName",
        "secondaryPOCMobile",
        "companyStatus",
        "followupDate",

        "companyStatus",
        "followupDate",

        "companyName",
        "orgCategory",
        "orgRate",

        "createdBy",
        "createdAt"
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      errorCode: 0,
      success: true,
      message: "Dead Company data fetched successfully",
      data: data,
      totalRecords: data.length
    });

  } catch (error) {
    console.error("Error fetching Dead Company:", error);

    return res.status(500).json({
      errorCode: 1,
      success: false,
      message: "Internal server error",
      error: error.message,
      data: []
    });
  }
});

module.exports = router;