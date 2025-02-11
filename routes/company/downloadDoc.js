const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Route to download files
router.post('/orgdownload', (req, res) => {
  let { filename } = req.body;

  // Decode URL-encoded characters in filename
  filename = decodeURIComponent(filename);

  // Log filename and path for debugging
  console.log("Decoded filename:", filename);
  const filePath = path.join(__dirname, '../../orguploads', filename); // Adjust the path if necessary
  console.log("Resolved file path:", filePath);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File access error:", err);
      return res.status(404).send('File not found');
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).send('Error downloading file');
      }
    });
  });
});

module.exports = router;
