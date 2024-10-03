const { createRole, getRoleById, getAllRoles, deleteRole} = require("../service/roles");
const { err } = require("../utils/customError");

async function createRoleHandler(req, res) {
  try {
    const roleData = req.body;

    const roleId = await createRole(roleData);
    return res.status(201).json({
      message: "Role created successfully",
      data: { roleId },
    });
  } catch (error) {
    console.error("Error in createRoleHandler:", error);
    return res.status(err.internalServerError.statusCode).json({
      message: err.internalServerError.message,
    });
  }
}
async function getRoleByIdHandler(req, res) {
  const { id } = req.params;
  try {
      const role = await getRoleById(id);
      return res.status(200).json(role);
  } catch (error) {
      return res.status(404).json({ message: error.message });
  }
}
async function getAllRolesHandler(req, res) {
  try {
      const roles = await getAllRoles();
      return res.status(200).json(roles);
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
}

async function deleteRoleHandler(req, res) {
  const roleId = req.params.id;
  try {
    await deleteRole(roleId);
    return res.status(200).json({
      message: "Role deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({ message:error.message });
  }
}

module.exports = {
  createRoleHandler,
  getRoleByIdHandler,
  getAllRolesHandler,
  deleteRoleHandler
};
