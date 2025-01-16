const Mentors = require("../models/mentors");
const roleMentor = require("../models/role_mentors");
const { err } = require("../utils/custom_error");

async function createRoleMentor(req, res) {
  const { id: userId } = req.user;
  const data = req.body;
  try {
    await roleMentor.createRoleMentor(data, userId);
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
    const isRoleExists = await roleMentor.getRoleMentorById(roleId);
    if (isRoleExists === undefined) {
      return res.status(404).json({ message: "Role not found" });
    }

    await roleMentor.updateRoleMentor(roleId, data, userId);
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
    const data = await roleMentor.getAllRoleMentors(); // obj blum ad
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
    const isRoleExists = await roleMentor.getRoleMentorById(roleId);
    if (isRoleExists === undefined) {
      return res.status(404).json({ message: "Role not found" });
    }

    const isChildExist = await Mentors.getMentorsCountByRoleId(roleId);

    if (isChildExist > 0) {
      return res.status(400).json({
        message: `This data cannot be deleted because it is associated with ${isChildExist} mentor data`,
      });
    }

    await roleMentor.softDeleteRoleMentor(isRoleExists.id, userId);
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
  createRoleMentor,
  getAllRoleMentors,
  deleteRoleMentor,
  updateMentorRole,
};
