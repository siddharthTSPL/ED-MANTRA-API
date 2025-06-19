/**const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const CandidateRegistration = require("../../modals/candidateByEmpId");
const Locations = require("../../modals/locations");
const Sector = require("../../modals/sector");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.post("/api/getCandidateByEmpId", async (req, res) => {
  try {
    const empId = req.body.empId;

    if (!empId) {
      return res.status(400).json({
        errorCode: 1,
        message: "Employee ID is required.",
        data: null,
      });
    }

    // 1. Get all valid (state, city) combinations for empId
    const locations = await Locations.findAll({
      where: { empId },
      attributes: ['state', 'city'],
      raw: true,
    });

    // 2. Get all valid sectors for empId
    const sectors = await Sector.findAll({
      where: { empId },
      attributes: ['sector'],
      raw: true,
    });

    const validStates = locations.map(loc => loc.state);
    const validCities = locations.map(loc => loc.city);
    const validSectors = sectors.map(sec => sec.sector);

    // 3. Fetch only matching candidates
    const result = await CandidateRegistration.findAll({
      where: {
        createdBy: empId,
        state: { [Op.in]: validStates },
        city: { [Op.in]: validCities },
        sector: { [Op.in]: validSectors },
      },
    });

    if (!result || result.length === 0) {
      return res.status(404).json({
        errorCode: 1,
        message: "No matching candidates found.",
        data: [],
      });
    }

    res.status(200).json({
      errorCode: 0,
      message: "Data fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching candidate data:", error);
    return res.status(500).json({
      data: null,
      error: commonErrorCodes.somthingWentWrong?.msg || "Something went wrong",
      status: commonErrorCodes.somthingWentWrong?.code || 500,
      message: error.message,
    });
  }
});

module.exports = router;
 */
