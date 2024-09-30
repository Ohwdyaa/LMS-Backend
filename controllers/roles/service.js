const Roles = require("../../models/roles");
const { CustomError, errors } = require("../../utils/customError");

async function createRole(roleData) {
    try {
        const roleId = await Roles.createRole(roleData);
        return roleId;
    } catch (error) {
        throw new CustomError(
            errors.failedRoles.message,
            errors.failedRoles.statusCode
        );
    }
}

module.exports = {
    createRole,
}