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
async function deleteRole(roleId){
    try {
        const hapus = await Roles.deleteRole(roleId);
        return hapus;
    }catch (error){
     throw new CustomError ('Failed to delete role', 400);
    }
}



module.exports = {
    createRole,
    getRoleById,
    getAllRoles,
    deleteRole,
}