const express = require("express");
const router = express.Router();
const ExcelData = require("../../modals/excelData");
const authenticate = require("../../Middleware/authenticate");
const accecableModules = [{ permission: "USER_MANAGEMENT" }, { permission: "LEAD_MANAGEMENT" }];


router.post('/api/addLead', authenticate(accecableModules), async (req, res) => {
    try {
        // Extract lead data from the request body
        const leadData = req.body;

        // Call singleInsertData function to insert the lead data
        const success = await ExcelData.create(leadData); // Pass leadData directly

        if (success) {
            // If insertion is successful, fetch and return sorted leads
            const sortedLeads = await ExcelData.findAll({ order: [['SrNo', 'ASC']] });
            res.status(201).json({ message: 'Lead added successfully', sortedLeads });
        } else {
            // If insertion fails, return error response
            res.status(500).json({ error: 'Failed to add lead' });
        }
    } catch (error) {
        // Check if the error is a unique constraint violation for "ExcelData_mobile_key"
        if (error.name === "SequelizeUniqueConstraintError" && error.fields && error.fields.mobile) {
            // Return a custom error response indicating duplicate mobile number
            res.status(400).json({ error: 'Mobile number already exist!' });
        } else {
            // For other errors, log and return a generic error response
            console.error("Error adding lead:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

module.exports = router;
