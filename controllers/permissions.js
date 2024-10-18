const {
  updatePermission,
} = require("../validate/permissions");
const { err } = require("../utils/customError");

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
  updatePermissionHandler
};
