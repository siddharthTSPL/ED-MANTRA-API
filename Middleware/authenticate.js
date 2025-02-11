const jwt = require("jsonwebtoken");
const { commonErrorCodes } = require("../statusCodes/errorCodes");

const areAllStringsPresent = (array1, array2) => {
  let result = false;
  for (let i = 0; i < array2?.length; i++) {
    for (let j = 0; j < array1?.length; j++) {
      if (array2[i].permission === array1[j].permission) {
        result = true;
        break;
      }
    }
  }
  return result;
};

const authenticate = (permissions) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.jwt;
      jwt.verify(token, process.env.KEY, async (err, decoded) => {
        if (err) {
          return res.json({
            data: null,
            error: commonErrorCodes?.failedTOAuthToken?.msg,
            message: null,
            status: commonErrorCodes?.failedTOAuthToken?.code,
          });
        } else {
          if (!decoded) {
            throw new Error("user not found");
          } else {
            const tokenPermissions = JSON.parse(
              decoded?.data?.role?.PlaybleModule
            );
            
            if (areAllStringsPresent(tokenPermissions, permissions)) {
              req.token = token;
              req.rootUser = decoded;
            } else {
              return res.json({
                data: null,
                error: commonErrorCodes?.accessDenied?.msg,
                message: null,
                status: commonErrorCodes?.accessDenied?.code,
              });
            }
          }
        }
        next();
      });
    } catch (error) {
      return res.json({
        data: null,
        error: commonErrorCodes?.NoTokenProvided?.msg,
        status: commonErrorCodes?.NoTokenProvided?.code,
      });
    }
  };
};

module.exports = authenticate;
