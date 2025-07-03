const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Employees = require("../../modals/employees");
const Interview = require("../../modals/interviewSchedule");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.get("/api/getAllScheduledInterview", async (req, res) => {
  try {
    console.log("🔍 FULL req.query:", req.query);

    const {
      empId,
      page = 1,
      limit = 50,
      candidateName,
      phone,
      email,
      companyName,
      jobProfile,
      interviewDate,
      candidateStatus,
      createdBy,
    } = req.query;

    if (!empId) {
      return res.status(400).json({
        errorCode: 1,
        message: "Employee ID is required",
        data: null,
      });
    }

    const user = await Employees.findOne({ where: { empId } });
    if (!user) {
      return res.status(404).json({
        errorCode: 1,
        message: "Employee not found",
        data: null,
      });
    }

    const offset = (page - 1) * limit;

    const filterConditions = {
      candidateStatus: {
        [Op.notIn]: ["Joined", "Terminated", "Working", "Rejected"],
      },
    };

    const isAdmin = ["SuperAdmin", "AdminEM"].includes(user.role);

    if (isAdmin) {
      if (createdBy) {
        filterConditions.createdBy = createdBy;
      }
    } else {
      filterConditions.createdBy = empId;
    }

    if (candidateName) {
      filterConditions.candidateName = { [Op.iLike]: `%${candidateName}%` };
    }
    if (phone) {
      filterConditions.phone = { [Op.iLike]: `%${phone}%` };
    }
    if (email) {
      filterConditions.email = { [Op.iLike]: `%${email}%` };
    }
    if (companyName) {
      filterConditions.companyName = { [Op.iLike]: `%${companyName}%` };
    }
    if (jobProfile) {
      filterConditions.jobProfile = { [Op.iLike]: `%${jobProfile}%` };
    }
    if (candidateStatus) {
      filterConditions.candidateStatus = { [Op.iLike]: `%${candidateStatus}%` };
    }

 if (interviewDate?.date) {
  const parsedDate = new Date(interviewDate.date);
  if (!isNaN(parsedDate)) {
    const start = new Date(parsedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(parsedDate);
    end.setHours(23, 59, 59, 999);

    const comparator = interviewDate.comparator || "=";

    switch (comparator) {
      case "=":
        filterConditions.interviewDate = { [Op.between]: [start, end] };
        break;
      case "!=":
        filterConditions.interviewDate = { [Op.notBetween]: [start, end] };
        break;
      case ">":
        filterConditions.interviewDate = { [Op.gt]: end };
        break;
      case "<":
        filterConditions.interviewDate = { [Op.lt]: start };
        break;
      case ">=":
        filterConditions.interviewDate = { [Op.gte]: start };
        break;
      case "<=":
        filterConditions.interviewDate = { [Op.lte]: end };
        break;
    }
  }
}

    const result = await Interview.findAndCountAll({
      where: filterConditions,
      offset,
      limit: parseInt(limit),
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      errorCode: 0,
      message: "Data fetched successfully",
      data: result.rows,
      totalRecords: result.count,
    });
  } catch (error) {
    console.error("Error in GET /getAllScheduledInterview:", error);
    return res.status(500).json({
      data: null,
      errorCode: 1,
      message: "Something went wrong",
    });
  }
});

module.exports = router;
