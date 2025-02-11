const express = require("express");
const router = express.Router();
const CandidateRegistration = require("../../modals/ats");
const multer = require("multer");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/api/updateCandidateById", upload.fields([
  { name: "aadhar", maxCount: 1 },
  { name: "resume", maxCount: 1 },
  { name: "agreement", maxCount: 1 },
  { name: "photo", maxCount: 1 },
]), async (req, res) => {
  try {
    const {
      candidateId,
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
      keySkills,
      language,
      employer,
      designation,
      yearsOfExperience,
      monthsOfExperience,
      currentCTC,
      expectedCTC,
      registeredDate,
      source,
      personName,
      personContact,
      residentialAddress,
      residentialCity,
      mailingAddress,
      mailingCity,
    } = req.body;

    // Create the updatedData object
    const updatedData = {
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
      keySkills,
      language,
      employer,
      designation,
      yearsOfExperience,
      monthsOfExperience,
      currentCTC,
      expectedCTC,
      registeredDate,
      source,
      personName,
      personContact,
      residentialAddress,
      residentialCity,
      mailingAddress,
      mailingCity,
    };

    // Check if req.files exists and if specific files were uploaded
    if (req.files && req.files["aadhar"]) {
      updatedData.aadharDocName = req.files["aadhar"][0].filename;
    }
    if (req.files && req.files["resume"]) {
      updatedData.resumeDocName = req.files["resume"][0].filename;
    }
    if (req.files && req.files["agreement"]) {
      updatedData.agreementDocName = req.files["agreement"][0].filename;
    }
    if (req.files && req.files["photo"]) {
      updatedData.latestPhoto = req.files["photo"][0].filename;
    }

    const result = await CandidateRegistration.update(updatedData, {
      where: { candidateId },
      returning: true,
    });

    res.status(200).json({
      errorCode: 0,
      message: "Candidate Updated Successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in Data Updating", error);
    return res.status(500).json({
      data: null,
      error: commonErrorCodes.somthingWentWrong.msg,
      status: commonErrorCodes.somthingWentWrong.code,
      message: null,
    });
  }
});

module.exports = router;
