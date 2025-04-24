const express = require("express");
const router = express.Router();
const MarketingLeads = require("../../modals/marketingLeads");
const Excel = require("exceljs");
const multer = require("multer");
const authenticate = require("../../Middleware/authenticate");
const accecableModules = [
  { permission: "USER_MANAGEMENT" },
  { permission: "LEAD_MANAGEMENT" },
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadsMarketing/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

async function readMarketingLeads(filePath) {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet();

  const headers = worksheet.getRow(1).values;
  const rows = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      const rowData = {};
      headers.forEach((header, columnIndex) => {
        rowData[header] = row.getCell(columnIndex).value;
      });

      // If "nextfollow" column is blank, populate it with the current date plus two days
      if (!rowData.nextfollow) {
        // Create a new date object for the current date
        const currentDate = new Date();
      
        // Add two days to the current date
        currentDate.setDate(currentDate.getDate() + 2);
      
        // Set the time part of the date to 11:00 AM IST
        currentDate.setHours(11);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);
      
        // Assign the calculated date to nextfollow property
        rowData.nextfollow = currentDate;
      }
      

      rows.push(rowData);
    }
  });
  return rows;
}



const bulkInsertData = async (dataArray) => {
  try {
    // Use bulkCreate with option { ignoreDuplicates: true }
    await MarketingLeads.bulkCreate(dataArray, { ignoreDuplicates: true });

    // If successful, return true
    return true;
  } catch (error) {
    // If there's an error, check if it's due to a unique constraint violation
    if (error.name === "SequelizeUniqueConstraintError") {
      // If the error is due to a duplicate entry, delete all the duplicates and try again
      const uniqueKeys = Object.keys(error.fields);
      const where = {};

      // Generate a where clause to delete the duplicates
      uniqueKeys.forEach((key) => {
        where[key] = error.fields[key];
      });

      // Delete the duplicates and retry
      await MarketingLeads.destroy({ where: where });
      return await bulkInsertData(dataArray);
    } else {
      // If the error is not due to a duplicate entry, return false
      console.error("Error during bulk insert:", error);
      return false;
    }
  }
};

router.post(
  "/api/marketingLead/upload",
  // authenticate(accecableModules),
  upload.single("file"),
  async (req, res) => {
    const filePath = req?.file?.path;
    try {
      const data = await readMarketingLeads(filePath);
      const isUplades = await bulkInsertData(data);
      if (isUplades) {
        return res.status(200).json({ message: "Data uploaded successfully" });
      } else {
        return res.status(200).json({ message: "Data uploaded failed" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
