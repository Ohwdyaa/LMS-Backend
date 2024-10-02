const Roles = require("../models/roles");
const { CustomError, errors } = require("../utils/customError");

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
async function getRoleById(roleId) {
    try {
        const role = await Roles.getRoleById(roleId);
        if (!role) {
            throw new CustomError('Role not found', 404);
        }
        return role;
    } catch (error) {
        throw new CustomError('Failed to get role', 400);
    }
}
async function getAllRoles() {
    try {
        const roles = await Roles.getAllRoles();
        return roles;
    } catch (error) {
        throw new CustomError('Failed to get all roles', 400);
    }
}



module.exports = {
    createRole,
    getRoleById,
    getAllRoles
}