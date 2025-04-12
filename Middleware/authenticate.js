const jwt = require("jsonwebtoken");
const { commonErrorCodes } = require("../statusCodes/errorCodes");

const areAllStringsPresent = (userPermissions, requiredPermissions) => {
  return requiredPermissions.every((perm) =>
    userPermissions.some((userPerm) => userPerm.permission === perm.permission)
  );
};

const authenticate = (permissions) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.jwt;
      if (!token) {
        return res.status(401).json({
          data: null,
          error: commonErrorCodes?.NoTokenProvided?.msg,
          status: commonErrorCodes?.NoTokenProvided?.code,
        });
      }

      jwt.verify(token, process.env.KEY, async (err, decoded) => {
        if (err || !decoded) {
          return res.status(401).json({
            data: null,
            error: commonErrorCodes?.failedTOAuthToken?.msg,
            status: commonErrorCodes?.failedTOAuthToken?.code,
          });
        }

        const tokenPermissions = Array.isArray(decoded?.data?.role?.PlaybleModule)
          ? decoded.data.role.PlaybleModule
          : JSON.parse(decoded?.data?.role?.PlaybleModule || "[]");

        if (!areAllStringsPresent(tokenPermissions, permissions)) {
          return res.status(403).json({
            data: null,
            error: commonErrorCodes?.accessDenied?.msg,
            status: commonErrorCodes?.accessDenied?.code,
          });
        }

        req.token = token;
        req.rootUser = decoded;
        next(); // ✅ Call `next()` only when authentication succeeds
      });
    } catch (error) {
      return res.status(500).json({
        data: null,
        error: commonErrorCodes?.NoTokenProvided?.msg,
        status: commonErrorCodes?.NoTokenProvided?.code,
      });
    }
  };
};

module.exports = authenticate;
