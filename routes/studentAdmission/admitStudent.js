const express = require("express");
const router = express.Router();

const StudentAdmission = require("../../modals/studentAdmission");

router.post("/api/admitStudent", async (req, res) => {
  try {
    const { traineeId, course, course_fees, admission_fees } = req.body;
    const newStudent = await StudentAdmission.create({
      traineeId,
      course,
      course_fees,
      admission_fees,
    });
    res.status(200).json({
      errorCode: 0,
      message: "Student Admission Successful",
      data: newStudent,
    });
  } catch (error) {
    return res.json({
      message: error,
    });
  }
});

module.exports = router;
