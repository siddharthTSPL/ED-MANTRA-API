const express = require("express");
const router = express.Router();
const xlsx = require('xlsx');
const multer = require("multer");
const path = require("path");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");
const Company = require("../../modals/company");
const { Op, Sequelize } = require("sequelize");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "orguploads/");  // Ensure the folder 'orguploads/' exists
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/api/uploadCompany', upload.fields([
  { name: "companyfile", maxCount: 1 },
]), async (req, res) => {
  try {
    const empId = req.body.empId;
    
    // Ensure file exists and extract the first file in the array
    const file = req.files['companyfile'] && req.files['companyfile'][0];
    if (!file) {
      return res.status(400).json({ errorCode: 1, message: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, '../../orguploads', file.filename);

    // Read the Excel file
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];  // First sheet
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });  // Read as arrays
    
    // Skip the first row if it contains headers
    const dataRows = rows.slice(1);

    // Column sequence as per your DB table
    const columnSequence = [
      'primaryPOCName',
      'primaryPOCMobile',
      'primaryPOCEmail',
      'primaryPOCDesignation',
      'secondaryPOCName',
      'secondaryPOCMobile',
      'secondaryPOCEmail',
      'secondaryPOCDesignation',
      'companyName',
      'orgCategory',
      'orgRate',
    ];

    // Store errors for reporting
    const errors = [];

    // Loop through each row and map to the DB columns
    for (const row of dataRows) {
      const companyData = {};
      columnSequence.forEach((column, index) => {
        companyData[column] = row[index];
        companyData.createdBy = empId;  // Assign empId
      });
    
      // Normalize phone number to string
      companyData.primaryPOCMobile = String(companyData.primaryPOCMobile);
    
      // Check for duplicate primaryPOCMobile
      const existingCompany = await Company.findOne({ 
        where: { primaryPOCMobile: { [Op.eq]: companyData.primaryPOCMobile } } 
      });
    
      if (existingCompany) {
        errors.push(`Duplicate phone number found for ${companyData.primaryPOCName}: ${companyData.primaryPOCMobile}`);
        continue; // Skip to the next row
      }
    
      await Company.create(companyData);  // Insert into the DB
    }

    if (errors.length > 0) {
      return res.status(400).json({ errorCode: 1, message: 'Errors found during upload', errors });
    }

    res.status(200).json({ errorCode: 0, message: 'File uploaded and data inserted successfully!', data: {} });
  } catch (error) {
    console.error("Error in company upload:", error);
    res.status(500).send(`Error uploading file: ${error.message}`);
  }
});

module.exports = router;
