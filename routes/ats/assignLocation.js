/**const express = require("express");
const router = express.Router();
const Locations = require("../../modals/locations");

// POST /api/assignLocation
router.post("/api/assignLocation", async (req, res) => {
  try {
    const { empId, state, city } = req.body;

    if (!empId || !state || !city) {
      return res.status(400).json({
        errorCode: 1,
        errorMessage: "empId, state, and city are required.",
      });
    }

    // Check for existing location assignment
    const existingLocation = await Locations.findOne({
      where: {
        empId,
        state,
        city,
      },
    });

    if (existingLocation) {
      return res.status(409).json({
        errorCode: 2,
        errorMessage: "This location is already assigned to the employee.",
      });
    }

    // Create new location
    const newLocation = await Locations.create({
      empId,
      state,
      city,
    });

    return res.status(201).json({
      errorCode: 0,
      message: "Location assigned successfully",
      data: newLocation,
    });
  } catch (error) {
    console.error("assignLocation error:", error);
    return res.status(500).json({
      errorCode: 500,
      errorMessage: "Server error while assigning location",
    });
  }
});

module.exports = router;
*/