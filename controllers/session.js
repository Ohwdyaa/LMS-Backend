const Session = require("../models/session");
const { err } = require("../utils/custom_error");

async function createSession(req, res) {
  try {
    const { id: userId } = req.user;
    const { name } = req.body;

    const isSessionExist = await Session.getSessionByName(name);
    if (isSessionExist === undefined) {
      await Session.createSession(name, userId);
      return res.status(201).json({
        message: "Session created successfully",
      });
    } else {
      return res.status(400).json({
        message: "Session is exist",
      });
    }
  } catch (error) {
    return res.status(error.statusCode || err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}
module.exports = {
  createSession,
};
