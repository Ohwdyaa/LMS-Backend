const {
  requestResetPassword,
  resetPassword,
} = require("../validate/forgot_password");
const { err, } = require("../utils/customError");


async function requestResetPassHandler(req, res) {
  try {
    const { email } = req.body;
    await requestResetPassword(email);
    return res.status(200).json({
      message: "request successful",
      data: { email },
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorLogin.statusCode).json({
      message: error.message || err.errorLogin.message,
      details: error.stack || null,
    });
  }
}

async function resetPassHandler(req, res) {
  try {
    const { token } = req.params;
   // const {id : userId} = req.params;
    const {password : newPassword} = req.body;

    const result = await resetPassword(token, newPassword);
    return res.status(200).json({
      message: "password updated successfully",
      result,
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorUpdate.statusCode).json({
      message: error.message || err.errorUpdate.message,
      details: error.details || null,
    });
  }
}
module.exports = {
  requestResetPassHandler,
  resetPassHandler,
};
