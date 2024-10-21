const Roles = require("../models/roles");
const { CustomError } = require("../utils/customError");

async function createRole(req, res) {
  const roleData = req.body;
  try {
    const roleId = await Roles.createRole(roleData);
    return res.status(201).json({
      message: "Role created successfully",
      data: { roleId },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "An error occurred while creating role.",
      details: error.details || null,
    });
  }
}
async function getRoleById(req, res) {
  const { id } = req.params;
  try {
    const role = await Roles.getRoleById(id);
    if (role === undefined) {
      throw new CustomError("Role not found");
    }
    return res.status(200).json(role);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
async function getAllRoles(req, res) {
  try {
    const roles = await Roles.getAllRoles();
    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
async function deleteRole(req, res) {
  const roleId = req.params.id;
  try {
    const deleteRoles = await Roles.deleteRole(roleId);
    return res.status(200).json({
      message: "Role deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  createRole,
  getRoleById,
  getAllRoles,
  deleteRole,
};
