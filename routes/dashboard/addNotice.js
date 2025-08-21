// routes/dashboard/addNotice.js
const express = require("express");
const path = require("path");
const router = express.Router();
const NoticeBoard = require("../../modals/noticeBoard"); // adjust path if needed
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads")); // uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/api/addNotice", upload.single("attachment"), async (req, res) => {
  try {
    const { title, description, noticeDate, createdBy } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        errorCode: 1,
        message: "Title and description are required.",
      });
    }

    // ✅ Save only relative path (NOT full URL)
    const attachmentName = req.file ? `/uploads/${req.file.filename}` : null;

    const newNotice = await NoticeBoard.create({
      noticeId: uuidv4(),
      title,
      description,
      noticeDate,
      attachmentName,
      createdBy,
    });

    res.status(200).json({
      errorCode: 0,
      message: "Notice added successfully.",
      data: newNotice,
    });
  } catch (error) {
    console.error("Error while adding notice:", error);
    res.status(500).json({
      errorCode: 2,
      message: "Internal server error.",
    });
  }
});

module.exports = router;
