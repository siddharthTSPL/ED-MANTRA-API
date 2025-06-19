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

    // ✅ Ensure all required fields are provided
    if (!companyId || !candidateName || !phone) {
      return res.status(400).json({
        errorCode: 2,
        message: "Required fields (companyId, candidateName, phone) are missing.",
        data: null,
      });
    }

    // ✅ Correctly structured Sequelize query
    const existingInterview = await Interview.findOne({
      where: {
        candidateName: candidateName.trim(),
        phone: phone.trim(),
        companyId: companyId
      }
    });

    if (existingInterview) {
      return res.status(400).json({
        errorCode: 1,
        message: "This candidate has already been scheduled for this company.",
        data: null,
      });
    }

    // ✅ Proceed to create new interview
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
      message: "Interview scheduled successfully.",
      data: result,
    });

  } catch (error) {
    console.error("Error scheduling interview:", error);
    return res.status(500).json({
      data: null,
      error: commonErrorCodes.somthingWentWrong.msg,
      status: commonErrorCodes.somthingWentWrong.code,
      message: null,
    });
  }
});

module.exports = router;
