const otpGenrator = require("../utils/otpGenrator");
const varificationOtpTemp = require("../emailTemplates/vareificationOtpTemp");
const Employees = require("../modals/employees");
const { commonErrorCodes } = require("../statusCodes/errorCodes");
const decryptData = require("../utils/decryptData");
const otpHandler = require("../utils/otpHandler");

const sendRes = (val, res) => {
  res.json({
    data: val?.empId,
    error: val?.msg,
    status: val?.code,
    message: null,
  });
  return false;
};

const empLoginValidation = async (data, res) => {
  const isPresent = await Employees.findOne({ where: { empId: data?.empId } });
  // const is_match = await decrypt(
  //   data?.password,
  //   isPresent?.dataValues?.password
  // );

  if (!data?.empId) {
    return sendRes(commonErrorCodes?.NoEmail, res);
  } else if (!data?.password) {
    return sendRes(commonErrorCodes?.noPassword, res);
  } else if (!isPresent?.dataValues) {
    return sendRes(commonErrorCodes?.userNotFound, res);
  } else if (decryptData(isPresent?.dataValues?.password) !== data?.password) {
    return sendRes(commonErrorCodes?.invelidCredentials, res);
  } 
  else if (isPresent?.dataValues?.verified !== true) {
    const otp = otpGenrator();
    const emailData = {
      email: isPresent?.dataValues?.email,
      subject: "verification Otp",
      otp: otp,
      empId: isPresent?.dataValues?.empId,
      template: varificationOtpTemp({
        fname: isPresent?.dataValues?.fname,
        otp: otp,
      }),
    };
     otpHandler(emailData, res);
    return sendRes(
      {
        ...commonErrorCodes?.userNotVerifiedOtpSent,
        empId: isPresent?.dataValues?.empId,
      },
      res
    );
  }
  else if(isPresent?.dataValues?.empStatus!=="active"){
    sendRes(commonErrorCodes?.inactiveUser, res);
  }
  else {
    return true;
  }
};

module.exports = empLoginValidation;
