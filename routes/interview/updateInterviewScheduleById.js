const express = require("express");
const router = express.Router();
const Interview = require("../../modals/interviewSchedule");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.post("/api/updateInterviewScheduleById", async (req, res) => {
  try {
    const {

      scheduleId,
      interviewDate,
      candidateName,
      phone,
      companyName,
      jobProfile,
      candidateStatus } =
      req?.body;

    const updatedData = {
      interviewDate,
      candidateName,
      phone,
      companyName,
      jobProfile,
      candidateStatus,
    };

    const result = await Interview.update(updatedData, {
      where: { scheduleId },
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
