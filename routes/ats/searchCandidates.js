const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const CandidateRegistration = require("../../modals/ats"); // Adjust path as needed

/**
 * @route   GET /api/searchCandidates
 * @desc    Search candidates by name, phone, or candidateId
 * @query   term=searchString
 * @access  Public (secure if needed)
 */
router.get("/api/searchCandidates", async (req, res) => {
  try {
    const term = req.query.term?.trim() || "";

    if (!term) {
      return res.status(400).json({
        errorCode: 1,
        message: "Search term is required",
        data: [],
      });
    }

    const results = await CandidateRegistration.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.like]: `%${term}%` } },
          { lastName: { [Op.like]: `%${term}%` } },
          { phone: { [Op.like]: `%${term}%` } },
        ],
      },
      limit: 20, // ✅ Protects from large payloads
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      errorCode: 0,
      message: "Candidates fetched successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error in searchCandidates API:", error);
    res.status(500).json({
      errorCode: 1,
      message: "Internal server error",
      data: [],
    });
  }
});

module.exports = router;
