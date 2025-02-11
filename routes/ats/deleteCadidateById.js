const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const multer = require("multer");
const path = require("path");
const CandidateRegistration = require("../../modals/ats");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.post("/api/deleteCandidateById", async (req, res) => {
  try {
    const { candidateId } = req?.body;

    const result = await CandidateRegistration.destroy({ where: { candidateId } });
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
