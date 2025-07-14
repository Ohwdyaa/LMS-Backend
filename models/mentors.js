const { dbLms } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Mentors = {
  createMentor: async (data, userId) => {
    try {
      const id = uuid();
      const result = await dbLms(
        `
        INSERT INTO mentors (
            id,
            fullname, 
            email,
            phone_number,
            date_of_birth,
            nik,
            linkedin,
            password,  
            bpjs_kesehatan, 
            bpjs_tk,
            cv,
            profile_image, 
            npwp,
            contract,
            contract_start,
            contract_end,
            created_by,
            role_id, 
            genders_id,
            sub_category_id
        ) 
            VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          id,
          data.fullname,
          data.email,
          data.phoneNumber,
          data.dateOfBirth,
          data.nik,
          data.linkedin,
          data.password,
          data.bpjsKesehatan,
          data.bpjsTenagakerja,
          data.cv,
          data.profileImage,
          data.npwp,
          data.contract,
          data.contractStart,
          data.contractEnd,
          userId,
          data.roleId,
          data.genderId,
          data.subCategoryId,
        ]
      );
      return result.insertId;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  updatePassword: async (id, hashedPassword) => {
    try {
      const result = await dbLms(
        `UPDATE 
          mentors 
        SET 
          password = ?,
          updated_at = NOW(),
          updated_by = ? 
        WHERE id = ?`,
        [hashedPassword, id, id]
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
  updateMentor: async (id, data, userId) => {
    try {
      const result = await dbLms(
        ` UPDATE 
            mentors
          SET 
            fullname = ?, 
            email = ?,
            phone_number = ?,
            date_of_birth = ?,
            nik = ?,
            linkedin = ?, 
            bpjs_kesehatan = ?,
            bpjs_tk = ?,
            cv = ?,
            profile_image = ?, 
            npwp = ?,
            contract = ?,
            contract_start = ?,
            contract_end = ?,
            is_active = ?,
            updated_at = NOW(),
            updated_by = ?, 
            genders_id = ?,
            role_id = ?,
            sub_category_id = ?
          WHERE id = ?`,
        [
          data.fullname,
          data.email,
          data.phoneNumber,
          data.dateOfBirth,
          data.nik,
          data.linkedin,
          data.bpjsKesehatan,
          data.bpjsTenagakerja,
          data.cv,
          data.profileImage,
          data.npwp,
          data.contract,
          data.contractStart,
          data.contractEnd,
          data.isActive,
          userId,
          data.genderId,
          data.roleId,
          data.subCategoryId,
          id,
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
  softDeleteMentor: async (id, userId) => {
    try {
      const result = await dbLms(
        `UPDATE 
          mentors
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
  getAllMentors: async () => {
    try {
      const result = await dbLms(
        `SELECT 
            m.id,  
            m.email, 
            m.fullname,  
            rm.name as role, 
            sc.name as subCategory
        FROM mentors m
        LEFT JOIN role_mentors rm ON m.role_id = rm.id
        LEFT JOIN sub_categories sc ON m.sub_category_id = sc.id 
        WHERE m.is_deleted = 0`
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
  getMentorDetails: async (id) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          m.id,
          m.fullname,
          m.email, 
          m.phone_number as phoneNumber,
          m.date_of_birth as dateOfBirth,
          m.nik,
          m.linkedin,
          m.password,
          m.bpjs_kesehatan as bpjsKesehatan,
          m.bpjs_tk as bpjsTenagakerja,
          m.cv,
          m.profile_image as profileImage,
          m.npwp,
          m.contract,
          m.contract_start as contractStart,
          m.contract_end as contractEnd,
          m.is_active as isActive,
          m.role_id as roleId,
          m.genders_id as genderId,
          m.sub_category_id as subCategoryId,
          rm.name as role,
          g.name as gender,
          sc.name as subCategory
        FROM mentors m
        LEFT JOIN role_mentors rm ON m.role_id = rm.id
        LEFT JOIN genders g ON m.genders_id = g.id
        LEFT JOIN sub_categories sc ON m.sub_category_id = sc.id 
        WHERE m.id = ?`,
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
  getMentorById: async (id) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          id,
          is_deleted
        FROM mentors 
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
  getMentorByEmail: async (id) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          m.id,
          m.fullname,
          m.email, 
          m.password,
          m.role_id as roleId,
          rm.name as role
        FROM mentors m
        LEFT JOIN role_mentors rm ON m.role_id = rm.id
        WHERE m.email = ? AND m.is_deleted = 0`,
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
  getMentorsBySubCategory: async (id) => {
    try {
      const result = await dbLms(
        `SELECT 
          m.id,  
          m.fullname,
          m.email, 
          rm.name as role, 
          sc.name as subCategory 
        FROM mentors m
        LEFT JOIN role_mentors rm ON m.role_id = rm.id 
        LEFT JOIN sub_categories sc ON m.sub_category_id = sc.id
        WHERE sc.id = ?`,
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
  logoutMentor: async (token) => {
    try {
      const result = await dbLms(
        `UPDATE mentors SET refresh_token = NULL WHERE refresh_token = ?`,
        token
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
  getMentorsCountByRoleId: async (roleId) => {
    try {
      const [result] = await dbLms(
        `SELECT COUNT(*) as count FROM mentors where role_id = ? AND is_deleted = 0`,
        [roleId]
      );
      return result.count;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getMentorsCountBySubCategoryId: async (subCategoryId) => {
    try {
      const [result] = await dbLms(
        `SELECT COUNT(*) as count FROM mentors where sub_category_id = ? AND is_deleted = 0`,
        [subCategoryId]
      );
      return result.count;
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
};

module.exports = Mentors;

// getMentorByUsernameAndEmail: async (username, email, id) => {
//   try {
//     if (id) {
//       const [result] = await dbLms(
//         `SELECT
//           id,
//           email,
//           username
//         FROM mentors
//         WHERE (username LIKE ? OR email LIKE ?) AND NOT id = ? AND is_deleted = 0`,
//         [username + "%", email + "%", id]
//       );
//       return result;
//     }
//     const [result] = await dbLms(
//       `SELECT
//         id,
//         email,
//         username
//       FROM mentors
//       WHERE (username LIKE ? OR email LIKE ?) AND is_deleted = 0`,
//       [username + "%", email + "%"]
//     );
//     return result;
//   } catch (error) {
//     if (error.code && error.sqlMessage) {
//       const message = mapMySQLError(error);
//       throw new Error(message);
//     }
//     throw error;
//   }
// },
