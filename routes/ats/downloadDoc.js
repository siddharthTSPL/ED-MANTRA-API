const express = require('express');
const router = express.Router(); 
const path = require('path');
const fs = require('fs');

// Define a route to download files
router.post('/download', (req, res) => {
  const { filename } = req.body;
  const filePath = path.join(__dirname, '../../uploads', filename); // Adjust the path if necessary

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found');
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        res.status(500).send('Error downloading file');
      }
    });
  });
});

module.exports = router; // Ensure this line is present to export the router
