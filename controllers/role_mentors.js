const mentorModels = require("../models/mentors");
const roleModels = require("../models/role_mentors");
const roleServices = require("../services/buildTree");

async function createRoleMentor(req, res) {
  const { id: userId } = req.user;
  const data = req.body;
  console.error("Creating role mentor with data:", data);
  try {
    await roleModels.createRoleMentor(data, userId);
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

async function updateMentorRole(req, res) {
  const { id: userId } = req.user;
  const { id: roleId } = req.params;
  const data = req.body;

  try {
    const isRoleExists = await roleModels.getRoleMentorById(roleId);
    if (isRoleExists === undefined) {
      return res.status(404).json({ message: "Role not found" });
    }

    await roleModels.updateRoleMentor(isRoleExists.id, data, userId);
    return res.status(200).json({
      message: "Mentor role updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: error.message,
      error: err.errorUpdate.message,
    });
  }
}

async function getAllRoleMentors(req, res) {
  try {
    const data = await roleModels.getAllRoleMentors(); 
    if (data.length === 0) {
      return res.status(404).json({ message: "Mentor Roles not found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

async function deleteRoleMentor(req, res) {
  const { id: roleId } = req.params;
  const { id: userId } = req.user;
  try {
    const isRoleExists = await roleModels.getRoleMentorById(roleId);
    if (isRoleExists === undefined) {
      return res.status(404).json({ message: "Role not found" });
    }

    const isChildExist = await mentorModels.getMentorsCountByRoleId(roleId);

    if (isChildExist > 0) {
      return res.status(400).json({
        message: `This data cannot be deleted because it is associated with ${isChildExist} mentor data`,
      });
    }

    await roleModels.softDeleteRoleMentor(isRoleExists.id, userId);
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
async function getRoleMentorHierarchy(req, res, next) {
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
  createRoleMentor,
  getAllRoleMentors,
  deleteRoleMentor,
  updateMentorRole,
  getRoleMentorHierarchy
};
