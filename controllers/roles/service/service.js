const role = require('../models/roles.js');

async function getRoleById(id) {
    try {
        const role = await Role.getRoleById(id);
        return role;
    } catch (error) {
        throw new Error('Error fetching role by ID');
    }
}

async function getAllRoles() {
    try {
        const roles = await Role.getAllRoles();
        return roles;
    } catch (error) {
        throw new Error('Error fetching all roles');
    }
}

async function addRole(name) {
    try {
        const roleId = await role.createRole(name);
        return roleId;
    } catch (error) {
        throw new Error('Error adding new role');
    }
}

module.exports = {
    getRoleById,
    getAllRoles,
    addRole
};