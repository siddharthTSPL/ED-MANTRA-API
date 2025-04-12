const express = require("express");
const router = express.Router();
const ExcelData = require("../../modals/excelData");
const { Op } = require("sequelize");

router.put("/api/deadBulkLead", async (req, res) => {
    const { leads } = req.body;
    console.log('Received leads:', leads);

    if (!Array.isArray(leads)) {
        return res.status(400).send({ errorCode: 1, message: "Invalid input format" });
    }

    const leadIds = leads.map(lead => lead.LeadId);

    try {
        await ExcelData.update(
            { status: "Dead Lead" },
            { where: { LeadId: { [Op.in]: leadIds } } }
        );

        res.status(200).send({ errorCode: 0, message: "Leads status updated successfully" });
    } catch (error) {
        console.error("Error updating leads status:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

module.exports = router;
