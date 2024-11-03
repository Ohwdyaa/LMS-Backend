const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const Users = require("../models/users");

const Roles = {
  createRole: async (data, creatorEmail) => {
    try {
      const creatorRole = await Users.getUserByEmail(creatorEmail);
      if(creatorRole === undefined || creatorRole === null){
        throw new Error ('Creator not found');
      }
      creatorId = creatorRole.id;
      creatorUsername = creatorRole.username;
      const id = uuid();

      const result = await lmsManagement(
        `
        INSERT INTO roles (
        id,
        name,
        created_by
        ) VALUES (?,?,?)`,
        [id, data.name, creatorId]
      );
 console.log("role created : ", {
  id, 
  name : data.name,
  created_by : creatorId,
  created_by_username : creatorUsername,
 });
 return result.insertId;
    } catch (error) {
      throw error;
    }
  },
  getRoleById: async (roleId) => {
    try {
      const [result] = await lmsManagement("SELECT id, name FROM roles WHERE id = ?", [
        roleId,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllRole: async () => {
    try {
      const result = await lmsManagement(
        "SELECT id, name FROM roles WHERE is_deleted = 0"
      );

      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteRole: async (roleId) => {
    try {
      const result = await lmsManagement("DELETE FROM roles where id = ? ", [roleId]);
      return result;
    } catch (error) {
      throw error;
    }
  },
  changeUserRole: async (userId, roleId) => {
    try {
      const result = await lmsManagement(`UPDATE users SET role_id = ? WHERE id = ? `, [
        roleId,
        userId,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  },
};
module.exports = Roles;
