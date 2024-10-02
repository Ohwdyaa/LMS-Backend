const Roles = require("../models/roles");
const { CustomError, err } = require("../utils/customError");

async function createRole(roleData) {
    try {
        const roleId = await Roles.createRole(roleData);
        return roleId;
    } catch (error) {
        throw new CustomError(
            err.failedRoles.message,
            err.failedRoles.statusCode
        );
    }
}

module.exports = {
    createRole,
}