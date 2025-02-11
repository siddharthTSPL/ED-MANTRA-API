const express = require("express");
const router = express.Router();
const { Op, Sequelize } = require("sequelize");
const Company = require("../../modals/company");
const Vacancy = require("../../modals/vacancy");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");

router.post("/api/getOpenVacancy", async (req, res) => {
    try {
        const companyId = req.body.companyId;

        
        if (!companyId) {
            return res.status(400).json({
                errorCode: 1,
                message: "Company ID is required.",
                data: null,
            });
        }

        const result = await Vacancy.findAll({
            where: {
               companyId, 
               vacancyStatus : "Open" 
               
            },
           
        });

      

        // Success response
        res.status(200).json({
            errorCode: result.length > 0 ? 0 : -1,
            message: "Data Fetched Successfully",
            data: result.length > 0 ? result:[],
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
