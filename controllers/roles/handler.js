const { createRole } = require("./service");
const { errors } = require("../../utils/customError");

async function createRoleHandler(req, res) {
  try {
    const roleData = req.body;

    const roleId = await createRole(roleData);
    return res.status(201).json({
      status: "success",
      message: "Role created successfully",
      data: { roleId },
    });
  } catch (error) {
    console.error("Error in createRoleHandler:", error);
    return res.status(errors.internalServerError.statusCode).json({
      status: "error",
      message: errors.internalServerError.message,
    });
  }
}

module.exports = {
  createRoleHandler,
};
