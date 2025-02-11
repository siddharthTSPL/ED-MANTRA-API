const express = require("express");
const router = express.Router();
const db = require("../../connections/db");
const uuid = require("uuid");
const multer = require("multer");
const path = require("path");
const Company = require("../../modals/company");
const Employees = require("../../modals/employees");
const Vacancy = require("../../modals/vacancy");
const Interview = require("../../modals/interviewSchedule");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");
const { Op, Sequelize } = require("sequelize"); // Import Sequelize operators to compare dates



router.get("/api/getATSReports", async (req, res) => {
    try {
      const reports = await Vacancy.findAll({
        include: [
          {
            model: Employees,
            attributes: ["empId", "fname", "lname"],
          },
          {
            model: Company,
            attributes: ["companyId", "name"],
          },
          {
            model: Interview,
            attributes: ["interviewId", "date", "status"],
          },
        ],
      });
  
      res.status(200).json({
        errorCode: 0,
        message: "Data retrieved successfully",
        data: reports,
      });
    } catch (error) {
      console.error("Error fetching ATS reports", error);
      res.status(500).json({
        errorCode: 1,
        message: "Error fetching data",
      });
    }
  });
  
  module.exports = router;