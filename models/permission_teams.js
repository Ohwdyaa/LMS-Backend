const { formatBulkQuery1, dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");

const permissionTeams = {
  getPermissionTeamByRole: async (roleId) => {
    try {
      const result = await dbLms(
        `SELECT 
          tp.can_create AS canCreate, 
          tp.can_read AS canRead, 
          tp.can_edit AS canEdit, 
          tp.can_delete AS canDelete, 
          m.id AS moduleId,
          m.name AS moduleName,
          cm.name AS categoryName
        FROM learning_management_system.team_permissions tp
        LEFT JOIN module_pages.module m ON tp.module_id = m.id
        LEFT JOIN module_pages.category_module cm ON m.category_module_id = cm.id
        WHERE role_id = ?`,
        [roleId]
      );
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getPermissionTeamByRoleJwt: async (roleId) => {
    try {
      const result = await dbLms(
        `SELECT 
          tp.can_create AS canCreate, 
          tp.can_read AS canRead, 
          tp.can_edit AS canEdit, 
          tp.can_delete AS canDelete,  
          m.uuid AS moduleId,
          m.name AS moduleName,
          cm.name AS categoryName
        FROM learning_management_system.team_permissions tp
        LEFT JOIN module_pages.module m ON tp.module_id = m.id
        LEFT JOIN module_pages.category_module cm ON m.category_module_id = cm.id
        WHERE role_id = ?`,
        [roleId]
      );
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getPermissionTeamByRoleAndModule: async (roleId, moduleId) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          can_create AS canCreate, 
          can_read AS canRead, 
          can_edit AS canEdit, 
          can_delete AS canDelete
        FROM learning_management_system.team_permissions 
        WHERE role_id = ? AND module_id = ?`,
        [roleId, moduleId]
      );
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  updatePermissionTeam: async (roleId, moduleId, data, userId) => {
    try {
      const result = await dbLms(
        `UPDATE team_permissions SET 
          can_create = ?,
          can_read = ?, 
          can_edit = ?, 
          can_delete = ?,
          updated_by = ?
        WHERE role_id = ? AND module_id = ?`,
        [
          data.canCreate,
          data.canRead,
          data.canEdit,
          data.canDelete,
          userId,
          roleId,
          moduleId,
        ]
      );
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },

  createBulkPermissionTeam: async (query, array) => {
    const formatQuery = formatBulkQuery1(query, array);
    await dbLms(formatQuery);
  },
  // createPermission: async (userId, childId, perm, parentId) => {
  //   try {
  //     const id = uuid();
  //     const result = await createBulkPermissionTeam(
  //         `INSERT INTO team_permissions (
  //           id, 
  //           can_create, 
  //           can_read, 
  //           can_edit, 
  //           can_delete, 
  //           is_inherit,
  //           created_by,
  //           role_id, 
  //           module_id, 
  //           source_role_id
  //         ) VALUES ?`,
  //         [
  //           id,
  //           perm.canCreate,
  //           perm.canRead,
  //           perm.canEdit,
  //           perm.canDelete,
  //           1,
  //           userId,
  //           childId,
  //           perm.moduleId,
  //           parentId,
  //         ]
  //       );
  //       return result;
  //   } catch (error) {
  //     if (error.code && error.sqlMessage) {
  //       const message = mapMySQLError(error);
  //       throw new Error(message);
  //     }
  //     throw error;
  //   }
  // },
  getDirectParentAndChildren: async (roleId) => {
    try {
      const result = await dbLms(
        `
        SELECT 
          rt.id,
          rt.name,
          CASE 
            WHEN rti1.role_id IS NOT NULL THEN 'child'
            WHEN rti2.parent_role_id IS NOT NULL THEN 'parent'
          END as relationship_type
        FROM role_teams rt
        LEFT JOIN role_team_inheritance rti1 
          ON rt.id = rti1.role_id AND rti1.parent_role_id = ?
        LEFT JOIN role_team_inheritance rti2 
          ON rt.id = rti2.parent_role_id AND rti2.role_id = ?
        WHERE (rti1.role_id IS NOT NULL OR rti2.parent_role_id IS NOT NULL)
          AND rt.is_deleted = 0`,
        [roleId, roleId]
      );
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
};

module.exports = permissionTeams;
