const express = require("express");
const router = express.Router();
const { commonErrorCodes } = require("../../statusCodes/errorCodes");
const Vacancy = require("../../modals/vacancy");
const Company = require("../../modals/company");
const Interview = require("../../modals/interviewSchedule");

router.post("/api/bulkAssign", async (req, res) => {
    try {
        const { createdBy, companyList } = req.body;

        if (!companyList || !Array.isArray(companyList) || companyList.length === 0) {
            return res.status(400).json({
                errorCode: 1,
                message: "Invalid Company List",
                data: null,
            });
        }

        // Loop through each vacancy and update the `createdBy` field
        const updatePromises = companyList.map(item => {

            const updateCompany = Company.update(
                { createdBy },  // Updating only the createdBy field in Company
                { where: { companyId: item?.companyId } }
            );

            // Update Vacancy model based on the same companyId
            const updateVacancy = Vacancy.update(
                { createdBy },  // Updating only the createdBy field in Vacancy
                { where: { companyId: item?.companyId } }
            );

            // Update Vacancy model based on the same companyId
            const updateinterviewSchedule = Interview.update(
                { createdBy },  // Updating only the createdBy field in Vacancy
                { where: { companyId: item?.companyId } }
            );

            // Return both promises so both updates happen in parallel
            return Promise.all([updateCompany, updateVacancy, updateinterviewSchedule]);


        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);


        res.status(200).json({
            errorCode: 0,
            message: "Company Assigned Successfully",
            data: {},
        });
    } catch (error) {
        console.error("Error in Bulk Data Updating", error);
        return res.status(500).json({
            data: null,
            error: commonErrorCodes.somthingWentWrong.msg,
            status: commonErrorCodes.somthingWentWrong.code,
            message: null,
        });
    }
});

module.exports = router;
