const express = require("express");
const router = express.Router();
const Onboarding = require("../../modals/candidateOnboarding");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.post("/api/addOnboarding", async (req, res) => {
  try {
    const {
        scheduleId,
        joiningDate,
        consultAmount,
        recvAmount,
        balance

    } = req.body
        const result = await Onboarding.create({
        recordId: scheduleId,
        joiningDate,
        consultAmount,
        recvAmount,
        balance
    
    });

   
    res.status(200).json({
      errorCode: 0,
      message: "Data Created Successfully",
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
