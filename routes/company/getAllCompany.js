const express = require("express");
const router = express.Router();
const { Op, where, literal } = require("sequelize");
const Company = require("../../modals/company");
const Employees = require("../../modals/employees");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.get("/api/getAllCompany", async (req, res) => {
  try {
    const empId = req.query.empId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const filterConditions = {};

    // Text filters
    if (req.query.companyName) {
      filterConditions.companyName = {
        [Op.like]: `%${req.query.companyName}%`,
      };
    }
    if (req.query.primaryPOCMobile) {
      filterConditions.primaryPOCMobile = {
        [Op.like]: `%${req.query.primaryPOCMobile}%`,
      };
    }
    if (req.query.primaryPOCEmail) {
      filterConditions.primaryPOCEmail = {
        [Op.like]: `%${req.query.primaryPOCEmail}%`,
      };
    }
    if (req.query.orgCategory) {
      filterConditions.orgCategory = {
        [Op.like]: `%${req.query.orgCategory}%`,
      };
    }
    if (req.query.orgRate) {
      filterConditions.orgRate = {
        [Op.like]: `%${req.query.orgRate}%`,
      };
    }
    if (req.query.createdBy) {
      filterConditions.createdBy = {
        [Op.eq]: req.query.createdBy,
      };
    }

    // Build base access condition
    const empRecord = await Employees.findOne({ where: { empId } });

    if (!empRecord) {
      return res.status(401).json({
        errorCode: 1,
        message: "Unauthorized: Employee not found",
        data: [],
      });
    }

    const isSuperOrAdmin =
      empRecord.role === "SuperAdmin" || empRecord.role === "AdminEM";

    if (!isSuperOrAdmin) {
      filterConditions.createdBy = empId;
    }

    const { count, rows } = await Company.findAndCountAll({
      where: filterConditions,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      errorCode: 0,
      message: "Data Fetched Successfully",
      data: rows,
      totalRecords: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error in Data Fetching", error);
    return res.status(500).json({
      data: [],
      error: commonErrorCodes.somthingWentWrong.msg,
      status: commonErrorCodes.somthingWentWrong.code,
      message: null,
    });
  }
});

module.exports = router;
