const Teams = require("../models/teams");
const { hashPassword } = require("../utils/bcrypt");
const { err } = require("../utils/custom_error");

async function createTeam(req, res) {
  try {
//  const { id: userId } = req.user;
    const { email } = req.body;
    const password = "112233";
    const isUserExist = await Teams.getTeamByEmail(email);
    if (isUserExist > 0) {
      return res.status(404).json({ message: "Email already registered" });
    }

    const hash = await hashPassword(password);
    const userData = {
      ...req.body,
      password: hash,
    };
    await Teams.createTeam(userData);

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function updateTeam(req, res) {
  const { id: userId } = req.user;
  const { id: teamId } = req.params;
  const teamData = req.body;
  try {
    const isTeamExists = await Teams.getTeamById(teamId);
    if (isTeamExists === undefined) {
      return res.status(404).json({ message: "User not found" });
    }

    const isEmailDuplicate = await Teams.getTeamByEmail(
      teamData.email,
      teamId
    );

    if (isEmailDuplicate) {
      let message;

      if (isEmailDuplicate.email.toLowerCase() === teamData.email.toLowerCase()) {
        message = "Email already registered";
      } 
      return res.status(400).json({
        message,
      });
    }

    await Teams.updateTeam(isTeamExists.id, teamData, userId);
    return res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: error.message,
      error: err.errorUpdate.message,
    });
  }
}

async function deleteTeam(req, res) {
  const { id: teamId } = req.params;
  const { id: userId } = req.user;
  try {
    const isTeamExists = await Teams.getTeamById(teamId);
    if (isTeamExists === undefined) {
      return res.status(404).json({ message: "User not found" });
    }

    if (isTeamExists.id === userId) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    if (isTeamExists.id === "4577863f-ea2c-4a1f-9932-89e154118f20") {
      return res
        .status(400)
        .json({ message: "Cannot delete super admin account" });
    }

    await Teams.deleteTeam(isTeamExists.id, userId);
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
    if (!teams || teams.length === 0) {
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

async function getTeamById(req, res) {
  const { id } = req.params;
  try {
    const teams = await Teams.getTeamDetails(id);
    if (!teams || teams.length === 0) {
      return res.status(404).json({ message: "User not found" });
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

module.exports = {
  createTeam,
  updateTeam,
  deleteTeam,
  getAllTeams,
  getTeamById,
};
