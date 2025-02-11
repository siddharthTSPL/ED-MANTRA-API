const express = require("express");
const router = express.Router();
const empLoginValidation = require("../../validations/empLoginValidation");
const Employees = require("../../modals/employees");
const { commonSeccessCodes } = require("../../statusCodes/successCodes");
const { commonErrorCodes } = require("../../statusCodes/errorCodes");
const jwt = require("jsonwebtoken");
const Roles = require("../../modals/roles");
const secretKey = process.env.KEY;

router.post("/api/empLogin", async (req, res) => {
  const { empId } = req.body;
  const isPresent = await Employees.findOne({ where: { empId: empId } });
  const roles = await Roles.findOne({ where: { empId: empId } });
  const data = {
    fname: isPresent?.dataValues.fname,
    email: isPresent?.dataValues.email,
    empId: isPresent?.dataValues.empId,
    role: roles?.dataValues,
  };
  try {
    const isValide = await empLoginValidation(req.body, res);
    if (isValide) {
      const token = jwt.sign({ data }, secretKey, {
        expiresIn: "24h",
      });
      const updated = await Employees.update(
        { token: token },
        { where: { empId: empId } }
      );
      if (updated) {
        res.cookie("jwt", token, {
          httpOnly: false,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          sameSite: "strict",
        });
        return res.json({
          data: {...data , token},
          error: null,
          status: commonSeccessCodes?.loginSuccess?.code,
          message: commonSeccessCodes?.loginSuccess?.msg,
        });
      } else {
        return res.json({
          data: null,
          error: commonErrorCodes?.loginFailed?.msg,
          status: commonErrorCodes?.loginFailed?.code,
          message: null,
        });
      }
    }
  } catch (error) {
    return res.json({
      data: null,
      error: commonErrorCodes.somthingWentWrong.msg,
      status: commonErrorCodes.somthingWentWrong.code,
      message: null,
    });
  }
});

module.exports = router;
