const express = require("express");
const router = express.Router();
const db = require("../../connections/db");
const CandidateRegistration = require("../../modals/ats");

router.get("/api/getAllCandidates", async (req, res) => {
  try {
    const result = await CandidateRegistration.findAll();
    res
      .status(200)
      .send({errorCode:0, data: result, message: "Data Fetched Successfully" });
  } catch (error) {
    console.error("Error getting data:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

module.exports = router;
