const { createRole } = require("../service/rolesService");
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

module.exports = {
  createRoleHandler,
};
