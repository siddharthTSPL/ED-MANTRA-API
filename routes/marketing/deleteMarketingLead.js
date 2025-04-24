const express = require("express");
const router = express.Router();
const MarketingLeads = require("../../modals/marketingLeads");
const authenticate = require("../../Middleware/authenticate");
const accecableModules = [
  { permission: "USER_MANAGEMENT" },
  { permission: "LEAD_MANAGEMENT" },
];


router.delete("/api/deleteMarketingLead/:LeadId",authenticate(accecableModules), async (req, res) => {
    const { LeadId } = req.params;
    try {
      // find lead by LeadId
      const lead = await MarketingLeads.findOne({ where: { LeadId: LeadId } });
  
      // If lead doesn't exist, return 404 Not Found
      if (!lead) {
        return res.status(404).send({ error: "Lead not found" });
      }
  
      // Otherwise, delete the lead
      await lead.destroy();
  
      res.status(200).send({errorCode:0, message: "Lead deleted successfully" });
    } catch (error) {
      console.error("Error deleting lead:", error);
      res.status(500).send({ error: "Internal server error" });
    }
  });
    

module.exports = router;
