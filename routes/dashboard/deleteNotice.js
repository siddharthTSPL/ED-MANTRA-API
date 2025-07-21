const express = require("express");
const router = express.Router();
const NoticeBoard = require("../../modals/noticeBoard"); // Sequelize model

// DELETE /api/deleteNotice/:id
router.delete("/api/deleteNotice/:id", async (req, res) => {
  try {
    const noticeId = req.params.id;

    const notice = await NoticeBoard.findOne({ where: { noticeId } });

    if (!notice) {
      return res.status(404).json({
        errorCode: 1,
        message: "Notice not found.",
      });
    }

    await notice.destroy(); // ✅ Sequelize delete

    return res.status(200).json({
      errorCode: 0,
      message: "Notice deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting notice:", error);
    return res.status(500).json({
      errorCode: 1,
      message: "Internal server error.",
    });
  }
});

module.exports = router;
