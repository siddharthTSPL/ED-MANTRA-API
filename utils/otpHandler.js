const sendEmail = require("../controller/emailer");
const hash = require("./hashData");
const Employees = require("../modals/employees");
const { commonErrorCodes } = require("../statusCodes/errorCodes");
const { commonSeccessCodes } = require("../statusCodes/successCodes");
var currentDateTime = new Date();


const handelOtp= async(data , res) =>{
  const hashOtp = hash(data?.otp);
  try {
    const updated = await Employees.update(
      { otp: hashOtp, otpCreatedTime: currentDateTime.toString() },
      { where: { empId: data?.empId } }
    );
    if (updated) {
      const is_Send = await sendEmail({
        email: data?.email,
        subject: data?.subject,
        template: data?.template,
      });
      if (!is_Send) {
        return res.json({
          data: null,
          error: commonErrorCodes?.otpNotSend?.msg,
          status: commonErrorCodes?.otpNotSend?.code,
          message: null,
        });
      } else {
        return res.json({
          data: null,
          error: null,
          message: commonSeccessCodes?.otpSent?.msg,
          status: commonSeccessCodes?.otpSent?.code,
        });
      }
    } else {
      return res.json({
        data: null,
        error: commonErrorCodes?.dataNotSetToDB?.msg,
        status: commonErrorCodes?.dataNotSetToDB?.code,
        message: null,
      });
    }
  } catch (error) {
    return res.json({
      data: null,
      error: null,
      status: commonErrorCodes?.somthingWentWrong?.code,
      message: commonErrorCodes?.somthingWentWrong?.msg,
    });
  }
}
 
const otpHandler = async (data , res) => {
  return await handelOtp(data , res).catch((error)=>console.log(error))
};

module.exports = otpHandler;
