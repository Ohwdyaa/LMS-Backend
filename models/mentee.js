const { dbMentee } = require("../config/db");
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
};
module.exports = Mentees;