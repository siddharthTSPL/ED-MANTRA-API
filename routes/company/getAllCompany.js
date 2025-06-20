
const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const multer = require("multer");
const path = require("path");
const Company = require("../../modals/company");
const Employees = require("../../modals/employees");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.post("/api/getAllCompany", async (req, res) => {
  try {
    const empId = req.body.empId
    let result;
    const superAdmin = await Employees.findAll({ where: { empId } })
    if (superAdmin[0]?.role === "SuperAdmin" || superAdmin[0]?.role === "AdminEM"){
      result = await Company.findAll();

    }else{
      result = await Company.findAll({ where: { createdBy: empId },
      
      });
    }
    
    res.status(200).json({
      errorCode: 0,
      message: "Data Fetched Successfully",
      data: result,
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