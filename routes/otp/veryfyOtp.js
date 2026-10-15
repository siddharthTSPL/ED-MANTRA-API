const express = require("express");
const Employees = require("../../modals/employees");
const router = express.Router();
const moment = require("moment");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");
const { commonSeccessCodes } = require("../../statusCodes/successCodes");
const decryptData = require("../../utils/decryptData");


router.post("/api/veryfyOtp", async(req, res) => {
  try {
    const isPresent = await Employees.findOne({
      where: { empId: req?.body?.empId },
    });
    // minutes since the OTP was created
    const otpAgeMinutes = moment().diff(
      moment(new Date(isPresent?.dataValues?.otpCreatedTime)),
      "minutes"
    );

    if (decryptData(isPresent?.dataValues?.otp)!==req?.body?.otp) {
      return res.json({
        data: null,
        error: commonErrorCodes?.wrongOtp?.msg,
        message: null,
        status: commonErrorCodes?.wrongOtp?.code
      });
    } else {
      if (!(otpAgeMinutes >= 0 && otpAgeMinutes <= 5)) {
        return res.json({
          data: null,
          error:commonErrorCodes?.otpExpired?.msg,
          message: null,
          status:commonErrorCodes?.otpExpired?.code
        });
      } else {
        const updated = await Employees.update(
          { verified: true },
          { where: { empId: req.body.empId } }
        );
        if (updated) {
          return res.json({
            data: null,
            error: commonSeccessCodes?.verificationSuccess?.msg,
            message: null,
            status: commonSeccessCodes?.verificationSuccess?.code
          });
        } else {
          return res.json({
            data: null,
            error: commonErrorCodes?.verificationFailed?.msg,
            message: null,
            status:commonErrorCodes?.verificationFailed?.code
          });
        }
      }
    }
  } catch (error) {
    return res.json({
      data: null,
      error: null,
      status: commonErrorCodes?.somthingWentWrong?.code,
      message: commonErrorCodes?.somthingWentWrong?.msg,
    });
  }
});

module.exports=router