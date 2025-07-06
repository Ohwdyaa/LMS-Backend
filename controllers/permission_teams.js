const Permissions = require("../models/permission_teams");
const roleTeams = require("../models/role_teams");
const Module = require("../models/module_permissions");
const { err } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

async function updatePermissionTeam(req, res) {
  // const { id: userId } = req.user;
  const { id: roleId } = req.params;
  const { listModules } = req.body;
  let newValue = [];
  try {
    const isRoleExists = await roleTeams.getRoleTeamById(roleId);
    if (isRoleExists === undefined) {
      return res.status(404).json({ message: "Role not found" });
    }
    const moduleLength = listModules.length;
    for (let i = 0; i < moduleLength; i++) {
      const { moduleId, canRead, canCreate, canEdit, canDelete } =
        listModules[i];
      const isExists = await Permissions.getPermissionTeamByRoleAndModule(
        roleId,
        moduleId
      );
      if (isExists !== undefined) {
        const updateData = {
          canRead,
          canCreate,
          canEdit,
          canDelete,
        };
        await Permissions.updatePermissionTeam(roleId, moduleId, updateData);
      }
      if (isExists === undefined) {
        newValue.push([
          uuid(),
          canCreate,
          canRead,
          canEdit,
          canDelete,
          roleId,
          moduleId,
        ]);
      }
    }
    if (newValue.length > 0) {
      await Permissions.createBulkPermissionTeam(
        `INSERT INTO team_permissions ( 
          id, can_create, can_read, can_edit, can_delete, role_id,  module_id
        ) VALUES ?`,
        [newValue]
      );
    }
    return res.status(200).json({
      message: "Permissions updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: error.message,
      error: err.errorUpdate.message,
    });
  }
}

async function getPermissionTeamByRole(req, res) {
  const { id: roleId } = req.params;
  try {
    const permission = await Permissions.getPermissionTeamByRole(roleId);
    if (permission.length === 0) {
      const permissionList = [];
      const modules = await Module.getAllModule();

      for (let i = 0; i < modules.length; i++) {
        const element = modules[i];

        permissionList.push({
          canCreate: 0,
          canRead: 0,
          canEdit: 0,
          canDelete: 0,
          moduleId: element.id,
          moduleName: element.name,
          categoryName: element.categoryModule,
        });
      }

      return res.status(200).json({
        permission: permissionList,
      });
    }
    return res.status(200).json({
      permission,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

async function getPermissionTeams(user) {
  try {
    const isRolePermissionsExist = await Permissions.getPermissionTeamByRoleJwt(
      user.role_id
    );
    if (isRolePermissionsExist === undefined) {
      return res
        .status(404)
        .json({ message: "Permissions not found for this role" });
    }
    return isRolePermissionsExist;
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}
async function inheritAllPermissions(childId, parentId, userId) {
  const inheritanceEdge = await roleTeams.getInheritanceEdge(childId, parentId); 
  
  let selective = null;
  if (inheritanceEdge && inheritanceEdge.permissions_inherited) {
    try {
      selective = JSON.parse(inheritanceEdge.permissions_inherited);
    } catch (e) {
      selective = null;
    }
  }

  // 2. Ambil semua permission parent
  const parentPermissions = await Permissions.getPermissionTeamByRole(parentId);

  // 3. Loop permission parent
  for (const perm of parentPermissions) {
    let inheritance = false;

    if (selective === null || selective === undefined) {
      inheritance = true;
    } else {
      const rule = selective.find(r => r.module_id === perm.moduleId);
      if (rule) {
        if (
          (rule.can_create && perm.canCreate) ||
          (rule.can_read && perm.canRead) ||
          (rule.can_edit && perm.canEdit) ||
          (rule.can_delete && perm.canDelete)
        ) {
          inheritance = true;
        }
      }
    }

    if (inheritance === false) {
      const childPerm = await Permissions.getPermissionTeamByRoleAndModule(childId, perm.moduleId);
      if (childPerm === undefined) {
        await Permissions.createPermissionInherit(userId, childId, perm, parentId);
      }
    }
    // (Opsional: kalau mau update permission warisan yang sudah ada, lakukan di sini)
  }
}
async function getEffectivePermissions(req, res) {
  const { id: roleId } = req.params;

  try {
    const role = await roleTeams.getRoleTeamById(roleId);
    if (!role) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    const effectivePermissions = await Permissions.getEffectivePermissions(
      roleId
    );

    // Group by category using for loop
    const categorized = {};
    for (let i = 0; i < effectivePermissions.length; i++) {
      const perm = effectivePermissions[i];
      if (!categorized[perm.categoryName]) {
        categorized[perm.categoryName] = [];
      }
      categorized[perm.categoryName].push(perm);
    }

    return res.status(200).json({
      role: role,
      permissions: categorized,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}
async function setPermissionInheritance(req, res) {
  const { id: roleId, moduleId } = req.params;
  const { inheritFlag } = req.body;
  const { id: userId } = req.user;

  try {
    // Validate role and module
    const [role, module] = await Promise.all([
      roleTeams.getRoleTeamById(roleId),
      Module.getModuleById(moduleId)
    ]);

    if (!role || !module) {
      return res.status(404).json({
        message: "Role or module not found"
      });
    }

    // Check if permission exists
    const permission = await Permissions.getPermissionTeamByRoleAndModule(roleId, moduleId);
    if (!permission) {
      return res.status(404).json({
        message: "Permission not found for this role and module"
      });
    }

    await Permissions.setPermissionInheritance(roleId, moduleId, inheritFlag, userId);

    return res.status(200).json({
      message: "Permission inheritance updated successfully"
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: error.message,
      error: err.errorUpdate.message,
    });
  }
}
// async function updatePermissionTeam(req, res) {
//   const { id: userId } = req.user;
//   const { id: roleId } = req.params;
//   const { listModules } = req.body;
//   let newValue = [];

//   try {
//     const role = await roleTeams.getRoleTeamById(roleId);
//     if (!role) {
//       return res.status(404).json({ message: "Role not found" });
//     }

//     // Get parent roles to check permission conflicts
//     const parentRoles = await roleTeams.getParentRoles(roleId);
    
//     for (let i = 0; i < listModules.length; i++) {
//       const module = listModules[i];
      
//       // Check permission conflicts with parent roles
//       for (let j = 0; j < parentRoles.length; j++) {
//         const conflicts = await Permissions.checkPermissionConflicts(
//           roleId, 
//           parentRoles[j].id
//         );
        
//         if (conflicts) {
//           return res.status(400).json({
//             message: "Permission conflict detected with parent role",
//             conflicts: conflicts
//           });
//         }
//       }

//       // Update or create permission
//       const existing = await Permissions.getPermissionTeamByRoleAndModule(
//         roleId,
//         module.moduleId
//       );

//       if (existing) {
//         await Permissions.updatePermissionTeam(
//           roleId,
//           module.moduleId,
//           module,
//           userId
//         );
//       } else {
//         newValue.push([
//           uuid(),
//           module.canCreate,
//           module.canRead,
//           module.canEdit,
//           module.canDelete,
//           roleId,
//           module.moduleId,
//           userId
//         ]);
//       }
//     }

//     // Bulk create new permissions
//     if (newValue.length > 0) {
//       await Permissions.createBulkPermissionTeam(
//         `INSERT INTO team_permissions (
//           id, can_create, can_read, can_edit, can_delete, 
//           role_id, module_id, created_by
//         ) VALUES ?`,
//         [newValue]
//       );
//     }

//     return res.status(200).json({
//       message: "Permissions updated successfully",
//     });
//   } catch (error) {
//     return res.status(err.errorUpdate.statusCode).json({
//       message: error.message,
//       error: err.errorUpdate.message,
//     });
//   }
// }

module.exports = {
  updatePermissionTeam,
  getPermissionTeamByRole,
  getPermissionTeams,
  getEffectivePermissions,
  setPermissionInheritance,
  inheritAllPermissions,
  // updatePermissionTeam, 
};
