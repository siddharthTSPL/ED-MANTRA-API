const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const multer = require("multer");
const path = require("path");
const Company = require("../../modals/company");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.delete("/api/deleteAllCompany", async (req, res) => {
  try {
    const result = await Company.destroy({ truncate: true, restartIdentity: true });
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
