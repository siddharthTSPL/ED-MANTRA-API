const express = require("express");
const router = express.Router();
const { Op, Sequelize } = require("sequelize");
const Company = require("../../modals/company");
const Vacancy = require("../../modals/vacancy");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.post("/api/getAllUniqueCompany", async (req, res) => {
    try {
        const empId = req.body.empId;

        // Validate empId
        if (!empId) {
            return res.status(400).json({
                errorCode: 1,
                message: "Employee ID is required.",
                data: null,
            });
        }

        const result = await Company.findAll({
            where: {
                createdBy: empId, // Assuming there is a createdBy field in Vacancy
               
            },
        });

        if (result.length === 0) {
            return res.status(404).json({
                errorCode: 1,
                message: "No companies found for the given employee ID.",
                data: [],
            });
        }

        // Success response
        res.status(200).json({
            errorCode: 0,
            message: "Data Fetched Successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error in Data Fetching", error);
        return res.status(500).json({
            data: null,
            error: commonErrorCodes.somthingWentWrong.msg || "Something went wrong",
            status: commonErrorCodes.somthingWentWrong.code || 500,
            message: error.message,
        });
    }
});


module.exports = router;