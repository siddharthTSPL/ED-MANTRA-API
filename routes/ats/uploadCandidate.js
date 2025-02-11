const express = require("express");
const router = express.Router();
const xlsx = require("xlsx");
const multer = require("multer");
const path = require("path");
const { Sequelize, Op } = require("sequelize");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");
const CandidateRegistration = require("../../modals/ats");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/api/uploadCandidate', upload.single('file'), async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../../uploads', req.file.filename);

    // Read the Excel file
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Skip headers
    const dataRows = rows.slice(1);

    const columnSequence = [
      'firstName', 'lastName', 'gender', 'maritalStatus', 'email', 'phone',
      'dob', 'highestQualification', 'otherQualification', 'experience',
      'sector', 'role', 'keySkills', 'language', 'aadharDocName',
      'agreementDocName', 'resumeDocName', 'latestPhoto', 'employer',
      'designation', 'yearsOfExperience', 'monthsOfExperience', 'currentCTC',
      'expectedCTC', 'registeredDate', 'source', 'personName', 'personContact',
      'residentialAddress', 'residentialCity', 'mailingAddress', 'mailingCity'
    ];

    const newCandidates = [];
    const phoneNumbers = new Set();

    // Extract candidate data and collect phone numbers
    for (const row of dataRows) {
      const candidateData = {};
      columnSequence.forEach((column, index) => {
        candidateData[column] = row[index];
      });

      if (candidateData.phone) {
        const phone = String(candidateData.phone).trim();
        phoneNumbers.add(phone);
        candidateData.phone = phone;
      }

      newCandidates.push(candidateData);
    }

    // Check for duplicate phone numbers in the database
    const existingCandidates = await CandidateRegistration.findAll({
      where: { phone: { [Op.in]: Array.from(phoneNumbers) } },
      attributes: ['phone']
    });

    const existingPhoneNumbers = existingCandidates.map(c => c.phone);

    if (existingPhoneNumbers.length > 0) {
      return res.status(400).json({
        errorCode: 1,
        message: `Duplicate phone numbers found: ${existingPhoneNumbers.join(", ")}. Please remove these numbers from the file and try again.`,
        data: { duplicateNumbers: existingPhoneNumbers }
      });
    }

    // Insert only unique candidates
    await CandidateRegistration.bulkCreate(newCandidates, { ignoreDuplicates: true });

    res.status(200).json({
      errorCode: 0,
      message: 'File uploaded and data inserted successfully!',
      data: {}
    });

  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({
      errorCode: commonErrorCodes.somthingWentWrong.code,
      message: `Error uploading file: ${error.message}`,
      data: null
    });
  }
});

module.exports = router;
