const { err } = require("../utils/custom_error");
const Statistics = require("../models/statistics");
const { calculateStats } = require("../utils/statistics");

async function getOverviewMetrics(req, res) {
  try {
    const { id: courseId } = req.params;
    if (courseId === undefined || courseId === null || courseId === "") {
      return res.status(400).json({ message: "courseId is required" });
    }
    //total mentees
    const totalMentees = await Statistics.getTotalMentees(courseId);
    if (totalMentees === undefined || totalMentees === null) {
      return res
        .status(404)
        .json({ message: " No mentees found for this course." });
    }
    //all Score
    const allScores = await Statistics.getAllScoresByCourse(courseId);
    if (!Array.isArray(allScores) || allScores.length === 0) {
      return res
        .status(404)
        .json({ message: "No scores found for this course." });
    }
    const scoreValues = [];
    for (let i = 0; i < allScores.length; i++) {
      const scoreAsNumber = parseFloat(allScores[i].score);
      scoreValues.push(scoreAsNumber);
    }
    const classStats = calculateStats(scoreValues);

    //At-Risk Students
    const atRiskList = await getAtRiskStudentsList(courseId);
    const atRiskCount = atRiskList.length;
    const atRiskPercentage = (atRiskCount / totalMentees) * 100;

    //Engagement Rate
    const activeMenteesResult = await Statistics.countActiveMentees(courseId);
    const activeMenteesCount = activeMenteesResult
      ? activeMenteesResult.activeCount
      : 0;
    const engagementRate = (activeMenteesCount / totalMentees) * 100;

    const response = {
      totalMentees: {
        count: totalMentees,
      },
      classAverage: {
        currentAverage: classStats ? classStats.mean : 0,
        median: classStats ? classStats.median : 0,
        mode: classStats ? classStats.mode : 0,
        stdDev: classStats ? classStats.stdDev : 0,
        // (Untuk 'changeFromLastWeek' butuh query historis tambahan, bisa kita kembangkan nanti)
        // changeFromLastWeek: 0, // Placeholder
      },
      atRiskStudents: {
        count: atRiskCount,
        percentage: atRiskPercentage,
      },
      engagementRate: {
        rate: parseFloat(engagementRate.toFixed(2)),
      },
    };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "An error occurred while fetching dashboard metrics.",
    });
  }
}
async function getStatisticCourse(req, res) {
  try {
    const { id: courseId } = req.params;
    if (courseId === undefined || courseId === null || courseId === "") {
      return res.status(400).json({ message: "courseId is required" });
    }
    //total mentees
    const allScores = await Statistics.getAllScoresByCourse(courseId);
    if (!Array.isArray(allScores) || allScores.length === 0) {
      return res
        .status(404)
        .json({ message: "No scores found for this course." });
    }
    const scoreValues = [];
    for (let i = 0; i < allScores.length; i++) {
      const scoreAsNumber = parseFloat(allScores[i].score);
      scoreValues.push(scoreAsNumber);
    }
    const classStats = calculateStats(scoreValues);
    return res.status(200).json({ classStats });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "An error occurred while fetching dashboard metrics.",
    });
  }
}
const getModulesStatisticByCourse = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({ message: "courseId is required" });
    }

    // Ambil data assignment & quiz (pastikan query SQL sudah SELECT moduleId, moduleName, score, mentees_id)
    const assignmentScores = await Statistics.getAssignmentScoreByModule(
      courseId
    );
    const quizScores = await Statistics.getQuizScoresByModule(courseId);

    const allScores = [...assignmentScores, ...quizScores];

    if (allScores.length === 0) {
      return res
        .status(404)
        .json({ message: "No score data found for assignments or quizzes." });
    }

    // Pakai Map agar moduleName tidak hilang
    const moduleStats = new Map();

    for (const { moduleId, moduleName, score, mentees_id } of allScores) {
      if (!moduleStats.has(moduleId)) {
        moduleStats.set(moduleId, {
          moduleName: moduleName || `Module ${moduleId}`,
          scores: [],
          atRiskMentees: new Set(),
        });
      }
      const stats = moduleStats.get(moduleId);
      stats.scores.push(parseFloat(score));
      if (parseFloat(score) < 65) {
        stats.atRiskMentees.add(mentees_id);
      }
    }

    // Siapkan response
    const responseData = [];
    for (const [moduleId, stats] of moduleStats.entries()) {
      const sum = stats.scores.reduce((a, b) => a + b, 0);
      const average = sum / stats.scores.length;
      responseData.push({
        moduleId,
        moduleName: stats.moduleName,
        averageScore: parseFloat(average.toFixed(2)),
        atRiskCount: stats.atRiskMentees.size,
      });
    }

    return res.status(200).json(responseData);
  } catch (error) {
    return res.status(500).json({
      message:
        error.message || "An error occurred while fetching module statistics.",
    });
  }
};
async function getAtRiskStudents(req, res) {
  try {
    const { id: courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({ message: "courseId is required" });
    }

    // Gunakan helper agar tidak duplikat kode
    let atRiskStudents = await getAtRiskStudentsList(courseId);

    // (Opsional) Tambahkan logika prioritas dan riskFactors jika ingin response lebih detail
    // Contoh: urutkan prioritas HIGH di atas
    atRiskStudents = atRiskStudents.map((student) => {
      // Tambahkan riskFactors dan priority jika ingin response sama seperti sebelumnya
      const riskFactors = [];
      if (student.studentAverage < 65) riskFactors.push("Low Quiz Scores");
      if (student.totalEngagementMinutes < 300) riskFactors.push("Poor Engagement");
      let priority = "MEDIUM";
      if (student.classAverage - student.studentAverage > 15) priority = "HIGH";
      return {
        ...student,
        riskFactors: riskFactors.length > 0 ? riskFactors : ["Inconsistent Performance"],
        priority,
        engagement: `${Math.round(student.totalEngagementMinutes / 4)} min/week`,
        performance: {
          studentAverage: student.studentAverage,
          classAverage: student.classAverage,
          gap: parseFloat((student.studentAverage - student.classAverage).toFixed(2)),
        },
      };
    });
    atRiskStudents.sort((a, b) => {
      if (a.priority === "HIGH" && b.priority !== "HIGH") return -1;
      if (a.priority !== "HIGH" && b.priority === "HIGH") return 1;
      return 0;
    });

    return res.status(200).json(atRiskStudents);
  } catch (error) {
    console.error("Error in getAtRiskStudents controller:", error);
    return res
      .status(500)
      .json({ message: "An error occurred on the server." });
  }
}

// Helper untuk mengambil array mentee at-risk (tanpa response Express)
async function getAtRiskStudentsList(courseId) {
  const allScores = await Statistics.getAllStudentScores(courseId);
  const allEngagements = await Statistics.getAllStudentEngagements(courseId);
  if (!allScores || allScores.length === 0) return [];

  const studentData = {};
  for (let i = 0; i < allScores.length; i++) {
    const scoreRecord = allScores[i];
    const { mentees_id, menteeName, score } = scoreRecord;
    if (!studentData[mentees_id]) {
      studentData[mentees_id] = {
        menteeName: menteeName,
        scores: [],
        totalEngagementMinutes: 0,
      };
    }
    studentData[mentees_id].scores.push(parseFloat(score));
  }
  for (let i = 0; i < allEngagements.length; i++) {
    const engagementRecord = allEngagements[i];
    const { mentees_id, duration } = engagementRecord;
    if (studentData[mentees_id]) {
      studentData[mentees_id].totalEngagementMinutes += parseFloat(
        duration || 0
      );
    }
  }
  // Hitung rata-rata kelas
  let totalAllScores = 0;
  let totalScoreCount = 0;
  const studentIds = Object.keys(studentData);
  for (let i = 0; i < studentIds.length; i++) {
    const id = studentIds[i];
    const student = studentData[id];
    for (let j = 0; j < student.scores.length; j++) {
      totalAllScores += student.scores[j];
    }
    totalScoreCount += student.scores.length;
  }
  const classAverage =
    totalScoreCount > 0 ? totalAllScores / totalScoreCount : 0;

  // Filter mentee at-risk
  const atRiskStudents = [];
  for (let i = 0; i < studentIds.length; i++) {
    const id = studentIds[i];
    const student = studentData[id];
    let studentTotalScore = 0;
    for (let j = 0; j < student.scores.length; j++) {
      studentTotalScore += student.scores[j];
    }
    const studentAverage =
      student.scores.length > 0 ? studentTotalScore / student.scores.length : 0;
    if (studentAverage < classAverage) {
      atRiskStudents.push({
        studentId: id,
        studentName: student.menteeName,
        studentAverage: parseFloat(studentAverage.toFixed(2)),
        classAverage: parseFloat(classAverage.toFixed(2)),
        totalEngagementMinutes: student.totalEngagementMinutes,
      });
    }
  }
  return atRiskStudents;
}

module.exports = {
  getOverviewMetrics,
  getStatisticCourse,
  getModulesStatisticByCourse,
  getAtRiskStudents,
  getAtRiskStudentsList,
};
