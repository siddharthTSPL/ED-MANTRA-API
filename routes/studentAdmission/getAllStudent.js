const express = require("express");
const router = express.Router();
const Student = require("../../modals/studentAdmission");

router.get("/api/getAllAdmitedStudent", async (req, res) => {
  try {
    const data = await Student.findAll();

    if (data && data.length > 0) {
      res
        .status(200)
        .send({ errorCode: 0, data, message: "Data fetched successfully" });
    } else {
      res
        .status(404)
        .send({ message: "No data found for the provided employee ID" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
