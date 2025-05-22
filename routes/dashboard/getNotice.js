const express = require("express");
const router = express.Router();
const NoticeBoard = require("../../modals/noticeBoard"); // Adjust path if needed

// GET API to fetch all notices
router.get("/api/getNotices", async (req, res) => {
  try {
    const notices = await NoticeBoard.findAll({
      order: [["noticeDate", "DESC"]], // Optional: newest first
    });

    res.status(200).json({
      errorCode: 0,
      message: "Notices fetched successfully.",
      data: notices,
    });
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).json({
      errorCode: 1,
      message: "Internal server error.",
    });
  }
});

module.exports = router;
