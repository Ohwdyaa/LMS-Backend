const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Mentors = {
  createMentor: async (data, userId) => {
    try {
      const id = uuid();
      const result = await lmsManagement(
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
            sub_category_id
        ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          data.subCategoryId
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },
  updatePassword: async (id, hashedPassword) => {
    try {
      const result = await lmsManagement(
        `UPDATE mentors SET password = ? where id = ?`,
        [hashedPassword, id]
      );
      return result;
    } catch (error) {
      error;
    }
  },
  updateMentor: async (id, data) => {
    try {
      const result = await lmsManagement(
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
            genders_id = ?,
            updated_at = NOW(),
            updated_by = ? 
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
          data.genderId,
          id,
          id,
        ]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  activeMentor: async (id, userId) => {
    try {
      const result = await lmsManagement(
        `UPDATE 
          mentors
        SET 
          is_deleted = 0,
          updated_at = NOW(),
          updated_by = ?
        WHERE id = ?`,
        [userId, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteMentor: async (id, userId) => {
    try {
      const result = await lmsManagement(
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
      throw error;
    }
  },
  getAllMentors: async () => {
    try {
      const result = await lmsManagement(
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
        WHERE m.is_deleted = 0`
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getMentorById: async (id) => {
    try {
      const [result] = await lmsManagement(
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
        WHERE m.id = ?`,
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getMentorByEmail: async (id) => {
    try {
      const [result] = await lmsManagement(
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
      throw error;
    }
  },
  getMentorsBySubCategory: async (id) => {
    try {
      const result = await lmsManagement(
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
      throw error;
    }
  },
  logoutMentor: async (token) => {
    try {
      const result = await lmsManagement(
        `UPDATE mentors SET refresh_token = NULL WHERE refresh_token = ?`,
        token
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Mentors;