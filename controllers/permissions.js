const {
  createRolePermission,
  updatePermission,
} = require("../validate/permissions");
const { err } = require("../utils/customError");

async function rolePermissionHandler(req, res) {
  try {
    const dataPermissions = req.body;
    const rolePermission = await createRolePermission(dataPermissions);
    return res.status(201).json({
      message: "Role created successfully",
      data: { rolePermission },
    });
  } catch (error) {
    return res.status(err.internalServerError.statusCode).json({
      message: err.internalServerError.message,
    });
  }
}
async function updatePermissionHandler(req, res) {
  try {
    const { id: permissionId } = req.params;
    const permissionUpdate = req.body;
    const result = await updatePermission(permissionId, permissionUpdate);
    return res.status(200).json({
      message: "Permission updated successfully",
      result,
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorUpdate.statusCode).json({
      message: error.message || err.errorUpdate.message,
      details: error.details || null,
    });
  }
}
module.exports = {
  rolePermissionHandler,
  updatePermissionHandler,
};
