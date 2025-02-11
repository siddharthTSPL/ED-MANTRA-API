const express = require("express");
const router = express.Router();
const Employees = require("../../modals/employees");
const Vacancy = require("../../modals/vacancy");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");
const { Op } = require("sequelize");  // Import Sequelize operators to compare dates

router.post("/api/getAllVacancy", async (req, res) => {
  try {
    const empId = req.body.empId;
    let result;
    
    // Get the current date
    const today = new Date();
    
    // Add 7 days to today's date
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    
    // Find employee details
    const superAdmin = await Employees.findAll({ where: { empId } });
    
    // Check if the user is SuperAdmin, and fetch based on role
    if (superAdmin[0]?.role === "SuperAdmin") {
      result = await Vacancy.findAll();  // Fetch all vacancies if user is SuperAdmin
    } else {
      result = await Vacancy.findAll({
        where: { createdBy: empId },  // Fetch vacancies created by the employee if not SuperAdmin
      });
    }
    
    // Highlight vacancies where pdcDate is within 7 days
    const highlightedResult = result.map((vacancy) => {
      const pdcDate = new Date(vacancy.pdcDate);
      
      // Check if the pdcDate is within 7 days from today
      const isPdcDateApproaching = pdcDate >= today && pdcDate <= sevenDaysFromNow;
      
      return {
        ...vacancy.dataValues,  // Spread the original vacancy data
        isPdcDateApproaching,   // Add a new field to flag if the pdcDate is approaching
      };
    });
    
    res.status(200).json({
      errorCode: 0,
      message: "Data Fetched Successfully",
      data: highlightedResult,  // Return the modified data
    });
  } catch (error) {
    console.error("Error in Data Fetching", error);
    return res.status(500).json({
      data: null,
      error: commonErrorCodes.somthingWentWrong.msg,
      status: commonErrorCodes.somthingWentWrong.code,
      message: null,
    });
  }
});

module.exports = router;
