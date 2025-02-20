const express = require("express");
const router = express.Router();
const empLoginValidation = require("../../validations/empLoginValidation");
const Employees = require("../../modals/employees");
const { commonSeccessCodes } = require("../../statusCodes/successCodes");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");
const jwt = require("jsonwebtoken");
const Roles = require("../../modals/roles");
const secretKey = process.env.KEY;
const bcrypt = require("bcrypt");
const decryptData = require("../../utils/decryptData");
const hash = require("../../utils/hashData");

router.post("/api/changePassword",  async (req,res)=>{
    try {
        const {empId, oldPassword, newPassword} = req.body;

        // Find employee by ID
        const employee = await Employees.findOne({ where: { empId: empId } });
        if (!employee) return res.status(404).json({ message: "User not found" });

        // Check old password

        const isMatch = oldPassword === decryptData(employee.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });
           
         // Hash new password
         const hashedPassword =hash(newPassword);
          // Update password in DB
        await Employees.update({ password: hashedPassword }, { where: { empId } });
        
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
})



module.exports = router;