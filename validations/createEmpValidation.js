const Employees = require("../modals/employees");

const normalEmail_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
const phoneNum_regex = /^\d{10}$/;

const {
  CreateEmpErrcode,
  commonErrorCodes,
} = require("../statusCodes/errorCodes");

// ✅ response helper
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
  console.log("Validation started");

  // ✅ Basic checks FIRST (avoid DB hit if invalid)
  if (!data?.email) return sendRes(commonErrorCodes?.NoEmail, res);
  if (!normalEmail_regex.test(data.email))
    return sendRes(CreateEmpErrcode?.invalidEmail, res);

  if (!data?.fname) return sendRes(CreateEmpErrcode?.NoFname, res);
  if (!data?.lname) return sendRes(CreateEmpErrcode?.NoLname, res);
  if (!data?.phone) return sendRes(CreateEmpErrcode?.NoPhone, res);
  if (!phoneNum_regex.test(data.phone))
    return sendRes(CreateEmpErrcode?.invelidPhone, res);

  if (!data?.password) return sendRes(commonErrorCodes?.noPassword, res);
  if (!password_regex.test(data.password))
    return sendRes(CreateEmpErrcode?.weakPassword, res);

  if (!data?.cpassword)
    return sendRes(CreateEmpErrcode?.cpassnotFound, res);
  if (data.password !== data.cpassword)
    return sendRes(CreateEmpErrcode?.passwordismatch, res);

  // ✅ DB check AFTER validation
  console.log("Checking email in DB...");
  const isPresent = await Employees.findOne({
    where: { email: data.email },
  });
  console.log("DB check done");

  if (isPresent)
    return sendRes(CreateEmpErrcode?.isUser, res);

  if (!data?.perAddress)
    return sendRes(CreateEmpErrcode?.noPerAddress, res);
  if (!data?.resAddress)
    return sendRes(CreateEmpErrcode?.noResAddress, res);
  if (!data?.dob) return sendRes(CreateEmpErrcode?.noDob, res);
  if (!data?.doj) return sendRes(CreateEmpErrcode?.noDoj, res);

  if (!data?.bankName)
    return sendRes(CreateEmpErrcode?.NobankName, res);
  if (!data?.accountNum)
    return sendRes(CreateEmpErrcode?.NoAccountNum, res);
  if (!data?.ifsc)
    return sendRes(CreateEmpErrcode?.NoIfsc, res);

  if (!data?.branch)
    return sendRes(CreateEmpErrcode?.noBranch, res);
  if (!data?.ctc)
    return sendRes(CreateEmpErrcode?.noCtc, res);
  if (!data?.departmentId)
    return sendRes(CreateEmpErrcode?.noDepartment, res);
  if (!data?.nationalId)
    return sendRes(CreateEmpErrcode?.noNationalId, res);
  if (!data?.role)
    return sendRes(CreateEmpErrcode?.noRole, res);

  return true;
};

module.exports = createEmpValidation;