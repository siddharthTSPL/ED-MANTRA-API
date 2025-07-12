const express = require("express");
const router = express.Router();
const { Op, literal, where } = require("sequelize");
const CandidateRegistration = require("../../modals/ats");

router.get("/api/getAllCandidates", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

   
    const whereConditions = {
      [Op.and]: [],
    };


    if (req.query.search) {
      const searchTerm = req.query.search.trim();

      whereConditions[Op.and].push({
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${searchTerm}%` } },
          { lastName: { [Op.iLike]: `%${searchTerm}%` } },
          { phone: { [Op.iLike]: `%${searchTerm}%` } },
          ...(searchTerm.includes(" ")
            ? searchTerm.split(" ").map((part) => ({
                [Op.or]: [
                  { firstName: { [Op.iLike]: `%${part}%` } },
                  { lastName: { [Op.iLike]: `%${part}%` } },
                ],
              }))
            : []),
        ],
      });
    }

    
    const textFilters = [
      "firstName",
      "lastName",
      "gender",
      "maritalStatus",
      "email",
      "phone",
      "highestQualification",
      "keySkills",
      "mailingCity",
    ];

    textFilters.forEach((field) => {
      if (req.query[field]) {
        whereConditions[Op.and].push({
          [field]: { [Op.like]: `%${req.query[field]}%` },
        });
      }
    });

    if (req.query.sector) {
      const sectors = Array.isArray(req.query.sector)
        ? req.query.sector
        : [req.query.sector];
      whereConditions[Op.and].push({
        sector: { [Op.in]: sectors },
      });
    }

    if (req.query.role) {
      const roles = Array.isArray(req.query.role)
        ? req.query.role
        : [req.query.role];
      whereConditions[Op.and].push({
        role: { [Op.in]: roles },
      });
    }

    // ✅ DOB (age logic)
    const opMap = {
      "=": Op.eq,
      "!=": Op.ne,
      ">": Op.gt,
      "<": Op.lt,
      ">=": Op.gte,
      "<=": Op.lte,
    };

    if (req.query.dob?.number) {
      const age = parseInt(req.query.dob.number);
      const comparator = req.query.dob.comparator || "=";

      if (!isNaN(age)) {
        const today = new Date();
        const lower = new Date(today.getFullYear() - age, today.getMonth(), today.getDate());
        const upper = new Date(today.getFullYear() - age, today.getMonth(), today.getDate() + 1);

        if (comparator === "=") {
          whereConditions[Op.and].push({
            dob: { [Op.gte]: lower, [Op.lt]: upper },
          });
        } else if (comparator === "!=") {
          whereConditions[Op.and].push({
            [Op.or]: [
              { dob: { [Op.lt]: lower } },
              { dob: { [Op.gte]: upper } },
            ],
          });
        } else {
          whereConditions[Op.and].push({
            dob: {
              [opMap[comparator]]: comparator.includes(">") ? lower : upper,
            },
          });
        }
      }
    }

    // ✅ Numeric filters
    const numericFields = [
      { field: "yearsOfExperience", cast: "INTEGER", regex: "[^0-9]" },
      { field: "currentCTC", cast: "DECIMAL", regex: "[^0-9.]" },
      { field: "expectedCTC", cast: "DECIMAL", regex: "[^0-9.]" },
    ];

    for (const { field, cast, regex } of numericFields) {
      if (req.query[field]?.number) {
        const value = Number(req.query[field].number);
        const comparator = req.query[field].comparator || "=";
        if (!isNaN(value)) {
          whereConditions[Op.and].push(
            where(
              literal(`CAST(regexp_replace("${field}", '${regex}', '', 'g') AS ${cast})`),
              opMap[comparator] || Op.eq,
              value
            )
          );
        }
      }
    }

    // ✅ createdAt / updatedAt filters
    const dateFields = ["createdAt", "updatedAt"];
    dateFields.forEach((field) => {
      if (req.query[field]?.date) {
        const comparator = req.query[field].comparator || "=";
        const parsedDate = new Date(req.query[field].date);
        if (!isNaN(parsedDate)) {
          const start = new Date(parsedDate.setUTCHours(0, 0, 0, 0));
          const end = new Date(parsedDate.setUTCHours(23, 59, 59, 999));

          let condition;
          switch (comparator) {
            case "=":
              condition = { [Op.between]: [start, end] };
              break;
            case "!=":
              condition = { [Op.notBetween]: [start, end] };
              break;
            case ">":
              condition = { [Op.gt]: end };
              break;
            case "<":
              condition = { [Op.lt]: start };
              break;
            case ">=":
              condition = { [Op.gte]: start };
              break;
            case "<=":
              condition = { [Op.lte]: end };
              break;
          }

          whereConditions[Op.and].push({
            [field]: condition,
          });
        }
      }
    });

    // ✅ Clean empty Op.and
    if (whereConditions[Op.and].length === 0) {
      delete whereConditions[Op.and];
    }

    const { count, rows } = await CandidateRegistration.findAndCountAll({
      where: whereConditions,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      errorCode: 0,
      message: "Data Fetched Successfully",
      data: rows,
      totalRecords: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error getting data:", error);
    return res.status(500).json({
      errorCode: 1,
      message: "Internal server error",
      data: [],
    });
  }
});

module.exports = router;
