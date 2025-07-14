const roleModels = require("../models/role_teams");
const roleServices = require("../services/buildTree");
const teamModels = require("../models/teams");

async function createRoleTeam(req, res) {
  try {
    const { id: userId } = req.user;
    const data = req.body;

    await roleModels.createRoleTeam(data, userId);
    return res.status(201).json({
      message: "Role created successfully",
    });
  } catch (error) {
    console.error("Error creating role:", error);
    return res.status(500).json({
      message: "An error occurred while creating a new role.",
    });
  }
}
async function updateRoleTeam(req, res) {
  try {
    const { id: userId } = req.user;
    const { id: roleId } = req.params;
    const data = req.body;

    const isRoleExists = await roleModels.getRoleTeamById(roleId);
    if (isRoleExists === undefined) {
      return res.status(404).json({ message: "Role not found" });
    }

    await roleModels.updateRoleTeam(isRoleExists.id, data, userId);
    return res.status(200).json({
      message: "User role updated successfully",
    });
  } catch (error) {
    console.error("Error updating role:", error);
    return res.status(500).json({
      message: "An error occurred while editing the role.",
    });
  }
}
async function getAllRoleTeams(req, res) {
  try {
    const data = await roleModels.getAllRoleTeams();
    if (data === undefined || data.length === 0) {
      return res.status(404).json({ message: "Roles not found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error getting role:", error);
    return res.status(500).json({
      message: "An error occurred while retrieving role data.",
    });
  }
}
async function deleteRoleTeam(req, res) {
  const { id: roleId } = req.params;
  const { id: userId } = req.user;
  try {
    const isRoleExists = await roleModels.getRoleTeamById(roleId);
    if (isRoleExists === undefined) {
      return res.status(404).json({ message: "Role not found" });
    }
    const isChildExist = await teamModels.getTeamsCountByRoleId(isRoleExists.id);

    if (isChildExist > 0) {
      return res.status(400).json({
        message: `This data cannot be deleted because it is associated with ${isChildExist} team data`,
      });
    }
    await roleModels.softDeleteRoleTeam(isRoleExists.id, userId);
    return res.status(200).json({
      message: "Role deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting role:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the role.",
    });
  }
}
async function getRoleTeamHierarchy(req, res, next) {
  try {
    const allRoles = await roleModels.getAllRolesForHierarchy();

    if (allRoles.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const hierarchy = roleServices.buildTree(allRoles);

    return res.status(200).json({
      success: true,
      data: hierarchy,
    });
  } catch (error) {
    console.error("Error getting role:", error);
    return res.status(500).json({
      message: "An error occurred while retrieving role structure data.",
    });
  }
}
module.exports = {
  createRoleTeam,
  getAllRoleTeams,
  deleteRoleTeam,
  updateRoleTeam,
  getRoleTeamHierarchy,
};
