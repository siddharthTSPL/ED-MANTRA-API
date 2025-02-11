const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const multer = require("multer");
const path = require("path");
const Vacancy = require("../../modals/vacancy");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");





router.post("/api/addVacancy",



    async (req, res) => {
        try {



            const {
                companyId,
                companyName,
                primaryPOCMobile,
                vacancyStatus,
                jobProfile,
                sector,
                location,
                noOfVacancy,
                salaryRangeMin,
                salaryRangeMax,
                experience,
                genderpref,
                dateOfCreation,
                recruitementManager,
                jobDiscription,
                pdcDate,
                tANDc,
                createdBy,
            } = req?.body;



            // const orgAgree = OrgAgree.filename;

            const result = await Vacancy.create({
                companyId,
                companyName,
                primaryPOCMobile,
                vacancyStatus,
                jobProfile,
                sector,
                location,
                noOfVacancy,
                salaryRangeMin,
                salaryRangeMax,
                experience,
                genderpref,
                dateOfCreation,
                recruitementManager,
                jobDiscription,
                pdcDate,
                tANDc,
                createdBy,
            });
            res.status(200).json({
                errorCode: 0,
                message: "Data Added Successfully",
                data: result,
            });
        } catch (error) {
            console.error("Error in Data Adding", error);
            return res.status(500).json({
                data: null,
                error: commonErrorCodes.somthingWentWrong.msg,
                status: commonErrorCodes.somthingWentWrong.code,
                message: null,
            });
        }
    });

module.exports = router;
