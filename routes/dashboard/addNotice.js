const express = require("express");
const router = express.Router();
const NoticeBoard = require("../../modals/noticeBoard"); // adjust path if needed
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // configure as needed

router.post("/api/addNotice", upload.single("attachment"), async (req, res) => {
  const { title, description, noticeDate, createdBy } = req.body;
  const attachmentName = req.file ? req.file.filename : null;

  if (!title || !description) {
    return res.status(400).json({
      errorCode: 1,
      message: "Title and description are required.",
    });
  }

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
});

module.exports = router;
