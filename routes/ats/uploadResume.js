const express = require("express");
const router = express.Router();
const multer = require("multer");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");
const CandidateRegistration = require("../../modals/ats");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uplaod = multer({ storage });
router.post(
  "/api/uplaodResume",
  uplaod.fields([
    { name: "resume", maxCount: 1 },
    { name: "kyc", maxCount: 1 },
    { name: "agreement", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { files } = req;
      const { 
        firstName,
        lastName,
        gender,
        maritalStatus,
        email,
        phone,
        dob,
        highestQualification,
        otherQualification,
        experience,
        sector,
        role,
        employer,
        designation,
        yearsOfExperience,
        monthsOfExperience,
        currentCTC,
        expectedCTC,
        registeredDate,
        source,
        residentialAddress,
        mailingAddress,
        interviewDate,
        company,
        candidateSelected,
        joiningDate,
        offeredPkg,
        emAmount,
        receivedAmount, } = req?.body;

      const result = await CandidateRegistration.create({
        firstName,
        lastName,
        gender,
        maritalStatus,
        email,
        phone,
        dob,
        highestQualification,
        otherQualification,
        experience,
        sector,
        role,
        kycDocName: files?.kyc[0].filename,
        agreementDocName: files?.agreement[0].filename,
        resumeDocName: files.resume[0].filename,
        employer,
        designation,
        yearsOfExperience,
        monthsOfExperience,
        currentCTC,
        expectedCTC,
        registeredDate,
        source,
        residentialAddress,
        mailingAddress,
        interviewDate,
        company,
        candidateSelected,
        joiningDate,
        offeredPkg,
        emAmount,
        receivedAmount,
      });
      res.status(200).json({
        errorCode: 0,
        message: "Resume Uploaded Successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in Resume Uploading:", error);
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
