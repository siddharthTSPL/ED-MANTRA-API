const express = require("express");
const router = express.Router();
const MarketingLeads = require("../../modals/marketingLeads");
const { Sequelize, Op } = require("sequelize");
const sequelize = require("../../connections/db")
const Employees = require("../../modals/employees");
const authenticate = require("../../Middleware/authenticate");
const MarketingRemarks = require("../../modals/marketingRemarks");
console.log(MarketingLeads.associations);
const accecableModules = [
  { permission: "USER_MANAGEMENT" },
  { permission: "MARKETING_MANAGEMENT" },
];

router.get(
  "/api/getMarketingLead",
  // authenticate(accecableModules),
  async (req, res) => {
    try {
      // const data = await MarketingLeads.findAll({
      //   attributes: [
      //     "SrNo",
      //     "LeadId",
      //     "telecaller",
      //     "clientName",
      //     "collegeCategory",
      //     "brief",
      //     "pocName",
      //     "pocMobile",
      //     "pocEmail",
      //     "pocDesignation",
      //     "address",
      //     "location",
      //     "campaignPurpose",
      //     "otherCampaignPurpose",
      //     "interestLevel",
      //     "status",
      //     "source",
      //     "otherSource",
      //     "decisionMaker",
      //     "dmMobile",
      //     "dmDesignation",
      //     "dmEmail",
      //     "preferredContactTiming",
      //     "nextfollow",
      //     "createdAt",
      //     "updatedAt",
      //   ],
      //   include: [
      //     {
      //       model: MarketingRemarks,
      //       attributes: ["remark", "remarkDateTime", "empId", "createdAt"],
      //       include: [
      //         {
      //           model: Employees,
      //           as: "employee",
      //           on: Sequelize.literal(`CAST("MarketingRemarks"."empId" AS TEXT) = CAST("employee"."empId" AS TEXT)`),
      //           required: false, // In case some remarks might not have an employee assigned
                
      //         },
      //       ],
      //       required: false,
      //       separate: true,
      //       order: [["createdAt", "ASC"]],
      //     },
      //   ],
      //   order: [["SrNo", "ASC"]],
      // });
      // attributes: [
      //  "SrNo",
      //   "LeadId",
      //   "telecaller",
      //   "clientName",
      //   "collegeCategory",
      //   "brief",
      //   "pocName",
      //   "pocMobile",
      //   "pocEmail",
      //   "pocDesignation",
      //   "address",
      //   "location",
      //   "campaignPurpose",
      //   "otherCampaignPurpose",
      //   "interestLevel",
      //   "status",
      //   "source",
      //   "otherSource",
      //   "decisionMaker",
      //   "dmMobile",
      //   "dmDesignation",
      //   "dmEmail",
      //   "preferredContactTiming",
      //   "nextfollow",
      //   "createdAt",
      //   "updatedAt",
      // ],

      // include: [
      //   {
      //     model: MarketingRemarks,
      //     attributes: [
      //       "remark",
      //       "remarkDateTime",
      //       "empId",
      //       "createdAt",
      //     ],
      //     include: [
      //       {
      //         model: Employees,
      //         attributes: [
      //           "fname",
      //            "role"
      //           ],
      //         where: {
      //           empId: "MarketingRemarks.empId"
      //         },
      //         required: true,
      //       },
      //     ],
      //     separate: true,
      //     order: [["createdAt", "ASC"]],
      //   },
      // ],

      //   order: [["SrNo", "ASC"]],
      // });

      const [results] = await sequelize.query(`
        SELECT 
          ml."SrNo",
          ml."LeadId",
          ml."telecaller",
          ml."clientName",
          ml."collegeCategory",
          ml."brief",
          ml."pocName",
          ml."pocMobile",
          ml."pocEmail",
          ml."pocDesignation",
          ml."address",
          ml."location",
          ml."campaignPurpose",
          ml."otherCampaignPurpose",
          ml."interestLevel",
          ml."status",
          ml."source",
          ml."otherSource",
          ml."decisionMaker",
          ml."dmMobile",
          ml."dmDesignation",
          ml."dmEmail",
          ml."preferredContactTiming",
          ml."nextfollow",
          ml."createdAt" as "leadCreatedAt",
          ml."updatedAt" as "leadUpdatedAt",
          json_agg(
            json_build_object(
              'remark', mr."remark",
              'remarkDateTime', mr."remarkDateTime",
              'empId', mr."empId",
              'employee', json_build_object(
                'fname', e."fname",
                'role', e."role"
              )
            )
          ) AS "remarks"
        FROM "MarketingLeads" ml
        LEFT JOIN "MarketingRemarks" mr ON ml."LeadId" = mr."LeadId"
        LEFT JOIN "Employees" e ON mr."empId" = e."empId"
        GROUP BY ml."SrNo", ml."LeadId"
        ORDER BY ml."SrNo" ASC
      `);

      if (results) {
        return res.status(200).send({ data:results, message: "Data found " });
      } else {
        return res.status(200).send({ data: null, message: "Data not found " });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "An error occurred", error });
    }
  }
);

module.exports = router;
