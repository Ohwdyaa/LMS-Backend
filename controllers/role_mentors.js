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
      message: err.errorCreate.message,
      error: error.message,
    });
  }
}
async function changeMentorRole(req, res) {
  const { id: userId } = req.user;
  const { id: mentorId } = req.params;
  const { roleId: newRoleId } = req.body;
  try {
    //pengecekan apakah user team exist
    await roleMentor.changeMentorRole(userId, mentorId, newRoleId);
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
async function getAllRoleMentors(req, res) {
  try {
    const data = await roleMentor.getAllRoleMentors(); // obj blum ad
    return res.status(200).json(data);
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}
async function deleteRoleMentor(req, res) {
  const { id: roleId } = req.params;
  try {
    const isRoleExists = await roleMentor.getRoleMentorById(roleId);
    if (isRoleExists === undefined) {
      return res.status(400).json({ message: "Role not found" });
    }

    await roleMentor.deleteRoleMentor(isRoleExists.id);
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
  createRoleMentor,
  getAllRoleMentors,
  deleteRoleMentor,
  changeMentorRole,
};
