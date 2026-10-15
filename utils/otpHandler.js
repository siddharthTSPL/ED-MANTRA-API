const sendEmail = require("../controller/emailer");
const hash = require("./hashData");
const Employees = require("../modals/employees");

// Saves the hashed OTP and emails it to the employee.
// It does NOT send an HTTP response; the caller is responsible for that.
// Returns true if the OTP was saved and the email was accepted, otherwise false.
const otpHandler = async (data) => {
  try {
    const hashOtp = hash(data?.otp);
    const updated = await Employees.update(
      { otp: hashOtp, otpCreatedTime: new Date().toString() },
      { where: { empId: data?.empId } }
    );
    if (!updated) {
      console.error("OTP not saved to DB for empId:", data?.empId);
      return false;
    }

    const isSent = await sendEmail({
      email: data?.email,
      subject: data?.subject,
      template: data?.template,
    });
    if (!isSent) {
      console.error("OTP email not accepted for empId:", data?.empId);
    }
    return isSent;
  } catch (error) {
    console.error("OTP handling failed:", error.message);
    return false;
  }
};

module.exports = otpHandler;