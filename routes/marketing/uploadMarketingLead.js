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
 const worksheet = workbook.worksheets[0];

  const headers = worksheet.getRow(1).values;
  const rows = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      const rowData = {};
      headers.forEach((header, columnIndex) => {
        rowData[header] = row.getCell(columnIndex).value;
      });

      // If "nextfollow" column is blank, populate it with the current date plus two days
     let nextFollowDate = rowData.nextfollow;

// If the cell is a string or invalid date, parse and validate
if (!nextFollowDate || isNaN(new Date(nextFollowDate).getTime())) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 2);
  currentDate.setHours(11, 0, 0, 0);
  nextFollowDate = currentDate;
} else {
  nextFollowDate = new Date(nextFollowDate); // ensure it's a real Date object
}

rowData.nextfollow = nextFollowDate;


      rows.push(rowData);
    }
  });
  return rows;
}



const bulkInsertData = async (dataArray) => {
  const BATCH_SIZE = 1000;
  try {
    for (let i = 0; i < dataArray.length; i += BATCH_SIZE) {
      const batch = dataArray.slice(i, i + BATCH_SIZE);
      await MarketingLeads.bulkCreate(batch, { ignoreDuplicates: true });
    }
    return true;
  } catch (error) {
    console.error("Error during batch insert:", error);
    return false;
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
