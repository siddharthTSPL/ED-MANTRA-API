const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const multer = require("multer");
const path = require("path");
const Company = require("../../modals/company");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.post("/api/deleteCompanyById", async (req, res) => {
  try {
    const { companyId } = req.body;  // Make sure req.body contains companyId
    if (!companyId) {
      return res.status(400).json({
        errorCode: 1,
        message: "companyId is required",
      });
    }

    const result = await Company.destroy({ where: { companyId } });
    
    res.status(200).json({
      errorCode: 0,
      message: "Data Deleted Successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in Data Deleting", error);
    return res.status(500).json({
      data: null,
      error: commonErrorCodes.somthingWentWrong.msg,
      status: commonErrorCodes.somthingWentWrong.code,
      message: null,
    });
  }
});


module.exports = router;
