const Roles = require("../models/roles");
const Users = require("../models/users");
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

async function changeUserRoles(req, res) {
  const { id: userId } = req.params;
  const { roleId: newRoleId } = req.body;
  try {
    const user = await Users.getUserById(userId);
    if (user === undefined) {
      throw new Error("No users found");
    }
    await Users.changeUserRole(userId, newRoleId);
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
  getAllRoles,
  deleteRoles,
  changeUserRoles
};
