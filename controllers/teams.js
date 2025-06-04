const Teams = require("../models/teams");
const { hashPassword } = require("../utils/bcrypt");
const { err } = require("../utils/custom_error");

async function createTeam(req, res) {
  try {
    const { id: userId } = req.user;
    const { email } = req.body;

    const isUserExist = await Teams.getTeamByEmail(email);
    if (isUserExist > 0) {
      return res.status(404).json({ message: "Email already registered" });
    }
    const password = "112233";
    const hash = await hashPassword(password);
    const data = {
      ...req.body,
      password: hash,
    };
    await Teams.createTeam(data, userId);

    return res.status(201).json({
      message: "Team created successfully",
    });
  } catch (error) {
    return res.status(err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function updateTeam(req, res) {
  try {
    const { id: userId } = req.user;
    const { id: teamId } = req.params;
    const data = req.body;

    const isUserExists = await Teams.getTeamById(teamId);
    if (isUserExists === undefined) {
      return res.status(404).json({ message: "User not found" });
    }

    await Teams.updateTeam(isUserExists.id, data, userId);
    return res.status(200).json({
      message: "Team updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: error.message,
      error: err.errorUpdate.message,
    });
  }
}

async function deleteTeam(req, res) {
  try {
    const { id: userId } = req.user;
    const { id: teamId } = req.params;

    const isUserExists = await Teams.getTeamById(teamId);
    if (isUserExists === undefined) {
      return res.status(404).json({ message: "User not found" });
    }

    if (isUserExists.id === userId) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    await Teams.deleteTeam(isUserExists.id, userId);
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: error.message,
      error: err.errorDelete.message,
    });
  }
}

async function getAllTeams(req, res) {
  try {
    const teams = await Teams.getAllTeams();
    if (teams.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }
    return res.status(200).json({
      data: teams,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

async function getTeamDetail(req, res) {
  try {
    const { id: teamId } = req.params;

    const isUserExists = await Teams.getTeamDetails(teamId);
    if (isUserExists.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      data: isUserExists,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

module.exports = {
  createTeam,
  updateTeam,
  deleteTeam,
  getAllTeams,
  getTeamDetail,
};
