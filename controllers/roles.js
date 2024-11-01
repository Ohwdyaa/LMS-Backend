const Roles = require("../models/roles");
const Users = require("../models/users");
const { err } = require("../utils/custom_error");

async function createRoles(req, res) {
  const data = req.body;
  const createdByEmail= req.user.email;
  try {
    const result = await Roles.createRole(data, createdByEmail);
    return res.status(201).json({
      message: "Role created successfully",        
      roleId: result.roleIdId,    
      createdById : result.createdById,     
      createdByUsername: result.createdByUsername,

    });
  } catch (error) {
    return res.status(err.errorCreate.statusCode).json({
      message: err.errorCreate.message,
      error: error.message,
    });
  }
}

async function changeUserRoles(req, res) {
  const { id: userId } = req.params;
  const { roleId: newRoleId } = req.body;
  try {
    const isUserExists = await Users.getUserById(userId);
    if (isUserExists === undefined) {
      return res.status(400).json({ message: "User not found" });
    }
    await Roles.changeUserRole(isUserExists.id, newRoleId);
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

async function getAllRoles(req, res) {
  try {
    const data = await Roles.getAllRole();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}
async function deleteRoles(req, res) {
  const { id: roleId } = req.params;
  try {
    const isRoleExists = await Roles.getRoleById(roleId);
    if (isRoleExists === undefined) {
      return res.status(400).json({ message: "Role not found" });
    }

    await Roles.deleteRole(isRoleExists.id);
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
  createRoles,
  getAllRoles,
  deleteRoles,
  changeUserRoles
};
