const roleTeams = require("../models/role_teams");
const Teams = require("../models/teams");
const { err } = require("../utils/custom_error");

async function createRoleTeam(req, res) {
  const { id: userId } = req.user;
  const data = req.body;
  try {
    await roleTeams.createRoleTeam(data, userId);
    return res.status(201).json({
      message: "Role created successfully",
    });
  } catch (error) {
    return res.status(err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function updateRoleTeam(req, res) {
  const { id: userId } = req.user;
  const { id: roleId } = req.params;
  const data = req.body;
  
  try {
    const isRoleExists = await roleTeams.getRoleTeamById(roleId);
    if (isRoleExists === undefined) {
      return res.status(404).json({ message: "Role not found" });
    }

    await roleTeams.updateRoleTeam(roleId, data, userId);
    return res.status(200).json({
      message: "User role updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: error.message,
      error: err.errorUpdate.message,
    });
  }
}

async function getAllRoleTeams(req, res) {
  try {
    const data = await roleTeams.getAllRoleTeams();
    if (data === undefined || data.length === 0) {
      return res.status(404).json({ message: "Roles not found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

async function deleteRoleTeam(req, res) {
  const { id: roleId } = req.params;
  const { id: userId } = req.user;
  try {
    const isRoleExists = await roleTeams.getRoleTeamById(roleId);
    if (isRoleExists === undefined) {
      return res.status(404).json({ message: "Role not found" });
    }
    const isChildExist = await Teams.getTeamsCountByRoleId(isRoleExists.id);

    if (isChildExist > 0) {
      return res.status(400).json({
        message: `This data cannot be deleted because it is associated with ${isChildExist} team data`,
      });
    }
    await roleTeams.softDeleteRoleTeam(isRoleExists.id, userId);

    return res.status(200).json({
      message: "Role deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: error.message,
      error: err.errorDelete.message,
    });
  }
}

module.exports = {
  createRoleTeam,
  getAllRoleTeams,
  deleteRoleTeam,
  updateRoleTeam,
};
