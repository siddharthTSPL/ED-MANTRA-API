const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const multer = require("multer");
const path = require("path");
const Company = require("../../modals/company");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.post("/api/getCompanyById", async (req, res) => {
  try {
    const { companyId } = req?.body;

    const result = await Company.findAll({
      where: {
        companyId,
      },
    });
    res.status(200).json({
      errorCode: 0,
      message: "Data Fetched Successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in Data Fetching", error);
    return res.status(500).json({
      data: null,
      error: commonErrorCodes.somthingWentWrong.msg,
      status: commonErrorCodes.somthingWentWrong.code,
      message: null,
    });
  }
});

module.exports = router;
