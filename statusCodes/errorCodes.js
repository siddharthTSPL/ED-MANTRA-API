const CreateEmpErrcode = {
  NoPhone: { code: "-101", msg: "phone number not found" },
  invelidPhone: { code: "-102", msg: "invelid phone number" },
  NoFname: { code: "-103", msg: "first name not found" },
  NoLname: { code: "-104", msg: "last name nit found" },
  invalidEmail: { code: "-105", msg: "invelid email" },
  isUser: { code: "-106", msg: "alredy a user" },
  weakPassword: { code: "-108", msg: "weak password " },
  cpassnotFound: { code: "-109", msg: "confirm password not found" },
  passwordismatch: { code: "-110", msg: "password missMatch" },
  noPerAddress: { code: "-111", msg: "permanent address not found" },
  noResAddress: { code: "-112", msg: "resedence address not found" },
  noDob: { code: "-113", msg: "dob not found" },
  noDoj: { code: "-114", msg: "doj not found" },
  nodol: { code: "-115", msg: "dol not found" },
  NobankName: { code: "-116", msg: "bank name not found" },
  NoAccountNum: { code: "-117", msg: "account number not found" },
  NoIfsc: { code: "-118", msg: "ifsc code not found" },
  noBranch: { code: "-121", msg: "branch name not found" },
  credEmailFailed: { code: "-122", msg: "credential email not send" },
  noCtc: { code: "-134", msg: "not ctc found" },
  noDepartment: { code: "-135", msg: "no department found" },
  noNationalId: { code: "-136", msg: "no national id found" },
  noRole: { code: "-137", msg: "no role found" },
  userActivationFaild: { code: "-142", msg: "User change failed" },
};

const commonErrorCodes = {
  dataNotSetToDB: {
    code: "-124",
    msg: " somthing went wrong while sending data to db",
  },
  somthingWentWrong: { code: "-125", msg: "something went wrong" },
  NoEmail: { code: "-100", msg: "email not foud" },
  noPassword: { code: "-107", msg: "password not found" },
  userNotFound: { code: "-126", msg: "user not found" },
  userNotVerifiedOtpSent: {
    code: "-127",
    msg: "user not not verified otp sent",
  },
  invelidCredentials: { code: "-128", msg: "invelid credentials" },
  loginFailed: { code: "-129", msg: "login failed" },
  otpNotSend: { code: "-130", msg: "otp not send" },
  wrongOtp: { code: "-131", msg: "wrong OTP" },
  otpExpired: { code: "-132", msg: "OTP expired" },
  verificationFailed: { code: "-133", msg: "otp verification failed" },
  failedTOAuthToken: { code: "-138", msg: "failed to authenticate token" },
  NoTokenProvided: { code: "-139", msg: "no token provided" },
  accessDenied: { code: "-140", msg: "not autherized to make this request" },
  cantGet: { code: "-141", msg: "cant get" },
  inactiveUser: { code: "-143", msg: "You are not an active user" },
  updatefailed: { code: "-144", msg: "Update Failed" },
};

const candidateErrorCode = {
  Nophone: { code: "-100", msg: "Phone Number not found" },
};

module.exports = { CreateEmpErrcode, commonErrorCodes, candidateErrorCode };
