const { createRole } = require("../service/rolesService");
const { errors } = require("../utils/customError");

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
    return res.status(errors.internalServerError.statusCode).json({
      message: errors.internalServerError.message,
    });
  }
}

module.exports = {
  createRoleHandler,
};
