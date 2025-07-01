const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Employees = require("../../modals/employees");
const Interview = require("../../modals/interviewSchedule");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.post("/api/getAllScheduledInterview", async (req, res) => {
  try {
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
    } = req.body;

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

    // 🔎 Build filters
    const filterConditions = {
      candidateStatus: {
        [Op.notIn]: ["Joined", "Terminated", "Working", "Rejected"],
      },
    };

    // ✅ Only apply createdBy filter if user is NOT admin
    const isAdmin = user.role === "SuperAdmin" || user.role === "AdminEM";

    // ✅ Secure handling of createdBy filter
    if (isAdmin) {
      // Admin can see all and filter by any createdBy
      if (req.body.createdBy) {
        filterConditions.createdBy = req.body.createdBy;
      }
    } else {
      // Normal user can only see their own entries
      filterConditions.createdBy = empId;
    }

    // 🔎 Apply other filters
    if (candidateName) {
      filterConditions.candidateName = { [Op.like]: `%${candidateName}%` };
    }

    if (phone) {
      filterConditions.phone = { [Op.like]: `%${phone}%` };
    }

    if (email) {
      filterConditions.email = { [Op.like]: `%${email}%` };
    }

    if (companyName) {
      filterConditions.companyName = { [Op.like]: `%${companyName}%` };
    }

    if (jobProfile) {
      filterConditions.jobProfile = { [Op.like]: `%${jobProfile}%` };
    }

    if (candidateStatus) {
      filterConditions.candidateStatus = { [Op.like]: `%${candidateStatus}%` };
    }

     if (createdBy) {
          filterConditions.createdBy = { [Op.eq]: req.query.createdBy };
        }

    // 📅 Handle interviewDate
    if (interviewDate && interviewDate.date) {
      const dateVal = new Date(interviewDate.date);
      const comparator = interviewDate.comparator || "=";

      if (!isNaN(dateVal)) {
        const targetDate = dateVal.toISOString().split("T")[0]; // 'YYYY-MM-DD'

        switch (comparator) {
          case "=":
            filterConditions.interviewDate = targetDate;
            break;
          case "!=":
            filterConditions.interviewDate = { [Op.ne]: targetDate };
            break;
          case ">":
            filterConditions.interviewDate = { [Op.gt]: targetDate };
            break;
          case "<":
            filterConditions.interviewDate = { [Op.lt]: targetDate };
            break;
          case ">=":
            filterConditions.interviewDate = { [Op.gte]: targetDate };
            break;
          case "<=":
            filterConditions.interviewDate = { [Op.lte]: targetDate };
            break;
        }
      }
    }

    // ✅ Final DB call
    const result = await Interview.findAndCountAll({
      where: filterConditions,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      errorCode: 0,
      message: "Data fetched successfully",
      data: result.rows,
      totalRecords: result.count,
    });
  } catch (error) {
    console.error("Error in Data Fetching:", error.message, error.stack);
    return res.status(500).json({
      data: null,
      error: commonErrorCodes.somthingWentWrong.msg,
      status: commonErrorCodes.somthingWentWrong.code,
      message: error.message,
    });
  }
});

module.exports = router;
