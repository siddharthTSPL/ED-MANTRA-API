const express = require("express");
const router = express.Router();
const { Op, literal, where } = require("sequelize");
const CandidateRegistration = require("../../modals/ats");

router.get("/api/getAllCandidates", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const filterConditions = {};

    
    if (req.query.firstName) {
      filterConditions.firstName = {
        [Op.like]: `%${req.query.firstName}%`,
      };
    }
    if (req.query.lastName) {
      filterConditions.lastName = {
        [Op.like]: `%${req.query.lastName}%`,
      };
    }

    if (req.query.gender) {
      filterConditions.gender = { [Op.like]: `%${req.query.gender}%` };
    }
    if (req.query.maritalStatus) {
      filterConditions.maritalStatus = {
        [Op.like]: `%${req.query.maritalStatus}%`,
      };
    }
    if (req.query.email) {
      filterConditions.email = { [Op.like]: `%${req.query.email}%` };
    }
    if (req.query.phone) {
      filterConditions.phone = { [Op.like]: `%${req.query.phone}%` };
    }
    if (req.query.highestQualification) {
      filterConditions.highestQualification = {
        [Op.like]: `%${req.query.highestQualification}%`,
      };
    }
    if (req.query.sector) {
      const sectors = Array.isArray(req.query.sector)
        ? req.query.sector
        : [req.query.sector];
      filterConditions.sector = { [Op.in]: sectors };
    }
    if (req.query.role) {
      const roles = Array.isArray(req.query.role)
        ? req.query.role
        : [req.query.role];
      filterConditions.role = { [Op.in]: roles };
    }
    if (req.query.keySkills) {
      filterConditions.keySkills = { [Op.like]: `%${req.query.keySkills}%` };
    }
    if (req.query.mailingCity) {
      filterConditions.mailingCity = {
        [Op.like]: `%${req.query.mailingCity}%`,
      };
    }

    // Merge simple filters into final WHERE object
    const whereConditions = {
      ...filterConditions,
      [Op.and]: [],
    };

    // Operator map for advanced fields
    const opMap = {
      "=": Op.eq,
      "!=": Op.ne,
      ">": Op.gt,
      "<": Op.lt,
      ">=": Op.gte,
      "<=": Op.lte,
    };

    // DOB (Age filter)
    if (req.query.dob && req.query.dob.number) {
      const age = parseInt(req.query.dob.number, 10);
      const comparator = req.query.dob.comparator || "=";
      if (!isNaN(age)) {
        const today = new Date();
        const lowerBound = new Date(
          today.getFullYear() - age,
          today.getMonth(),
          today.getDate()
        );
        const upperBound = new Date(
          today.getFullYear() - age,
          today.getMonth(),
          today.getDate() + 1
        );

        switch (comparator) {
          case "=":
            whereConditions.dob = { [Op.gte]: lowerBound, [Op.lt]: upperBound };
            break;
          case "!=":
            whereConditions[Op.or] = [
              { dob: { [Op.lt]: lowerBound } },
              { dob: { [Op.gte]: upperBound } },
            ];
            break;
          case ">":
            whereConditions.dob = { [Op.lt]: lowerBound };
            break;
          case "<":
            whereConditions.dob = { [Op.gte]: upperBound };
            break;
          case ">=":
            whereConditions.dob = { [Op.lte]: lowerBound };
            break;
          case "<=":
            whereConditions.dob = { [Op.gte]: upperBound };
            break;
          default:
            whereConditions.dob = { [Op.gte]: lowerBound, [Op.lt]: upperBound };
        }
      }
    }

    // Numeric Filters with CAST — for yearsOfExperience, currentCTC, expectedCTC
    const numericFields = [
      { field: "yearsOfExperience", castType: "INTEGER", regex: "[^0-9]" },
      { field: "currentCTC", castType: "DECIMAL", regex: "[^0-9.]" },
      { field: "expectedCTC", castType: "DECIMAL", regex: "[^0-9.]" },
    ];

    for (const { field, castType, regex } of numericFields) {
      if (req.query[field] && req.query[field].number) {
        const value = Number(req.query[field].number);
        const comparator = req.query[field].comparator || "=";
        if (!isNaN(value)) {
          const op = opMap[comparator] || Op.eq;
          whereConditions[Op.and].push(
            where(
              literal(
                `CAST(regexp_replace("${field}", '${regex}', '', 'g') AS ${castType})`
              ),
              op,
              value
            )
          );
        }
      }
    }

    // createdAt filter (date range)
    if (req.query.createdAt && req.query.createdAt.date) {
      const dateVal = req.query.createdAt.date;
      const comparator = req.query.createdAt.comparator || "=";
      const parsedDate = new Date(dateVal);
      if (!isNaN(parsedDate)) {
        const start = new Date(parsedDate.setUTCHours(0, 0, 0, 0));
        const end = new Date(parsedDate.setUTCHours(23, 59, 59, 999));

        if (comparator === "=") {
          whereConditions.createdAt = { [Op.between]: [start, end] };
        } else if (comparator === "!=") {
          whereConditions.createdAt = { [Op.notBetween]: [start, end] };
        } else if (comparator === ">") {
          whereConditions.createdAt = { [Op.gt]: end };
        } else if (comparator === "<") {
          whereConditions.createdAt = { [Op.lt]: start };
        } else if (comparator === ">=") {
          whereConditions.createdAt = { [Op.gte]: start };
        } else if (comparator === "<=") {
          whereConditions.createdAt = { [Op.lte]: end };
        }
      }
    }

    // updatedAt filter (date range)
    if (req.query.updatedAt && req.query.updatedAt.date) {
      const dateVal = req.query.updatedAt.date;
      const comparator = req.query.updatedAt.comparator || "=";
      const parsedDate = new Date(dateVal);
      if (!isNaN(parsedDate)) {
        const start = new Date(parsedDate.setUTCHours(0, 0, 0, 0));
        const end = new Date(parsedDate.setUTCHours(23, 59, 59, 999));

        if (comparator === "=") {
          whereConditions.updatedAt = { [Op.between]: [start, end] };
        } else if (comparator === "!=") {
          whereConditions.updatedAt = { [Op.notBetween]: [start, end] };
        } else if (comparator === ">") {
          whereConditions.updatedAt = { [Op.gt]: end };
        } else if (comparator === "<") {
          whereConditions.updatedAt = { [Op.lt]: start };
        } else if (comparator === ">=") {
          whereConditions.updatedAt = { [Op.gte]: start };
        } else if (comparator === "<=") {
          whereConditions.updatedAt = { [Op.lte]: end };
        }
      }
    }

    // Clean empty Op.and
    if (whereConditions[Op.and].length === 0) {
      delete whereConditions[Op.and];
    }

    // Final DB call
    const { count, rows } = await CandidateRegistration.findAndCountAll({
      where: whereConditions,
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
    console.error("Error getting data:", error);
    res.status(500).json({
      errorCode: 1,
      message: "Internal server error",
      data: [],
    });
  }
});

module.exports = router;
