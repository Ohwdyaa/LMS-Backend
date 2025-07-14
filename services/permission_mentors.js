const Roles = require("../models/role_mentors");
const Permissions = require("../models/permission_mentors");
const Module = require("../models/module_permissions");

/**
 * Menghitung semua izin efektif untuk sebuah peran dengan menelusuri hierarki ke atas (DFS).
 * Logika utamanya:
 * 1. Izin dari peran yang lebih rendah (child) akan menimpa (override) izin dari peran yang lebih tinggi (parent).
 * 2. Izin dari parent hanya akan diwariskan jika memiliki inherit_flag = 1.
 * @param {string} startRoleId - ID dari peran awal yang akan dihitung.
 * @returns {Promise<Array>} - Array dari objek izin yang efektif.
 */
async function getEffectivePermissionsForRole(startRoleId) {

  const effectivePermissions = new Map();
  let currentRoleId = startRoleId;

  while (currentRoleId) {

    const currentPermissions = await Permissions.getPermissionMentorByRoleJwt(
      currentRoleId
    );
    const isStartingRole = currentRoleId === startRoleId;
    for (const perm of currentPermissions) {
      if (!effectivePermissions.has(perm.moduleId)) {
        if (isStartingRole || perm.inheritFlag === 1) {
          effectivePermissions.set(perm.moduleId, perm);
        }
      }
    }
 
    const currentRole = await Roles.getRoleMentorById(currentRoleId);

    currentRoleId = currentRole ? currentRole.parent_id : null;
  }

  let effectivePermissionsArray = Array.from(effectivePermissions.values());

  if (effectivePermissionsArray.length === 0) {
    const allModules = await Module.getAllModule();
    for (let i = 0; i < allModules.length; i++) {
      const element = allModules[i];
      effectivePermissionsArray.push({
        canCreate: 0,
        canRead: 0,
        canEdit: 0,
        canDelete: 0,
        inheritFlag: 0,
        moduleId: element.id,
        moduleName: element.name,
        categoryName: element.categoryModule,
      });
    }
  }
  return effectivePermissionsArray;
}

module.exports = {
  getEffectivePermissionsForRole,
};
