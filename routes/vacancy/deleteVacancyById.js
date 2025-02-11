const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const multer = require("multer");
const path = require("path");
const Vacancy = require("../../modals/vacancy");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.post("/api/deleteVacancyById", async (req, res) => {
  try {
    const { vacancyId } = req.body;  // Make sure req.body contains companyId
    if (!vacancyId) {
      return res.status(400).json({
        errorCode: 1,
        message: "companyId is required",
      });
    }

    const result = await Vacancy.destroy({ where: { vacancyId } });
    
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
