const express = require("express");
const router = express.Router();
const { commonErrorCodes } = require("../../statusCodes/errorCodes");
const { CreateEmpSuccesscode } = require("../../statusCodes/successCodes");
const createEmpValidation = require("../../validations/createEmpValidation");
const authenticate = require("../../Middleware/authenticate");

router.post(
  "/api/createEmployee",
  authenticate(accecableModules),
  async (req, res) => {
    try {
      const isDataValide = await createEmpValidation(req.body, res);
      if (isDataValide) {
        const is_created = await createUser({ ...req.body });
        if (is_created) {
          return res.json({
            data: is_created,
            error: null,
            message: CreateEmpSuccesscode?.empCreatedSuccess?.msg,
            status: CreateEmpSuccesscode?.empCreatedSuccess?.code,
          });
        } else {
          return res.json({
            data: null,
            error: commonErrorCodes.dataNotSetToDB.msg,
            message: null,
            status: commonErrorCodes.dataNotSetToDB.code,
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
  }
);

module.exports = router;
