const {
  updatePermission,
  getAllPermission,
  getPermissionByRole,
} = require("../validate/permissions");
const { err } = require("../utils/customError");

async function getAllPermissionHandler(req, res) {
  try {
    const result = await getAllPermission();
    console.log("controller", result)
    return res.status(200).json({
      result,
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorUpdate.statusCode).json({
      message: error.message || err.errorUpdate.message,
      details: error.details || null,
    });
  }
}
async function getPermissionByRoleHandler(req, res) {
  try {
    const roleId = req.params.id;
    const result = await getPermissionByRole(roleId);
    return res.status(200).json({
      result,
    });
  } catch (error) {
    return res.status(error.statusCode || err.errorUpdate.statusCode).json({
      message: error.message || err.errorUpdate.message,
      details: error.details || null,
    });
  }
}
async function updatePermissionHandler(req, res) {
  try {
    const roleId = req.body.roleId;
    const permissions = req.body.permissions;
    const result = await updatePermission(roleId, permissions);
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
  getAllPermissionHandler,
  getPermissionByRoleHandler,
  updatePermissionHandler
};
