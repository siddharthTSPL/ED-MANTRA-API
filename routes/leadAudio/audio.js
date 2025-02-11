const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Audio = require("../../modals/leadAudio");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});

const upload = multer({ storage: storage });


router.post("/api/uploadRecording", upload.single("audio"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Extract file information
    const { originalname } = req.file;

    // Create audio record in the database
    const audio = await Audio.create({
      filename: originalname,
      lead_id: req.body.lead_id,
      emp_id: req.body.emp_id,
    });

    res.status(201).json({ message: "Audio uploaded successfully", audio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
