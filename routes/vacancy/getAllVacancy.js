const express = require("express");
const router = express.Router();
const { Op, fn, col, where } = require("sequelize");
const Employees = require("../../modals/employees");
const Vacancy = require("../../modals/vacancy");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.get("/api/getAllVacancy", async (req, res) => {
  try {
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

    let filterConditions = {};
    const andConditions = [];

    if (req.query.companyName) {
      andConditions.push(
        where(fn("LOWER", col("companyName")), {
          [Op.eq]: req.query.companyName.toLowerCase().trim(),
        })
      );
    }

    if (req.query.primaryPOCMobile) {
      andConditions.push(
        where(fn("LOWER", col("primaryPOCMobile")), {
          [Op.eq]: req.query.primaryPOCMobile.toLowerCase().trim(),
        })
      );
    }

    if (req.query.jobDiscription) {
      andConditions.push(
        where(fn("LOWER", col("jobDiscription")), {
          [Op.eq]: req.query.jobDiscription.toLowerCase().trim(),
        })
      );
    }

    if (req.query.jobProfile) {
      filterConditions.jobProfile = { [Op.eq]: req.query.jobProfile.trim() };
    }

    if (req.query.sector) {
      filterConditions.sector = { [Op.eq]: req.query.sector.trim() };
    }

    if (req.query.vacancyStatus) {
      filterConditions.vacancyStatus = {
        [Op.eq]: req.query.vacancyStatus.trim(),
      };
    }

    if (req.query.location) {
      andConditions.push(
        where(fn("LOWER", col("location")), {
          [Op.eq]: req.query.location.toLowerCase().trim(),
        })
      );
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

    if (req.query.tANDc) {
      filterConditions.tANDc = {
        [Op.iLike]: `%${req.query.tANDc.trim()}%`,
      };
    }

    if (req.query.genderpref) {
      filterConditions.genderpref = { [Op.eq]: req.query.genderpref.trim() };
    }

    if (req.query.createdBy) {
      filterConditions.createdBy = { [Op.eq]: req.query.createdBy };
    }

    if (req.query.createdAt && req.query.createdAt.date) {
      const dateVal = req.query.createdAt.date;
      const comparator = req.query.createdAt.comparator || "=";
      const parsedDate = new Date(dateVal);

      if (!isNaN(parsedDate)) {
        const start = new Date(parsedDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(parsedDate);
        end.setHours(23, 59, 59, 999);

        switch (comparator) {
          case "=":
            filterConditions.createdAt = { [Op.between]: [start, end] };
            break;
          case "!=":
            filterConditions.createdAt = { [Op.notBetween]: [start, end] };
            break;
          case ">":
            filterConditions.createdAt = { [Op.gt]: end };
            break;
          case "<":
            filterConditions.createdAt = { [Op.lt]: start };
            break;
          case ">=":
            filterConditions.createdAt = { [Op.gte]: start };
            break;
          case "<=":
            filterConditions.createdAt = { [Op.lte]: end };
            break;
        }
      }
    }

    if (req.query.updatedAt && req.query.updatedAt.date) {
      const dateVal = req.query.updatedAt.date;
      const comparator = req.query.updatedAt.comparator || "=";
      const parsedDate = new Date(dateVal);

      if (!isNaN(parsedDate)) {
        const start = new Date(parsedDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(parsedDate);
        end.setHours(23, 59, 59, 999);

        switch (comparator) {
          case "=":
            filterConditions.updatedAt = { [Op.between]: [start, end] };
            break;
          case "!=":
            filterConditions.updatedAt = { [Op.notBetween]: [start, end] };
            break;
          case ">":
            filterConditions.updatedAt = { [Op.gt]: end };
            break;
          case "<":
            filterConditions.updatedAt = { [Op.lt]: start };
            break;
          case ">=":
            filterConditions.updatedAt = { [Op.gte]: start };
            break;
          case "<=":
            filterConditions.updatedAt = { [Op.lte]: end };
            break;
        }
      }
    }

    if (!['SuperAdmin', 'AdminEM'].includes(empRecord.role)) {
      filterConditions.createdBy = empId;
    }

    const finalWhere = {
      ...filterConditions,
    };
    if (andConditions.length > 0) {
      finalWhere[Op.and] = andConditions;
    }

    const { count, rows } = await Vacancy.findAndCountAll({
      where: finalWhere,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

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
    console.error("Error in /api/getAllVacancy:", error);
    return res.status(500).json({
      data: [],
      error: commonErrorCodes.somthingWentWrong.msg,
      status: commonErrorCodes.somthingWentWrong.code,
      message: null,
    });
  }
});

module.exports = router;
