const express = require("express");
const router = express.Router();
const CandidateRegistration = require("../../modals/ats");

router.post("/api/deleteBulkCandidate", async (req, res) => {
  const { candidates } = req.body;
  
  console.log("Received candidates:", candidates);
  console.log("Type of candidates:", typeof candidates);
  console.log("IsArray:", Array.isArray(candidates));

  // Validate that candidates is an array
  if (!Array.isArray(candidates)) {
    return res.status(400).send({ errorCode: 1, message: "Invalid input format" });
  }

  const candidateIds = candidates.map(c => c.candidateId);

  try {
    await CandidateRegistration.destroy({ where: { candidateId: candidateIds } });
    res.status(200).send({ errorCode: 0, message: "Candidates deleted successfully" });
  } catch (error) {
    console.error("Error deleting candidates:", error);
    res.status(500).send({ errorCode: 2, message: "Internal server error" });
  }
});

module.exports = router;
