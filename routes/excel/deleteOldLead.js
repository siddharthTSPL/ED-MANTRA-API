const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const ExcelData = require("../../modals/excelData");

router.delete("/deleteOldLead", async (req, res) => {
    const thirtyDaysAgo = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);
    
    try {
        await ExcelData.destroy({
            where: {
                status: 'Dead Lead',
                updatedAt: {
                    [Op.lt]: thirtyDaysAgo
                }
            }
        });

        // Send success response
        res.status(200).send({ errorCode: 0, message: "Old dead leads deleted successfully" });
    } catch (error) {
        // Handle error
        console.error("Error deleting old dead leads:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

module.exports = router;
