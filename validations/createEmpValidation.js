const normalEmail_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
const phoneNum_regex = /^\d{10}$/;
const Employees = require("../modals/employees");
const {
  CreateEmpErrcode,
  commonErrorCodes,
} = require("../statusCodes/errorCodes");

const sendRes = (val, res) => {
  res.json({
    data: null,
    error: val?.msg,
    status: val?.code,
    message: null,
  });
  return false;
};

const createEmpValidation = async (data, res) => {
  const isPresent = await Employees.findOne({ where: { email: data?.email } });
  if (!data?.email) {
    return sendRes(commonErrorCodes?.NoEmail, res);
  } else if (!data?.fname) {
    return sendRes(CreateEmpErrcode?.NoFname, res);
  } else if (!data?.lname) {
    return sendRes(CreateEmpErrcode?.NoLname, res);
  } else if (!data?.phone) {
    return sendRes(CreateEmpErrcode?.NoPhone, res);
  } else if (!normalEmail_regex.test(data?.email)) {
    return sendRes(CreateEmpErrcode?.invalidEmail, res);
  } else if (isPresent?.dataValues) {
    return sendRes(CreateEmpErrcode?.isUser, res);
  } else if (!data?.password) {
    return sendRes(commonErrorCodes?.noPassword, res);
  } else if (!password_regex.test(data?.password)) {
    return sendRes(CreateEmpErrcode?.weakPassword, res);
  } else if (!data?.cpassword) {
    return sendRes(CreateEmpErrcode?.cpassnotFound, res);
  } else if (data?.password !== data?.cpassword) {
    return sendRes(CreateEmpErrcode?.passwordismatch, res);
  } else if (!phoneNum_regex.test(data?.phone)) {
    return sendRes(CreateEmpErrcode?.invelidPhone, res);
  } else if (!data?.perAddress) {
    return sendRes(CreateEmpErrcode?.noPerAddress, res);
  } else if (!data?.resAddress) {
    return sendRes(CreateEmpErrcode?.noResAddress, res);
  } else if (!data?.dob) {
    return sendRes(CreateEmpErrcode?.noDob, res);
  } else if (!data?.doj) {
    return sendRes(CreateEmpErrcode?.noDoj, res);
  } 
  // else if (!data?.dol) {
  //   return sendRes(CreateEmpErrcode?.nodol, res);
  // } 
  else if (!data?.bankName) {
    return sendRes(CreateEmpErrcode?.NobankName, res);
  } else if (!data?.accountNum) {
    return sendRes(CreateEmpErrcode?.NoAccountNum, res);
  } else if (!data?.ifsc) {
    return sendRes(CreateEmpErrcode?.NoIfsc, res);
  }  else if (!data?.branch) {
    return sendRes(CreateEmpErrcode?.noBranch, res);
  } else if (!data?.ctc) {
    return sendRes(CreateEmpErrcode?.noCtc, res);
  } 
  else if (!data?.departmentId) {
    return sendRes(CreateEmpErrcode?.noDepartment, res);
  }
  else if (!data?.nationalId) {
    return sendRes(CreateEmpErrcode?.noNationalId, res);
  }
  else if (!data?.role) {
    return sendRes(CreateEmpErrcode?.noRole, res);
  }
  
  
  else {
    return true;
  }
};

module.exports = createEmpValidation;
