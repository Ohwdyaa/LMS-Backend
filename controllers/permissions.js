const { createRolePermission } = require("../validate/permissions");
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
module.exports = {
  rolePermissionHandler,
};
