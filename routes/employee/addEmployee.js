const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const Employees = require("../../modals/employees");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");
const { CreateEmpSuccesscode } = require("../../statusCodes/successCodes");
const createEmpValidation = require("../../validations/createEmpValidation");
const hash = require("../../utils/hashData");
const BankDetails = require("../../modals/bankDetails");
const Roles = require("../../modals/roles");
const rolePermissions = require("../../utils/staticRolePermissions");
const authenticate = require("../../Middleware/authenticate");
const fullUUID = uuid.v4();

function generateUniqueId(branch, departmentId) {
  const prefix = departmentId === "recruitment" ? "EM" : "DM";
  console.log(prefix); // Outputs: EM
  const suffix = uuid.v4().split("-")[0].toUpperCase();
  const uniqueId = `${prefix}-${branch}-${suffix}`;
  console.log(`Generated uniqueId: ${uniqueId}`);
  return uniqueId;
}

const createUser = async (data) => {
  const threeDigitCode = fullUUID.substring(0, 3).toUpperCase();
  const {
    branch,
    bankName,
    accountNum,
    nationalId,
    ifsc,
    password,
    fname,
    mname,
    lname,
    phone,
    email,
    perAddress,
    resAddress,
    dob,
    doj,
    dol,
    role,
    ctc,
    departmentId,
    
  } = data;
  const genratedId = generateUniqueId(branch, departmentId);
  const empData = {
    empId: genratedId,
    empCode: threeDigitCode,
    password: hash(password),
    nationalId: hash(nationalId),
    otp: "none",
    otpCreatedTime: "none",
    token: "none",
    verified: false,
    fname,
    mname,
    lname,
    phone,
    email,
    perAddress,
    resAddress,
    dob,
    doj,
    dol: dol ? dol : "not specified",
    role,
    branch,
    ctc,
    departmentId,
    empStatus: "inactive",
  };
  const bankData = {
    empId: genratedId,
    bankName: hash(bankName),
    accountNum: hash(accountNum),
    ifsc: hash(ifsc),
  };
  const roleData = {
    roleId: generateUniqueId(role, departmentId),
    empId: genratedId,
    roleName: role,
    PlaybleModule: rolePermissions(role),
  };
  const UserResponce = await Employees.create(empData);
  const bankResponce = await BankDetails.create(bankData);
  const roleResponce = await Roles.create(roleData);
  return {
    ...UserResponce?.dataValues,
    ...bankResponce?.dataValues,
    ...roleResponce?.dataValues,
  };
};

const accecableModules = [{ permission: "HR_MANAGEMENT" }];
router.post(
  "/api/createEmployee",
  // authenticate(accecableModules),
  async (req, res) => {
    try {
      const isDataValide = await createEmpValidation(req.body, res);
      if (isDataValide) {
        const is_created = await createUser({ ...req.body });
        if (is_created) {
          return res.json({
            data: is_created,
            error: null,
            message: CreateEmpSuccesscode?.empCreatedSuccess?.msg,
            status: CreateEmpSuccesscode?.empCreatedSuccess?.code,
          });
        } else {
          return res.json({
            data: null,
            error: commonErrorCodes.dataNotSetToDB.msg,
            message: null,
            status: commonErrorCodes.dataNotSetToDB.code,
          });
        }
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
