const Roles = require("../models/roles");
const { err } = require("../utils/customError");

async function createRoles(req, res) {
  const data = req.body;
  try {
    await Roles.createRole(data);
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
async function getRoleById(req, res) {
  const { id: roleId } = req.params;
  try {
    const role = await Roles.getRoleById(roleId);
    if (role === undefined) {
      throw new Error("Role not found");
    }
    return res.status(200).json(role);
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}
async function getAllRoles(req, res) {
  try {
    const roles = await Roles.getAllRole();
    const roleList = [];
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i];
      const roleObj = new Object();
      roleObj.id = role.id;
      roleObj.name = role.name;
      roleList.push(roleObj);
    }
    return res.status(200).json(roleList);
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}
async function updateRoles(req, res) {
  const { id: roleId } = req.params;
  const newValue = req.body;
  try {
    const roleData = await Roles.getRoleById(roleId);
    if (roleData === undefined) {
      throw new Error("Role not found");
    }
    await Roles.updateRole(roleId, newValue);
    return res.status(200).json({
      message: "Role updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
      error: error.message,
    });
  }
}
async function deleteRoles(req, res) {
  const { id: roleId } = req.params;
  try {
    await Roles.deleteRole(roleId);
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
  getRoleById,
  getAllRoles,
  updateRoles,
  deleteRoles,
};
