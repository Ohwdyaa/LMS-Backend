const Teams = require("../models/teams");
const { hashPassword } = require("../utils/bcrypt");
const { err } = require("../utils/custom_error");

async function createTeam(req, res) {
  const { id: userId } = req.user;
  const data = req.body;
  try {
    const password = "112233";
    const hash = await hashPassword(password);
    const userData = {
      ...data,
      password: hash,
    };
    await Teams.createTeam(userData, userId);

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(err.errorCreate.statusCode).json({
      message: err.errorCreate.message,
      error: error.message,
    });
  }
}

async function updateTeam(req, res) {
  const { id: userId } = req.user;
  const data = req.body;
  try {
    const isTeamExists = await Teams.getTeamById(userId);
    if (isTeamExists === undefined) {
      return res.status(400).json({ message: "User not found" });
    }

    await Teams.updateTeam(isTeamExists.id, data);
    return res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
      error: error.message,
    });
  }
}

async function deleteTeam(req, res) {
  const { id: teamId } = req.params;
  try {
    const isTeamExists = await Teams.getTeamById(teamId);
    if (isTeamExists === undefined) {
      return res.status(400).json({ message: "User not found" });
    }

    await Teams.deleteTeam(isTeamExists.id);
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: err.errorDelete.message,
      error: error.message,
    });
  }
}

async function getAllTeams(req, res) {
  const { role } = req.query;
  try {
    if (role !== undefined) {
      const isTeamExists = await Teams.getTeamByRole(role);
      if (isTeamExists === undefined) {
        return res.status(400).json({ message: "Users not found" });
      }
      return res.status(200).json({
        data: isTeamExists,
      });
    }
    const teams = await Teams.getAllTeams();
    if (!teams || teams.length === 0) {
      return res.status(400).json({ message: "No users found" });
    }
    const teamList = [];
    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      const teamObj = new Object();
      teamObj.id = team.id;
      teamObj.username = team.username;
      teamObj.email = team.email;
      teamObj.fullname = team.fullname;
      teamObj.roleId = team.role_id;
      teamObj.role = team.role;
      teamList.push(teamObj);
    }
    return res.status(200).json({
      data: teamList,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}

module.exports = {
  createTeam,
  updateTeam,
  deleteTeam,
  getAllTeams,
};
