const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const multer = require("multer");
const path = require("path");
const Company = require("../../modals/company");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.post("/api/updateCompanyById", async (req, res) => {
  try {
    const {
      companyId,
      primaryPOCName,
      primaryPOCMobile,
      primaryPOCEmail,
      primaryPOCDesignation,
      secondaryPOCName,
      secondaryPOCMobile,
      secondaryPOCEmail,
      secondaryPOCDesignation,
      companyName,
      orgCategory,
      vacancyStatus,
      jobProfile,
      sector,
      location,
      noOfVacancy,
      salaryRangeMin,
      salaryRangeMax,
      experience,
      dateOfCreation,
      recruitementManager,
      jobDiscription,
      pdcDate,
      tANDc,
    } = req?.body;

    const updatedData = {
      primaryPOCName,
      primaryPOCMobile,
      primaryPOCEmail,
      primaryPOCDesignation,
      secondaryPOCName,
      secondaryPOCMobile,
      secondaryPOCEmail,
      secondaryPOCDesignation,
      companyName,
      orgCategory,
      vacancyStatus,
      jobProfile,
      sector,
      location,
      noOfVacancy,
      salaryRangeMin,
      salaryRangeMax,
      experience,
      dateOfCreation,
      recruitementManager,
      jobDiscription,
      pdcDate,
      tANDc,
    };

    const result = await Company.update(updatedData, {
      where: { companyId },
      returning: true,
    });
    res.status(200).json({
      errorCode: 0,
      message: "Data Updated Successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in Data Updating", error);
    return res.status(500).json({
      data: null,
      error: commonErrorCodes.somthingWentWrong.msg,
      status: commonErrorCodes.somthingWentWrong.code,
      message: null,
    });
  }
});

module.exports = router;
