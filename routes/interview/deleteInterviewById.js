// deleteInterviewById
const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const multer = require("multer");
const path = require("path");
const Interview = require("../../modals/interviewSchedule");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.post("/api/deleteInterviewById", async (req, res) => {
  try {
    const { scheduleId } = req?.body;

    const result = await Interview.destroy({ where: { scheduleId } });
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
