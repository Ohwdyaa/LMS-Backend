const roleTeams = require("../models/role_teams");
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
      message: err.errorCreate.message,
      error: error.message,
    });
  }
}
async function changeTeamRole(req, res) {
  const { id: userId } = req.user;
  const { id: teamId } = req.params;
  const { roleId: newRoleId } = req.body;
  try {
    //pengecekan apakah user team exist
    await roleTeams.changeTeamRole(userId, teamId, newRoleId);
    return res.status(200).json({
      message: "User role updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
      error: error.message,
    });
  }
}
async function getAllRoleTeams(req, res) {
  try {
    const data = await roleTeams.getAllRoleTeams(); // obj blum ad
    return res.status(200).json(data);
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}
async function deleteRoleTeam(req, res) {
  const { id: roleId } = req.params;
  try {
    const isRoleExists = await roleTeams.getRoleTeamById(roleId);
    if (isRoleExists === undefined) {
      return res.status(400).json({ message: "Role not found" });
    }

    await roleTeams.deleteRoleTeam(isRoleExists.id);
    return res.status(200).json({
      message: "Role deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: err.errorDelete.message,
      error: error.message,
    });
  }
}
module.exports = {
  createRoleTeam,
  getAllRoleTeams,
  deleteRoleTeam,
  changeTeamRole,
};
