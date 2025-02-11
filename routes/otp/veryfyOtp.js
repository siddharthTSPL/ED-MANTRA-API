const express = require("express");
const Employees = require("../../modals/employees");
const router = express.Router();
const moment = require("moment");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");
const { commonSeccessCodes } = require("../../statusCodes/successCodes");
const decryptData = require("../../utils/decryptData");
var currentDateTime = new Date();


router.post("/api/veryfyOtp", async(req, res) => {
  try {
    const isPresent = await Employees.findOne({
      where: { empId: req?.body?.empId },
    });
    const createdTime = parseInt(
      moment(isPresent?.dataValues?.otpCreatedTime).format("mm")
    );
    const createdDate = moment(isPresent?.dataValues?.otpCreatedTime).format(
      "DD-MM-YYY"
    );
    const curretime = parseInt(moment(currentDateTime).format("mm"));
    const currDate = moment(currentDateTime).format("DD-MM-YYYY");

    if (decryptData(isPresent?.dataValues?.otp)!==req?.body?.otp) {
      return res.json({
        data: null,
        error: commonErrorCodes?.wrongOtp?.msg,
        message: null,
        status: commonErrorCodes?.wrongOtp?.code
      });
    } else {
      if (Math.abs(createdDate !== currDate && createdTime - curretime) > 5) {
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