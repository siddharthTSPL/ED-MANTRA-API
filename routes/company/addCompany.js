const express = require("express");
const router = express.Router();
const multer = require("multer");
const Company = require("../../modals/company");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "orguploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/api/addCompany", upload.fields([
  { name: "orgAgreeDoc", maxCount: 1 },
]), async (req, res) => {
  try {
    console.log("Files:", req.files);  // Debugging log
    console.log("Body:", req.body);    // Debugging log
    
    let orgAgree = null;

    // Check if the file is uploaded
    if (req.files && req.files["orgAgreeDoc"] && req.files["orgAgreeDoc"][0]) {
      const OrgAgree = req.files["orgAgreeDoc"][0];
      orgAgree = OrgAgree.filename; // Get the filename if provided
    }

    const {
      primaryPOCName,
      primaryPOCMobile,
      primaryPOCEmail,
      primaryPOCDesignation,
      secondaryPOCName,
      secondaryPOCMobile,
      secondaryPOCEmail,
      secondaryPOCDesignation,
      companyName,
      orgCategory,
      orgRate,
      createdBy,
    } = req.body;

    // Check for existing company with the same primaryPOCMobile
    const existingCompany = await Company.findOne({ where: { primaryPOCMobile } });

    if (existingCompany) {
      return res.status(400).json({
        errorCode: 1,
        message: "The primary mobile number you entered is already registered. Please use a different number.",
      });
    }

    // Create the company record
    const result = await Company.create({
      primaryPOCName,
      primaryPOCMobile,
      primaryPOCEmail,
      primaryPOCDesignation,
      secondaryPOCName,
      secondaryPOCMobile,
      secondaryPOCEmail,
      secondaryPOCDesignation,
      companyName,
      orgCategory,
      orgRate,
      orgAgree,  // This can be null if the file wasn't uploaded
      createdBy,
    });

    res.status(200).json({
      errorCode: 0,
      message: "Company added successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in Data Adding", error);
    return res.status(500).json({
      data: null,
      error: commonErrorCodes.somthingWentWrong.msg,
      status: commonErrorCodes.somthingWentWrong.code,
      message: null,
    });
  }
});

module.exports = router;
