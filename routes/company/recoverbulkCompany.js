const express = require("express");
const router = express.Router();
const CompanyData = require("../../modals/company");
const { Op } = require("sequelize");

router.put("/api/recoverbulkCompany", async (req, res) => {
    const { company } = req.body;

    console.log("Received company:", company);

    if (!Array.isArray(company) || company.length === 0) {
        return res.status(400).json({
            errorCode: 1,
            message: "Invalid input format. Expected company array."
        });
    }

    const companyIds = company
        .map(item => item.companyId)
        .filter(Boolean);

    if (companyIds.length === 0) {
        return res.status(400).json({
            errorCode: 1,
            message: "No valid companyId found."
        });
    }

    try {
        const [updatedCount] = await CompanyData.update(
            {
                companyStatus: "Live Company"
            },
            {
                where: {
                    companyId: {
                        [Op.in]: companyIds
                    },
                    companyStatus: "Dead Company"
                }
            }
        );

        console.log("Recovered Count:", updatedCount);

        return res.status(200).json({
            errorCode: 0,
            message: "Companies recovered successfully",
            updatedCount
        });

    } catch (error) {
        console.error("Error recovering companies:", error);

        return res.status(500).json({
            errorCode: 1,
            message: "Internal server error",
            error: error.message
        });
    }
});

module.exports = router;