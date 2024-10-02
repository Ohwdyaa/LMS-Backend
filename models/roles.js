const { query } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const { err, CustomError } = require("../utils/customError");

const Roles = {
  createRole: async (roleData) => {
    try {
      const id = uuid();  
      const result = await query(
        `
        INSERT INTO roles (
        id,
        name
        ) VALUES (?,?)`,
        [id, roleData.name]
      );
      if (result.length === 0) {
        return null;
      }

      return result;
    } catch (error) {
      throw new CustomError(
        err.dataError.message,
        err.dataError.statusCode
      );
    }
  },
  getRoleById: async (roleId) => {
    try {
      const [result] = await query("SELECT * FROM roles WHERE id = ?", [
        roleId,
      ]);
      if (result.length === 0) {
        return null;
      }

      return result;
    } catch (error) {
      throw new CustomError(
        err.dataError.message,
        err.dataError.statusCode
      );
    }
  },
  getAllRoles: async () => {
    try {
      const result = await query("SELECT * FROM roles");
      if (result.length === 0) {
        return null;
      }

      return result;
    } catch (error) {
      throw new CustomError(
        err.dataError.message,
        err.dataError.statusCode
      );
    }
  },
  deleteRole : async(roleId)=>{
    try {
    const hapus = await query ("DELETE FROM roles where id = ? ", [roleId]);
      return hapus;
    } catch (error){
      throw new CustomError(
        err.dataError.message,
        err.dataError.statusCode
      );
    }
  }
};
module.exports = Roles;
