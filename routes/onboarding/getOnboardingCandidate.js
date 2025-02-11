const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Interview = require("../../modals/interviewSchedule");
const Employees = require("../../modals/employees");
const Onboarding = require("../../modals/candidateOnboarding");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.post("/api/getCandidatebyStatus", async (req, res) => {
  try {
    const empId=req.body.empId
    let result;
    const superAdmin = await Employees.findAll({ where: { empId } })
    if (superAdmin[0]?.role === "SuperAdmin" || superAdmin[0]?.role === "AdminEM") {
      result = await Interview.findAll({
        where: {
          candidateStatus: {
            [Op.in]: ["Joined", "Terminated", "Working", "Rejected"],
          },
  
          
        },
        include: [
          {
            model: Onboarding,
            required: false, // Ensure even if there's no matching onboarding record, the interview record will still be included
          },
        ],
      });

    }else{
      result = await Interview.findAll({
        where: {
          candidateStatus: {
            [Op.in]: ["Joined", "Terminated", "Working", "Rejected"],
          },
  
          createdBy:empId
        },
        include: [
          {
            model: Onboarding,
            required: false, // Ensure even if there's no matching onboarding record, the interview record will still be included
          },
        ],
      });

    }
  

    // Flattening the result to include onboarding data directly
    const flattenedData = result.map((item) => {
      return {
        candidateName: item.candidateName,
        phone:item.phone,
        candidateStatus: item.candidateStatus,
        companyName: item.companyName,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        interviewDate: item.interviewDate,
        jobProfile: item.jobProfile,
        scheduleId: item.scheduleId,
        // Flattening onboarding data into the same object
        joiningDate: item.Onboarding ? item.Onboarding.joiningDate : null,
        consultAmount: item.Onboarding ? item.Onboarding.consultAmount : null,
        recvAmount: item.Onboarding ? item.Onboarding.recvAmount : null,
        balance: item.Onboarding ? item.Onboarding.balance : null,
        onboardingCreatedAt: item.Onboarding ? item.Onboarding.createdAt : null,
        onboardingUpdatedAt: item.Onboarding ? item.Onboarding.updatedAt : null,
      };
    });

    res.status(200).json({
      errorCode: 0,
      message: "Data Fetched Successfully",
      data: flattenedData,
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
