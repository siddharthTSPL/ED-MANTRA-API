const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const Audio = require("../../modals/leadAudio");

// Define route for downloading audio recording by lead_id
router.get("/api/downloadRecording/:leadId", async (req, res) => {
  try {
    // Find the audio record in the database by lead_id
    const leadId = req.params.leadId;
    const audio = await Audio.findOne({ where: { lead_id: leadId } });

    if (!audio) {
      return res.status(404).json({ error: "Audio recording not found for this lead" });
    }

    // Construct the file path based on the filename stored in the database
    const filePath = path.join(__dirname, '../../uploads', audio.filename);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Stream the file to the client as a download
    res.download(filePath, audio.filename);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
