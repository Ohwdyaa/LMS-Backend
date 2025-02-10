const { dbMentee } = require("../config/db/db");
const { uuid } = require("../utils/tools");

const Mentees = {
  createMentee: async (data, userId) => {
    try {
      const id = uuid();
      const result = await dbMentee(
        `INSERT INTO mentees(
            id,
            fullname,
            username,
            email,
            password,
            phone_number,
            university,
            major,
            DPP,
            created_by,
            categories_id,
            sub_categories_id,
            mentors_id,
            class_id,
            session_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          data.fullname,
          data.username,
          data.email,
          data.password,
          data.phoneNumber,
          data.university,
          data.major,
          data.DPP,
          userId,
          data.categoriesId,
          data.subCategoriesId,
          data.mentorId,
          data.classId,
          data.sessionId,
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
  updateMentee: async (data, userId, id) => {
    try {
      const result = await dbLms(
        `UPDATE 
          mentees 
        SET 
          fullname = ?,
          username = ?,
          email = ?,
          phone_number = ?,
          university = ?,
          major = ?,
          DPP = ?,
          updated_at = NOW(),
          updated_BY = ?,
          categories_id = ?,
          sub_categories_id = ?,
          mentors_id = ?,
          class_id = ?,
          session_id = ?
        WHERE id = ?`,
        [
          data.fullname,
          data.username,
          data.email,
          data.phoneNumber,
          data.university,
          data.major,
          data.DPP,
          userId,
          data.categoriesId,
          data.subCategoriesId,
          data.mentorId,
          data.classId,
          data.sessionId,
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
  updatePassword: async (id, hashedPassword) => {
    try {
      const result = await dbLms(
        `UPDATE 
          mentees 
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
  deleteMentee: async (id) => {
    try {
      const result = await dbLms(
        `DELETE FROM mentees where id = ?`,
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
  getAllMentee: async () => {
    try {
      const result = await dbLms(
        `SELECT 
          id, 
          fullname, 
          username, 
          email
        FROM mentees 
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
  getMenteeById: async (id) => {
    try {
      const [result] = await dbLms(
        `SELECT 
          id,
          fullname, 
          username, 
          email, 
          password
        FROM mentees 
        WHERE is_deleted = 0`,
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
  getMenteeByUsernameAndEmail: async (username, email, id) => {
    try {
      if (id) {
        const [result] = await dbLms(
          `SELECT 
            id,
            email,
            username
          FROM mentees
          WHERE (username LIKE ? OR email LIKE ?) AND NOT id = ? AND is_deleted = 0`,
          [username + "%", email + "%", id]
        );
        return result;
      }
      const [result] = await dbLms(
        `SELECT 
          id,
          email,
          username
        FROM mentee
        WHERE (username LIKE ? OR email LIKE ?) AND is_deleted = 0`,
        [username + "%", email + "%"]
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
module.exports = Mentees;