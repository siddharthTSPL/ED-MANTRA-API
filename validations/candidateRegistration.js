const { candidateErrorCode } = require("../statusCodes/errorCodes");
const { _ } = require("lodash");
const sendRes = (val, res) => {
  res.json({
    data: null,
    error: val?.msg,
    status: val?.code,
    message: null,
  });
  return false;
};

const candidateRegistrationValidation = async (data, res) => {
  if (!data?.phone || _.isEmpty(data?.phone) || _.isNil(data?.phone)) {
    return sendRes(candidateErrorCode?.Nophone, res);
  } else {
    return true;
  }
};

module.exports = candidateRegistrationValidation;
