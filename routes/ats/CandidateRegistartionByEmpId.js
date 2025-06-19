const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Sequelize } = require("sequelize");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");
const CandidateRegistration = require("../../modals/candidateByEmpId");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/api/registerCandidateByEmpId",
  upload.fields([
    { name: "aadhar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "agreement", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("Files:", req.files); // Debugging
      console.log("Body:", req.body);   // Debugging

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
        state,
        city,
        createdBy // ⬅️ from req.body like addCompany
      } = req.body;

      const aadharDocName = req.files?.["aadhar"] ? req.files["aadhar"][0].filename : null;
      const resumeDocName = req.files?.["resume"] ? req.files["resume"][0].filename : null;
      const agreementDocName = req.files?.["agreement"] ? req.files["agreement"][0].filename : null;
      const latestPhoto = req.files?.["photo"] ? req.files["photo"][0].filename : null;

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
        state,
        city,
        aadharDocName,
        agreementDocName,
        resumeDocName,
        latestPhoto,
        createdBy, // ✔️ Taken from frontend
      });

      res.status(200).json({
        errorCode: 0,
        message: "Candidate Registered Successfully",
        data: result,
      });
    } catch (error) {
      if (error instanceof Sequelize.UniqueConstraintError) {
        const duplicateField = error.errors[0].path;
        return res.status(409).json({
          data: null,
          error: `The ${duplicateField} already exists.`,
          status: 409,
          message: `The provided ${duplicateField} is already registered. Please use a different one.`,
        });
      }

      console.error("Error registering candidate:", error);
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
