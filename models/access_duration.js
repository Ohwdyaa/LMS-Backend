const { dbMentee } = require("../config/db/db");
const { mapMySQLError } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

const Session = {
  // Mulai session baru
  startSession: async (menteesId, coursesId) => {
    try {
      const id = uuid();
      const now = new Date();
      const sessionDate = now.toISOString().slice(0, 10); // YYYY-MM-DD

      await dbMentee(
        `INSERT INTO course_sessions (
          id,  
          session_date, 
          created_by, 
          mentees_id, 
          courses_id
        ) VALUES (?, ?, ?, ?, ?)`,
        [id, sessionDate, menteesId, menteesId, coursesId]
      );
      return { sessionId: id, startTime: now };
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  getSessionAccessById: async (id) => {
    try {
      const [result] = await dbMentee(
        `SELECT 
            id, 
            start_time,
            session_date, 
            mentees_id, 
            courses_id
        FROM course_sessions 
            WHERE id = ? 
            AND is_deleted = 0`,
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
  heartbeatSession: async (id, minutes, menteesId) => {
    try {
      await dbMentee(
        `UPDATE course_sessions 
        SET 
            duration_minutes = ?,
            updated_at = NOW(),
            updated_by = ?
        WHERE id = ?`,
        [minutes, menteesId, id]
      );
      return { success: true, totalMinutes: minutes };
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
  endSession: async (id, totalMinutes, menteesId, endTime) => {
    try {
      await dbMentee(
        `UPDATE course_sessions 
        SET end_time = ?, 
          duration_minutes = ?, 
          updated_at = NOW(), 
          updated_by = ?
         WHERE id = ?`,
        [endTime, totalMinutes, menteesId, id]
      );

      return {
        success: true,
        sessionSummary: {
          totalMinutes,
          endTime: endTime,
        },
      };
    } catch (error) {
      if (error.code && error.sqlMessage) {
        const message = mapMySQLError(error);
        throw new Error(message);
      }
      throw error;
    }
  },
};

module.exports = Session;
// // Update/insert ke daily_summary
//       const [summary] = await dbLms(
//         `SELECT id, total_minutes, session_count
//          FROM daily_summary
//          WHERE date = ? AND mentees_id = ? AND courses_id = ? AND is_deleted = 0`,
//         [session.session_date, session.mentees_id, session.courses_id]
//       );

//       if (summary) {
//         // Sudah ada, update
//         await dbLms(
//           `UPDATE daily_summary
//             SET total_minutes = total_minutes + ?, session_count = session_count + 1, updated_at = ?, updated_by = ?
//            WHERE id = ?`,
//           [totalMinutes, endTime, session.mentees_id, summary.id]
//         );
//       } else {
//         // Belum ada, insert
//         const summaryId = uuid();
//         await dbLms(
//           `INSERT INTO daily_summary (
//             id, date, total_minutes, session_count, is_deleted, created_at, created_by, mentees_id, courses_id
//           ) VALUES (?, ?, ?, 1, 0, ?, ?, ?, ?)`,
//           [
//             summaryId,
//             session.session_date,
//             totalMinutes,
//             endTime,
//             session.mentees_id,
//             session.mentees_id,
//             session.courses_id,
//           ]
//         );
//       }
