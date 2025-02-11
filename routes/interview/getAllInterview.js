const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Employees = require("../../modals/employees");
const Interview = require("../../modals/interviewSchedule");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.post("/api/getAllScheduledInterview", async (req, res) => {
  try {
    const empId = req.body.empId;

    // 🔍 Validate empId
    if (!empId) {
      return res.status(400).json({
        errorCode: 1,
        message: "Employee ID is required",
        data: null,
      });
    }

    const superAdmin = await Employees.findAll({ where: { empId } });

    // 🔍 Validate employee existence
    if (!superAdmin.length) {
      return res.status(404).json({
        errorCode: 1,
        message: "Employee not found",
        data: null,
      });
    }

    let result;
    if (superAdmin[0]?.role === "SuperAdmin" || superAdmin[0]?.role === "AdminEM") {
      result = await Interview.findAll({
        where: {
          candidateStatus: {
            [Op.notIn]: ["Joined", "Terminated", "Working", "Rejected"],
          },
        },
      });
    } else {
      result = await Interview.findAll({
        where: {
          candidateStatus: {
            [Op.notIn]: ["Joined", "Terminated", "Working", "Rejected"],
          },
          createdBy: empId,
        },
      });
    }

    res.status(200).json({
      errorCode: 0,
      message: "Data Fetched Successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in Data Fetching:", error.message, error.stack); // 🔍 Debugging info
    return res.status(500).json({
      data: null,
      error: commonErrorCodes.somthingWentWrong.msg,
      status: commonErrorCodes.somthingWentWrong.code,
      message: error.message, // Helps debugging
    });
  }
});

module.exports = router;
