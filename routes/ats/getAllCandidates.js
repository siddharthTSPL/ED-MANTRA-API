

const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const CandidateRegistration = require("../../modals/ats");

router.get("/api/getAllCandidates", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const { count, rows } = await CandidateRegistration.findAndCountAll({
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