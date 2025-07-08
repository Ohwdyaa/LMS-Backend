const roleTeams = require("../models/role_teams");
const Permissions = require("../controllers/permission_teams");
const Teams = require("../models/teams");
const { err } = require("../utils/custom_error");

async function createRoleTeam(req, res) {
  try {
    const { id: userId } = req.user;
    const data = req.body;

    const result = await roleTeams.createRoleTeam(data, userId);

    return res.status(201).json({
      id: result,
      message: "Role created successfully",
    });
  } catch (error) {
    return res.status(err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function updateRoleTeam(req, res) {
  const { id: userId } = req.user;
  const { id: roleId } = req.params;
  const data = req.body;

  try {
    const isRoleExists = await roleTeams.getRoleTeamById(roleId);
    if (isRoleExists === undefined) {
      return res.status(404).json({ message: "Role not found" });
    }

    await roleTeams.updateRoleTeam(roleId, data, userId);
    return res.status(200).json({
      message: "User role updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: error.message,
      error: err.errorUpdate.message,
    });
  }
}

async function getAllRoleTeams(req, res) {
  try {
    const data = await roleTeams.getAllRoleTeams();
    if (data === undefined || data.length === 0) {
      return res.status(404).json({ message: "Roles not found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

async function deleteRoleTeam(req, res) {
  const { id: roleId } = req.params;
  const { id: userId } = req.user;
  try {
    const isRoleExists = await roleTeams.getRoleTeamById(roleId);
    if (isRoleExists === undefined) {
      return res.status(404).json({ message: "Role not found" });
    }
    const isChildExist = await Teams.getTeamsCountByRoleId(isRoleExists.id);

    if (isChildExist > 0) {
      return res.status(400).json({
        message: `This data cannot be deleted because it is associated with ${isChildExist} team data`,
      });
    }
    await roleTeams.softDeleteRoleTeam(isRoleExists.id, userId);

    return res.status(200).json({
      message: "Role deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: error.message,
      error: err.errorDelete.message,
    });
  }
}
async function setParentRoleTeam(req, res) {
  const { id: userId } = req.user;
  const { roleId, parentId, permissionsInherited } = req.body;

  try {
    const role = await roleTeams.getRoleTeamById(roleId);
    const parentRole = await roleTeams.getRoleTeamById(parentId);

    if (role === undefined || parentRole === undefined) {
      return res.status(404).json({
        message: "One or both roles not found",
      });
    }

    const existingInheritance = await roleTeams.checkExistingInheritance(
      roleId,
      parentId
    );
    if (existingInheritance !== undefined) {
      return res.status(400).json({
        message: "Inheritance relationship already exists",
      });
    }

    // Check for circular inheritance
    const parentRoles = await roleTeams.getParentRoles(parentId);
    for (let i = 0; i < parentRoles.length; i++) {
      if (parentRoles[i].id === roleId) {
        return res.status(400).json({
          message: "Circular inheritance detected",
        });
      }
    }
    await roleTeams.createInheritance(
      roleId,
      parentId,
      userId,
      permissionsInherited ? JSON.stringify(permissionsInherited) : null
    );
    
    return res.status(200).json({
      message: "Role inheritance set successfully",
    });
  } catch (error) {
    return res.status(err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function getEffectivePermissions(req, res) {
  try {
    const { id: roleId } = req.params;
    const role = await roleTeams.getRoleTeamById(roleId);
    if (role === undefined) {
      return res.status(404).json({ message: "Role not found" });
    }
    const permissions = await dfs(role.id);
    return res.status(200).json({ roleId, permissions });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
async function dfs(roleId, visited) {
  visited = visited || new Set();
  if (visited.has(roleId)) return [];
  visited.add(roleId);

  // Ambil permission manual dari node ini
  const manual = await roleTeams.getManualPermissions(roleId);
  // Ambil semua parent (edge)
  const parents = await roleTeams.getParents(roleId);

  let inherited = [];

  for (let i = 0; i < parents.length; i++) {
    const parent = parents[i];
    const parent_role_id = parent.parent_role_id;
    const permissions_inherited = parent.permissions_inherited;

    // DFS ke parent
    const parentPermissions = await dfs(parent_role_id, visited);

    // Selective
    let allowed = [];
    if (permissions_inherited) {
      let selective;
      try {
        selective = JSON.parse(permissions_inherited);
      } catch (e) {
        selective = [];
      }

      for (let j = 0; j < parentPermissions.length; j++) {
        const perm = parentPermissions[j];
        let rule = null;
        for (let k = 0; k < selective.length; k++) {
          if (String(selective[k].module_id) === String(perm.moduleId)) {
            rule = selective[k];
            break;
          }
        }
        if (rule) {
          // Hanya izinkan aksi yang diset di rule
          const allowedPerm = {
            ...perm,
            canCreate: rule.can_create ? perm.canCreate : 0,
            canRead: rule.can_read ? perm.canRead : 0,
            canEdit: rule.can_edit ? perm.canEdit : 0,
            canDelete: rule.can_delete ? perm.canDelete : 0,
          };
          // Minimal 1 yang diizinkan
          if (
            allowedPerm.canCreate ||
            allowedPerm.canRead ||
            allowedPerm.canEdit ||
            allowedPerm.canDelete
          ) {
            allowed.push(allowedPerm);
          }
        }
      }
    } else {
      // Full inherit jika tidak ada selective rule
      for (let j = 0; j < parentPermissions.length; j++) {
        allowed.push(parentPermissions[j]);
      }
    }
    for (let a = 0; a < allowed.length; a++) {
      inherited.push(allowed[a]);
    }
  }

  // Merge manual dan inherited (manual override)
  const allPerm = [];
  const seen = new Set();

  // Manual dulu
  for (let i = 0; i < manual.length; i++) {
    allPerm.push(manual[i]);
    seen.add(String(manual[i].moduleId));
  }

  // Baru inherited yang belum ada
  for (let i = 0; i < inherited.length; i++) {
    if (!seen.has(String(inherited[i].moduleId))) {
      allPerm.push(inherited[i]);
      seen.add(String(inherited[i].moduleId));
    }
  }
  return allPerm;
}

async function getRoleTeamHierarchy(req, res) {
  try {
    const data = await roleTeams.getRoleHierarchy();
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "No role hierarchy found",
      });
    }

    // Build hierarchy tree using native for loop
    const hierarchyMap = {};
    const rootNodes = [];

    // First pass: create all nodes
    for (let i = 0; i < data.length; i++) {
      const role = data[i];
      hierarchyMap[role.id] = {
        id: role.id,
        name: role.name,
        children: [],
      };
    }

    // Second pass: build tree structure
    for (let i = 0; i < data.length; i++) {
      const role = data[i];
      if (role.parent_id === null) {
        rootNodes.push(hierarchyMap[role.id]);
      } else {
        hierarchyMap[role.parent_id].children.push(hierarchyMap[role.id]);
      }
    }

    return res.status(200).json(rootNodes);
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}
async function getParentRolesTeam(req, res) {
  const { id: roleId } = req.params;

  try {
    const role = await roleTeams.getRoleTeamById(roleId);
    if (!role) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    const parents = await roleTeams.getParentRoles(roleId);
    return res.status(200).json(parents);
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

async function getChildRolesTeam(req, res) {
  const { id: roleId } = req.params;

  try {
    const role = await roleTeams.getRoleTeamById(roleId);
    if (!role) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    const children = await roleTeams.getChildRoles(roleId);
    return res.status(200).json(children);
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}
async function analyzeRoleHierarchy(req, res) {
  const { id: roleId } = req.params;
  const analysis = {
    circular_dependencies: [],
    max_depth: 0,
    invalid_inheritance: [],
    permissions_conflicts: [],
  };

  try {
    // 1. Get initial data using CTE (fast database query)
    const initialData = await roleTeams.getInitialHierarchyData(roleId);
    if (!initialData || initialData.length === 0) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    // 2. DFS implementation untuk analisis mendalam
    const visited = new Set();
    const path = [];

    const dfs = async (currentId, depth = 0) => {
      // Update max depth
      analysis.max_depth = Math.max(analysis.max_depth, depth);

      // Circular dependency check
      if (path.includes(currentId)) {
        analysis.circular_dependencies.push([...path, currentId]);
        return;
      }

      if (visited.has(currentId)) return;

      visited.add(currentId);
      path.push(currentId);

      // Get current role details
      const [currentRole] = await roleTeams.getRoleTeamById(currentId);

      // Get and check each child
      const children = await roleTeams.getChildRoles(currentId);

      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        // Validate inheritance rules
        if (!isValidInheritance(currentRole, child)) {
          analysis.invalid_inheritance.push({
            parent: currentRole,
            child: child,
          });
        }

        // Check permission conflicts
        const conflicts = await checkPermissionConflicts(
          currentRole.id,
          child.id
        );
        if (conflicts.length > 0) {
          analysis.permissions_conflicts.push({
            parent: currentRole,
            child: child,
            conflicts: conflicts,
          });
        }

        // Continue DFS
        await dfs(child.id, depth + 1);
      }

      path.pop();
    };

    // Mulai DFS dari role yang diminta
    await dfs(roleId);

    // Format response
    return res.status(200).json({
      role_id: roleId,
      analysis: analysis,
      hierarchy: formatHierarchy(initialData),
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

// Helper functions
function isValidInheritance(parent, child) {
  const invalidCombinations = [
    ["ADMIN", "STAFF"],
    ["MANAGER", "INTERN"],
  ];

  return !invalidCombinations.some(
    ([p, c]) => parent.name.includes(p) && child.name.includes(c)
  );
}

async function checkPermissionConflicts(parentId, childId) {
  const conflicts = [];

  const [parentPerms, childPerms] = await Promise.all([
    roleTeams.getRolePermissions(parentId),
    roleTeams.getRolePermissions(childId),
  ]);

  for (let i = 0; i < childPerms.length; i++) {
    const childPerm = childPerms[i];
    const parentPerm = parentPerms.find(
      (p) => p.module_id === childPerm.module_id
    );

    if (
      parentPerm &&
      parentPerm.permission_level < childPerm.permission_level
    ) {
      conflicts.push({
        module_id: childPerm.module_id,
        parent_level: parentPerm.permission_level,
        child_level: childPerm.permission_level,
      });
    }
  }

  return conflicts;
}

function formatHierarchy(data) {
  const hierarchy = {};

  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    if (!hierarchy[node.level]) {
      hierarchy[node.level] = [];
    }
    hierarchy[node.level].push({
      id: node.id,
      name: node.name,
      created_at: node.created_at,
      created_by: node.created_by,
    });
  }

  return hierarchy;
}

module.exports = {
  createRoleTeam,
  getAllRoleTeams,
  deleteRoleTeam,
  updateRoleTeam,
  setParentRoleTeam,
  getEffectivePermissions,

  getRoleTeamHierarchy,
  getParentRolesTeam,
  getChildRolesTeam,
  analyzeRoleHierarchy,
};
