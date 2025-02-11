const express = require("express");
const router = express.Router();

const StudentRegistration = require("../../modals/studentRegistration");

router.post("/api/registerStudent", async (req, res) => {
  try {
    const {
      LeadId,
      registeredBy,
      fullName,
      mobile,
      altMobile,
      email,
      state,
      city,
      pincode,
      regFees,
      traineeId,
    } = req.body;
    const newStudent = await StudentRegistration.create({
      LeadId,
      registeredBy,
      fullName,
      mobile,
      altMobile,
      email,
      state,
      city,
      pincode,
      regFees,
      traineeId,
    });
    res
      .status(200)
      .json({
        errorCode: 0,
        message: "Student Registered successfully",
        data: newStudent,
      });
  } catch (error) {
    return res.json({
      message: error,
    });
  }
});

module.exports = router;
