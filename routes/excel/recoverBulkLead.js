const express = require("express");
const router = express.Router();
const ExcelData = require("../../modals/excelData");
const authenticate = require("../../Middleware/authenticate");
const accecableModules = [
    { permission: "USER_MANAGEMENT" },
    { permission: "LEAD_MANAGEMENT" },
];

router.put("/api/recoverBulkLead", async (req, res) => {  // Changed from delete to put
    const { leads } = req.body; // Retrieve the array of lead objects from request body
    console.log('Received leads:', leads);
    // Check if leads is an array
    if (!Array.isArray(leads)) {
        return res.status(400).send({ errorCode: 1, message: "Invalid input format" });
    }

    // Extract LeadId from each lead object
    const leadIds = leads.map(lead => lead.LeadId);

    try {
        // Perform bulk update based on the leadIds array
        await ExcelData.update(
            { status: "New Lead" }, // Update the status field to "Dead Lead"
            { where: { LeadId: leadIds } }
        );

        // Send success response
        res.status(200).send({ errorCode: 0, message: "Leads Recoverd Successfully" });
    } catch (error) {
        // Handle error
        console.error("Error updating leads status:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

module.exports = router;
