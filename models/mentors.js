const { learningManagementSystem } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Mentors = {
  createMentor: async (data, userId) => {
    try {
      const id = uuid();
      const result = await learningManagementSystem(
        `
        INSERT INTO mentors (
            id,
            fullname, 
            username, 
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
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          id,
          data.fullname,
          data.username,
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
      const result = await learningManagementSystem(
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
      const result = await learningManagementSystem(
        ` UPDATE 
            mentors
          SET 
            fullname = ?, 
            username = ?,
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
          data.username,
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
  // activeMentor: async (id, userId) => {
  //   try {
  //     const result = await learningManagementSystem(
  //       `UPDATE 
  //         mentors
  //       SET 
  //         is_deleted = 0,
  //         updated_at = NOW(),
  //         updated_by = ?
  //       WHERE id = ?`,
  //       [userId, id]
  //     );
  //     return result;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  deleteMentor: async (id, userId) => {
    try {
      const result = await learningManagementSystem(
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
      const result = await learningManagementSystem(
        `SELECT 
            m.id, 
            m.fullname, 
            m.username, 
            m.email, 
            r.name as role, 
            g.name as gender, 
            sc.name as subCategory
        FROM mentors m
        LEFT JOIN roles r ON m.role_id = r.id
        LEFT JOIN genders g ON m.genders_id = g.id
        LEFT JOIN sub_categories sc ON m.sub_category_id = sc.id 
        WHERE m.is_active = 1 AND m.is_deleted = 0`
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
      const [result] = await learningManagementSystem(
        `SELECT 
          m.id,
          m.fullname,
          m.username, 
          m.email, 
          m.phone_number as phoneNumber,
          m.date_of_birth as dateOfBirth,
          m.nik,
          m.linkedin,
          m.password,
          m.bpjs_kesehatan as bpjsKesehata,
          m.bpjs_tk as bpjsTenagakerja,
          m.cv,
          m.npwp,
          m.contract,
          m.contract_start as contractStart,
          m.contract_end as contractEnd,
          m.role_id as roleId,
          m.genders_id as genderId,
          m.sub_category_id as subCategoryId,
          r.name as role,
          g.name as gender,
          sc.name as subCategory
        FROM mentors m
        LEFT JOIN roles r ON m.role_id = r.id
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
  getMentorByEmail: async (id) => {
    try {
      const [result] = await learningManagementSystem(
        `SELECT 
          m.id,
          m.fullname,
          m.username, 
          m.email, 
          m.password,
          m.role_id,
          r.name as role
        FROM mentors m
        LEFT JOIN roles r ON m.role_id = r.id
        WHERE m.email = ?`,
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
      const result = await learningManagementSystem(
        `SELECT 
          m.id,  
          m.fullname,
          m.username, 
          m.email, 
          r.name as role, 
          sc.name as subCategory 
        FROM mentors m
        LEFT JOIN roles r ON m.role_id = r.id 
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
      const result = await learningManagementSystem(
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
};

module.exports = Mentors;
