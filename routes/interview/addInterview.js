const express = require("express");
const router = express.Router();
const Interview = require("../../modals/interviewSchedule");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.post("/api/scheduleInterview", async (req, res) => {
  try {
    const {
      companyId,
      interviewDate,
      candidateName,
      phone,
      companyName,
      jobProfile,
      candidateStatus,
      createdBy
    } = req?.body;

    const result = await Interview.create({
      companyId,
      interviewDate,
      candidateName,
      phone,
      companyName,
      jobProfile,
      candidateStatus,
      createdBy,
    });
    res.status(200).json({
      errorCode: 0,
      message: "Data Added Successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in Data Adding", error);
    return res.status(500).json({
      data: null,
      error: commonErrorCodes.somthingWentWrong.msg,
      status: commonErrorCodes.somthingWentWrong.code,
      message: null,
    });
  }
});

module.exports = router;
