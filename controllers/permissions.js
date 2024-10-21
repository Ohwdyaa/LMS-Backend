const {
  updatePermission,
  getAllPermission,
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
async function updatePermissionHandler(req, res) {
  try {
    const permissionUpdate = req.body.permissions;
    console.log("req", permissionUpdate);
    const result = await updatePermission(permissionUpdate);
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
  updatePermissionHandler
};
