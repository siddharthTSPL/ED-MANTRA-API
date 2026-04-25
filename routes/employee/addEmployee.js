const express = require("express");
const router = express.Router();
const uuid = require("uuid");

const Employees = require("../../modals/employees");
const BankDetails = require("../../modals/bankDetails");
const Roles = require("../../modals/roles");

const { commonErrorCodes } = require("../../statusCodes/errorCodes");
const { CreateEmpSuccesscode } = require("../../statusCodes/successCodes");

const createEmpValidation = require("../../validations/createEmpValidation");
const hash = require("../../utils/hashData");
const rolePermissions = require("../../utils/staticRolePermissions");

// ✅ generate ID
function generateUniqueId(branch, departmentId) {
  const prefix = departmentId === "recruitment" ? "EM" : "DM";
  const suffix = uuid.v4().split("-")[0].toUpperCase();
  return `${prefix}-${branch}-${suffix}`;
}

// ✅ create user
const createUser = async (data) => {
  const fullUUID = uuid.v4(); // FIXED (was global before)
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

  // ✅ Debug logs to catch hanging
  console.log("Creating Employee...");
  const userRes = await Employees.create(empData);

  console.log("Creating Bank...");
  const bankRes = await BankDetails.create(bankData);

  console.log("Creating Role...");
  const roleRes = await Roles.create(roleData);

  return {
    ...userRes.dataValues,
    ...bankRes.dataValues,
    ...roleRes.dataValues,
  };
};

// ✅ ROUTE
router.post("/api/createEmployee", async (req, res) => {
  console.log("API HIT");

  try {
    const isValid = await createEmpValidation(req.body, res);

    // ✅ prevent hanging
    if (!isValid) return;

    const created = await createUser(req.body);

    if (created) {
      return res.json({
        data: created,
        error: null,
        message: CreateEmpSuccesscode?.empCreatedSuccess?.msg,
        status: CreateEmpSuccesscode?.empCreatedSuccess?.code,
      });
    }

    return res.json({
      data: null,
      error: commonErrorCodes.dataNotSetToDB.msg,
      message: null,
      status: commonErrorCodes.dataNotSetToDB.code,
    });
  } catch (error) {
    console.error("Create Employee Error:", error);

    return res.json({
      data: null,
      error: commonErrorCodes.somthingWentWrong.msg,
      status: commonErrorCodes.somthingWentWrong.code,
      message: null,
    });
  }
});

module.exports = router;