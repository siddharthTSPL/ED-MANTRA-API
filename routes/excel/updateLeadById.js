const express = require("express");
const router = express.Router();
const ExcelData = require("../../modals/excelData");
const authenticate = require("../../Middleware/authenticate");
const Remarks = require("../../modals/remarks");
const uuid = require("uuid");

const accecableModules = [{ permission: "LEAD_MANAGEMENT" }];

let currentDate = new Date();
let year = currentDate.getFullYear();
let month = currentDate.getMonth() + 1;
let day = currentDate.getDate();
let hours = currentDate.getHours();
let minutes = currentDate.getMinutes();
let seconds = currentDate.getSeconds();
// let dateTimeString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
let dateTimeString = `${day}/${month}/${year} | ${hours} ${minutes} ${seconds}`

function generateUniqueId() {
  const suffix = uuid.v4().split("-")[0].toUpperCase();
  const uniqueId = `DM-REMARK-${suffix}`;
  return uniqueId;
}

router.put(
  "/api/updateLead/:leadId",
  authenticate(accecableModules),
  async (req, res) => {
    try {
      const leadId = req.params.leadId;
      const updatedData = req.body;
      console.log(req.body)

      // Ensure required fields are present in the request body
      if (!updatedData.LeadId || !req.rootUser.data.empId) {
        return res.status(400).json({ error: "Missing required fields in request body" });
      }

      const remarkData = {
        LeadId: updatedData.LeadId,
        remarkId: generateUniqueId(),
        remark: updatedData.remark,
        remarkDateTime: dateTimeString,
        empId: req.rootUser.data.empId
      };
      // Check if remark is not empty or equal to 'Hello' before creating
      if (updatedData.remark && updatedData.remark !== '' && updatedData.remark !== 'Hello') {
        // Assuming remarkData is correctly populated with the necessary fields
        await Remarks.create(remarkData);
      } else {
        console.log('Remark is empty or equal to "Hello", skipping creation.');
      }

      // Find the lead to update
      const leadToUpdate = await ExcelData.findOne({ where: { LeadId: leadId } });

      if (!leadToUpdate) {
        return res.status(404).json({ message: "Lead not found" });
      }

      // Update the lead
      await leadToUpdate.update(updatedData);

      res.status(200).json({ message: "Lead updated successfully", updatedData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);


module.exports = router;
