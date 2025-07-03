const express = require("express");
const router = express.Router();
const { Op, fn, col, where } = require("sequelize");
const Employees = require("../../modals/employees");
const Vacancy = require("../../modals/vacancy");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");



router.get("/api/getAllVacancy", async (req, res) => {
  try {
     console.log("🧪 FULL req.query:", req.query); // ✅ MOVE HERE
    const empId = req.query.empId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    const empRecord = await Employees.findOne({ where: { empId } });
    if (!empRecord) {
      return res.status(401).json({
        errorCode: 1,
        message: "Unauthorized: Employee not found",
        data: [],
      });
    }

    const filterConditions = {};

    // ✅ Handle comma-separated multi-select
    if (req.query.sector) {
      const sectors = Array.isArray(req.query.sector)
        ? req.query.sector
        : req.query.sector.split(",").map((s) => s.trim());

      filterConditions.sector = { [Op.in]: sectors };
    }

    if (req.query.jobProfile) {
      const profiles = Array.isArray(req.query.jobProfile)
        ? req.query.jobProfile
        : req.query.jobProfile.split(",").map((p) => p.trim());

      filterConditions.jobProfile = { [Op.in]: profiles };
    }

    // Exact match filters
    if (req.query.vacancyStatus) {
      filterConditions.vacancyStatus = {
        [Op.eq]: req.query.vacancyStatus.trim(),
      };
    }
    if (req.query.noOfVacancy) {
      filterConditions.noOfVacancy = { [Op.eq]: req.query.noOfVacancy };
    }
    if (req.query.salaryRangeMin) {
      filterConditions.salaryRangeMin = { [Op.eq]: req.query.salaryRangeMin };
    }
    if (req.query.salaryRangeMax) {
      filterConditions.salaryRangeMax = { [Op.eq]: req.query.salaryRangeMax };
    }
    if (req.query.experience) {
      filterConditions.experience = { [Op.eq]: req.query.experience };
    }
    if (req.query.pdcDate) {
      filterConditions.pdcDate = { [Op.eq]: req.query.pdcDate };
    }
    if (req.query.genderpref) {
      filterConditions.genderpref = { [Op.eq]: req.query.genderpref.trim() };
    }
    if (req.query.createdBy) {
      filterConditions.createdBy = { [Op.eq]: req.query.createdBy };
    }

    // Case-insensitive text filters
    if (req.query.companyName) {
      filterConditions.companyName = {
        [Op.iLike]: req.query.companyName.trim(),
      };
    }

    if (req.query.primaryPOCMobile) {
      filterConditions.primaryPOCMobile = {
        [Op.iLike]: req.query.primaryPOCMobile.trim(),
      };
    }

    if (req.query.jobDiscription) {
      filterConditions.jobDiscription = {
        [Op.iLike]: req.query.jobDiscription.trim(),
      };
    }

    if (req.query.location) {
      filterConditions.location = {
        [Op.iLike]: req.query.location.trim(),
      };
    }

    if (req.query.tANDc) {
      filterConditions.tANDc = {
        [Op.iLike]: `%${req.query.tANDc.trim()}%`,
      };
    }

    // Date filters: createdAt
 
    if (req.query.createdAt?.date) {
  const dateVal = req.query.createdAt.date;
  const comparator = req.query.createdAt.comparator || "=";
  const parsedDate = new Date(dateVal);

  if (!isNaN(parsedDate)) {
    if (comparator === "=" || comparator === "!=") {
      const start = new Date(parsedDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(parsedDate);
      end.setHours(23, 59, 59, 999);

      filterConditions.createdAt = {
        [comparator === "=" ? Op.between : Op.notBetween]: [start, end],
      };
    } else if (["<", ">", "<=", ">="].includes(comparator)) {
      filterConditions.createdAt = {
        [Op[comparator]]: parsedDate,
      };
    }
  }
}


    // Date filters: updatedAt
  if (req.query.updatedAt?.date) {
  const dateVal = req.query.updatedAt.date;
  const comparator = req.query.updatedAt.comparator || "=";
  const parsedDate = new Date(dateVal);

  if (!isNaN(parsedDate)) {
    if (comparator === "=" || comparator === "!=") {
      const start = new Date(parsedDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(parsedDate);
      end.setHours(23, 59, 59, 999);

      filterConditions.updatedAt = {
        [comparator === "=" ? Op.between : Op.notBetween]: [start, end],
      };
    } else if (["<", ">", "<=", ">="].includes(comparator)) {
      filterConditions.updatedAt = {
        [Op[comparator]]: parsedDate,
      };
    }
  }
}

    // Role-based access
    if (!["SuperAdmin", "AdminEM"].includes(empRecord.role)) {
      filterConditions.createdBy = empId;
    }

    // Query the DB
    console.log("🔍 FilterConditions.createdAt:", filterConditions.createdAt);

    const { count, rows } = await Vacancy.findAndCountAll({
      where: filterConditions,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    console.log("✅ Returned rows:", rows.length);
    if (rows.length > 0) {
      console.log("🟢 First record createdAt:", rows[0].createdAt);
    }

    const enhancedRows = rows.map((vacancy) => {
      const pdcDate = new Date(vacancy.pdcDate);
      const isPdcDateApproaching =
        pdcDate >= today && pdcDate <= sevenDaysFromNow;
      return {
        ...vacancy.dataValues,
        isPdcDateApproaching,
      };
    });

    res.status(200).json({
      errorCode: 0,
      message: "Vacancies fetched successfully",
      data: enhancedRows,
      totalRecords: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("❌ Error in /api/getAllVacancy:", error);
    return res.status(500).json({
      data: [],
      error: commonErrorCodes.somthingWentWrong.msg,
      status: commonErrorCodes.somthingWentWrong.code,
      message: error.message,
    });
  }
});

module.exports = router;
