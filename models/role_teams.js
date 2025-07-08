const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");
const roleTeams = {
  createRoleTeam: async (data, userId) => {
    try {
      const id = uuid();
      await dbLms(
        `INSERT INTO role_teams 
          (id,
          name,
          created_by) 
        VALUES (?,?,?)`,
        [id, data.name, userId]
      );
      return id;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getRoleTeamById: async (id) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          id, 
          name 
        FROM role_teams 
        WHERE id = ? AND is_deleted = 0`,
        [id]
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
  getAllRoleTeams: async () => {
    try {
      const result = await dbLms(
        `SELECT 
          id, 
          name 
        FROM role_teams 
        WHERE is_deleted = 0`
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
  deleteRoleTeam: async (id) => {
    try {
      const result = await dbLms(`DELETE FROM role_teams where id = ?`, [id]);
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  softDeleteRoleTeam: async (id, userId) => {
    try {
      const result = await dbLms(
        `UPDATE role_teams 
        SET 
          is_deleted = 1, 
          updated_at = NOW(),
          updated_by = ?
        WHERE id = ?`,
        [userId, id]
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
  updateRoleTeam: async (roleId, data, userId) => {
    try {
      const result = await dbLms(
        `UPDATE role_teams 
        SET 
          name = ?, 
          updated_at = NOW(),
          updated_by = ?
        WHERE id = ?`,
        [data.name, userId, roleId]
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
  createInheritance: async (roleId, parentId, userId, permissionsInherited) => {
    try {
      const id = uuid();
      await dbLms(
        `INSERT INTO role_team_inheritance 
          (id, 
          role_id, 
          parent_role_id, 
          created_by, 
          permissions_inherited) 
        VALUES (?, ?, ?, ?, ?)`,
        [id, roleId, parentId, userId, permissionsInherited]
      );
      return id;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getParentEdge: async (roleId) => {
    try {
      const result = await dbLms(
        `SELECT 
          parent_role_id, 
          permissions_inherited
        FROM role_team_inheritance
        WHERE role_id = ? AND is_deleted = 0`,
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
  // // Ambil edge inheritance + selective rule (permissions_inherited)
  // getInheritanceEdgesByChild: async (childRoleId) => {
  //   const result = await dbLms(
  //     `
  //     SELECT * FROM role_team_inheritance
  //     WHERE role_id = ? AND is_deleted = 0
  //   `,
  //     [childRoleId]
  //   );
  //   return result;
  // },
  // Ambil parent untuk traverse (bisa lebih dari satu kalau multi parent)
  getParents: async (roleId) => {
    const result = await dbLms(
      `
      SELECT parent_role_id, permissions_inherited
      FROM role_team_inheritance
      WHERE role_id = ? AND is_deleted = 0
    `,
      [roleId]
    );
    return result;
  },

  // Ambil permission manual/eksplisit dari sebuah role
  getManualPermissions: async (roleId) => {
    const result = await dbLms(
      `
      SELECT * FROM team_permissions
      WHERE role_id = ? AND is_deleted = 0
    `,
      [roleId]
    );
    return result;
  },

  getInheritanceEdge: async (roleId, parentRoleId) => {
    try {
      const [result] = await dbLms(
        `SELECT * FROM role_team_inheritance WHERE role_id = ? AND parent_role_id = ?`,
        [roleId, parentRoleId]
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

  getRoleHierarchy: async () => {
    try {
      const result = await dbLms(`
        WITH RECURSIVE role_tree AS (
          -- Base case: roles without parents
          SELECT 
            rt.id,
            rt.name,
            NULL as parent_id,
            0 as level
          FROM role_teams rt
          WHERE rt.id NOT IN (
            SELECT DISTINCT role_id 
            FROM role_team_inheritance
          )
          AND rt.is_deleted = 0

          UNION ALL

          -- Recursive case: roles with parents
          SELECT 
            rt.id,
            rt.name,
            rti.parent_role_id,
            rt2.level + 1
          FROM role_teams rt
          JOIN role_team_inheritance rti ON rt.id = rti.role_id
          JOIN role_tree rt2 ON rti.parent_role_id = rt2.id
          WHERE rt.is_deleted = 0
        )
        SELECT * FROM role_tree
        ORDER BY level, name
      `);
      return result;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  checkExistingInheritance: async (roleId, parentId) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          id 
        FROM role_team_inheritance 
        WHERE role_id = ? AND parent_role_id = ?`,
        [roleId, parentId]
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
  getParentRoles: async (roleId) => {
    try {
      const result = await dbLms(
        `
        WITH RECURSIVE parent_roles AS (
          -- Direct parents
          SELECT 
            rt.id,
            rt.name,
            rti.parent_role_id,
            1 as level
          FROM role_teams rt
          JOIN role_team_inheritance rti ON rt.id = rti.parent_role_id
          WHERE rti.role_id = ? AND rt.is_deleted = 0

          UNION ALL

          -- Recursive parents
          SELECT 
            rt.id,
            rt.name,
            rti.parent_role_id,
            pr.level + 1
          FROM role_teams rt
          JOIN role_team_inheritance rti ON rt.id = rti.parent_role_id
          JOIN parent_roles pr ON rti.role_id = pr.id
          WHERE rt.is_deleted = 0
        )
        SELECT * FROM parent_roles
      `,
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

  // Get all child roles
  getChildRoles: async (roleId) => {
    try {
      const result = await dbLms(
        `
        WITH RECURSIVE child_roles AS (
          -- Direct children
          SELECT 
            rt.id,
            rt.name,
            rti.role_id as child_id,
            1 as level
          FROM role_teams rt
          JOIN role_team_inheritance rti ON rt.id = rti.role_id
          WHERE rti.parent_role_id = ? AND rt.is_deleted = 0

          UNION ALL

          -- Recursive children
          SELECT 
            rt.id,
            rt.name,
            rti.role_id,
            cr.level + 1
          FROM role_teams rt
          JOIN role_team_inheritance rti ON rt.id = rti.role_id
          JOIN child_roles cr ON rti.parent_role_id = cr.id
          WHERE rt.is_deleted = 0
        )
        SELECT * FROM child_roles
      `,
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
  getInitialHierarchyData: async (roleId) => {
    try {
      const result = await dbLms(
        `
        WITH RECURSIVE role_tree AS (
          SELECT 
            rt.id,
            rt.name,
            NULL as parent_id,
            0 as level,
            rt.created_at,
            rt.created_by
          FROM role_teams rt
          WHERE rt.id = ? AND rt.is_deleted = 0

          UNION ALL

          SELECT 
            rt.id,
            rt.name,
            rti.parent_role_id,
            tree.level + 1,
            rt.created_at,
            rt.created_by
          FROM role_teams rt
          JOIN role_team_inheritance rti ON rt.id = rti.role_id
          JOIN role_tree tree ON rti.parent_role_id = tree.id
          WHERE rt.is_deleted = 0
        )
        SELECT * FROM role_tree
      `,
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

  // Query untuk mendapatkan child roles
  getChildRoles: async (roleId) => {
    try {
      const result = await dbLms(
        `SELECT 
          rt.id, 
          rt.name,
          rti.role_id as child_id
        FROM role_teams rt
        JOIN role_team_inheritance rti ON rt.id = rti.role_id
        WHERE rti.parent_role_id = ? AND rt.is_deleted = 0`,
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
};

module.exports = roleTeams;
