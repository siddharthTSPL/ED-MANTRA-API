const express = require("express");
const router = express.Router();
const multer = require("multer");

const Company = require("../../modals/company");
const CompanyRemarks = require("../../modals/companyRemarks");

const { commonErrorCodes } = require("../../statusCodes/errorCodes");

// Define storage for orgAgreeDoc
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "orguploads/");
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Update Company
router.post(
  "/api/updateCompanyById",

  upload.fields([
    { name: "orgAgreeDoc", maxCount: 1 },
  ]),

  async (req, res) => {
    try {

      // ==========================================
      // 1. GET DATA FROM FRONTEND
      // ==========================================

      const {
        companyId,
        primaryPOCName,
        primaryPOCMobile,
        primaryPOCEmail,
        primaryPOCDesignation,
        secondaryPOCName,
        secondaryPOCMobile,
        companyStatus,
        followupDate,
        companyName,
        orgCategory,
        orgRate,
        createdBy,
        remarks,
      } = req.body;

      console.log("Updating Company:", companyId);
      console.log("New Remark:", remarks);


      // ==========================================
      // 2. PREPARE COMPANY DATA
      // ==========================================

      const updatedData = {
        primaryPOCName,
        primaryPOCMobile,
        primaryPOCEmail,
        primaryPOCDesignation,
        secondaryPOCName,
        secondaryPOCMobile,
        companyStatus,
        followupDate,
        companyName,
        orgCategory,
        orgRate,
        createdBy,
      };


      // ==========================================
      // 3. UPDATE AGREEMENT ONLY IF NEW FILE EXISTS
      // ==========================================

      if (
        req.files &&
        req.files["orgAgreeDoc"] &&
        req.files["orgAgreeDoc"][0]
      ) {
        updatedData.orgAgree =
          req.files["orgAgreeDoc"][0].filename;
      }


      // ==========================================
      // 4. UPDATE COMPANY TABLE
      // ==========================================

      const result = await Company.update(
        updatedData,
        {
          where: {
            companyId: companyId,
          },
          returning: true,
        }
      );


      // ==========================================
      // 5. ADD NEW REMARK TO CompanyRemarks TABLE
      // ==========================================

      if (remarks && remarks.trim() !== "") {

        await CompanyRemarks.create({
          companyId: companyId,
          remarks: remarks.trim(),
        });

        console.log("New company remark added");
      }


      // ==========================================
      // 6. SEND SUCCESS RESPONSE
      // ==========================================

      return res.status(200).json({
        errorCode: 0,
        message: "Company updated successfully",
        data: result,
      });

    } catch (error) {

      console.error("Error in Company Updating:", error);

      return res.status(500).json({
        data: null,
        error: commonErrorCodes.somthingWentWrong.msg,
        status: commonErrorCodes.somthingWentWrong.code,
        message: null,
      });
    }
  }
);

module.exports = router;