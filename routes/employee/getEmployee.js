const express = require("express");
const authenticate = require("../../Middleware/authenticate");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");
const Employees = require("../../modals/employees");
const Roles = require("../../modals/roles");
const { commonSeccessCodes } = require("../../statusCodes/successCodes");
const { Op } = require("sequelize");
const router = express.Router();
const accecableModules = [{ permission: "USER_MANAGEMENT" }];
router.get(
  "/api/getEmployes",
  authenticate(accecableModules),
  async (req, res) => {
    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 8;
    const offset = (page - 1) * limit;

    try {
      const empdata = await Employees.findAll({
        include: [
          {
            model: Roles,
            attributes: ["roleName", "PlaybleModule", "NonPlayble_module"], // Specify the columns you want from RolePermission
          },
        ],
        attributes: [
          "empId",
          "empCode",
          "fname",
          "mname",
          "lname",
          "phone",
          "email",
          "perAddress",
          "resAddress",
          "dob",
          "doj",
          "dol",
          "branch",
          "ctc",
          "departmentId",
          "empStatus",
        ], // Specify the columns you want from Employee
        // order: [["createdAt", "DESC"]],
        // limit: limit,
        // offset: offset,
        where: {
          empId: {
            [Op.ne]: req.rootUser.data.empId, 
          },
        },
        raw: true,
      });

      if (empdata) {
        return res.json({
          data: empdata,
          error: null,
          status: commonSeccessCodes?.getSuccess?.code,
          message: commonSeccessCodes?.getSuccess?.msg,
        });
      } else {
        return res.json({
          data: null,
          error: commonErrorCodes?.cantGet?.msg,
          status: commonErrorCodes?.cantGet?.code,
          message: null,
        });
      }
    } catch (error) {
      return res.json({
        data: null,
        error: commonErrorCodes.somthingWentWrong.msg,
        status: commonErrorCodes.somthingWentWrong.code,
        message: null,
      });
    }
  }
);

module.exports = router;
