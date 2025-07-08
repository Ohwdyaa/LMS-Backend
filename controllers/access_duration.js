const Session = require("../models/access_duration");
const { err } = require("../utils/custom_error");

async function startSession(req, res) {
  try {
    const { id: menteesId } = req.user;
    const { coursesId } = req.body;

    if (coursesId === undefined) {
      return res.status(400).json({ message: "courseId is required" });
    }

    const result = await Session.startSession(menteesId, coursesId);
    return res.status(201).json({
      sessionId: result.sessionId,
      startTime: result.startTime,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function heartbeatSession(req, res) {
  try {
    const { id: sessionId } = req.params;
    const { minutes } = req.body;
    const { id: userId } = req.user;

    if (sessionId === undefined || minutes === null) {
      return res
        .status(400)
        .json({ message: "sessionId and elapsedMinutes are required" });
    }
    const sessionAccessExist = await Session.getSessionAccessById(sessionId);
    if (sessionAccessExist === undefined) {
      return res.status(400).json({ message: "Session not found or deleted" });
    }

    const result = await Session.heartbeatSession(sessionId, minutes, userId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}
async function endSession(req, res) {
  try {
    const { id: sessionId } = req.params;
    const { id: userId } = req.user;
    const { totalMinutes } = req.body;

    if (sessionId === undefined) {
      return res
        .status(400)
        .json({ message: "sessionId and totalMinutes are required" });
    }
    const sessionAccessExist = await Session.getSessionAccessById(sessionId);
    if (sessionAccessExist === undefined) {
      return res.status(400).json({ message: "Session not found or deleted" });
    }

    const endTime = new Date();
    const startTime = new Date(sessionAccessExist.start_time);
    // const totalMinutes = Math.max(1, Math.round((endTime - startTime) / (1000 * 60)));

    const result = await Session.endSession(sessionId, totalMinutes, userId, endTime);
    return res.status(200).json({
      startTime: sessionAccessExist.start_time,
      result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

module.exports = {
  startSession,
  heartbeatSession,
  endSession,
};
