const express = require("express");
const authenticate = require("../../Middleware/authenticate");
const Employees = require("../../modals/employees");
const sendEmail = require("../../controller/emailer");
const employeeCreds = require("../../emailTemplates/employeeCreds");
const router = express.Router();
const decryptData = require("../../utils/decryptData");
const {
  CreateEmpErrcode,
  commonErrorCodes,
} = require("../../statusCodes/errorCodes");
const {
  CreateEmpSuccesscode,
  commonSeccessCodes,
} = require("../../statusCodes/successCodes");
const Roles = require("../../modals/roles");
const accecableModules = [{ permission: "USER_MANAGEMENT" }];

router.post(
  "/api/updateEmp",
  authenticate(accecableModules),
  async (req, res) => {
    try {
      const isUpdated = Employees.update(req.body?.formValues, {
        where: { empId: req.body?.formValues.empId },
      });
      const isPermissionUpdated = Roles.update(req.body?.modules, {
        where: { empId: req.body?.formValues.empId },
      });
      if (isUpdated && isPermissionUpdated) {
        return res.json({
          data: null,
          error: null,
          message: commonSeccessCodes.updateSuccess.msg,
          status: commonSeccessCodes.updateSuccess.code,
        });
      } else {
        return res.json({
          data: null,
          error: commonErrorCodes.updatefailed.msg,
          message: null,
          status: commonErrorCodes.updatefailed.code,
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

router.post(
  "/api/activateUser",
  authenticate(accecableModules),
  async (req, res) => {
    try {
      const isActivated = Employees.update(
        { empStatus: req?.body?.empStatus },
        {
          where: { empId: req?.body?.empId },
        }
      );

      if (isActivated) {
        const userInfo = await Employees.findOne({
          where: { empId: req?.body?.empId },
          raw: true,
        });
        const is_Send = sendEmail({
          email: userInfo?.email,
          subject: "User credentials",
          template: employeeCreds({
            fname: userInfo?.fname,
            empId: userInfo?.empId,
            password: decryptData(userInfo?.password),
          }),
        });

        if (is_Send) {
          return res.json({
            data: null,
            error: null,
            message: CreateEmpSuccesscode.userActivated.msg,
            status: CreateEmpSuccesscode.userActivated.code,
          });
        }
      } else {
        return res.json({
          data: null,
          error: CreateEmpErrcode.userActivationFaild.msg,
          message: null,
          status: CreateEmpErrcode.userActivationFaild.code,
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
