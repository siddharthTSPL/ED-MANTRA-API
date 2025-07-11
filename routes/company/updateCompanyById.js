const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Company = require("../../modals/company");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

// Define storage for orgAgreeDoc
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "orguploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Or use unique name: Date.now() + "-" + file.originalname
  },
});

const upload = multer({ storage: storage });

// Apply multer to handle file upload
router.post("/api/updateCompanyById", upload.fields([
  { name: "orgAgreeDoc", maxCount: 1 },
]), async (req, res) => {
  try {
    const {
      companyId,
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

    let orgAgree = null;
    if (req.files && req.files["orgAgreeDoc"] && req.files["orgAgreeDoc"][0]) {
      orgAgree = req.files["orgAgreeDoc"][0].filename;
    }

    const updatedData = {
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
      orgAgree, // updated if file uploaded
    };

    const result = await Company.update(updatedData, {
      where: { companyId },
      returning: true,
    });

    res.status(200).json({
      errorCode: 0,
      message: "Company updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in Company Updating", error);
    return res.status(500).json({
      data: null,
      error: commonErrorCodes.somthingWentWrong.msg,
      status: commonErrorCodes.somthingWentWrong.code,
      message: null,
    });
  }
});

module.exports = router;
