const { err } = require("../utils/custom_error");
const Statistics = require("../models/statistics");
const Modules = require("../models/module_courses");
const { calculateStats } = require("../utils/statistics");
const { getMenteeErrorsByModule } = require("../models/statistics");

// const getModuleStatistics = async (req, res) => {
//   const { id: moduleId } = req.params;
//   try {
//     const scores = await Statistics.getScoresByModule(moduleId); // array of 1 & 0
//     // console.log(scores)
//     const stats = calculateStats(scores);

//     if (!stats || stats === 0) {
//       return res
//         .status(404)
//         .json({ message: "No data found for this module." });
//     }

//     return res.status(200).json({
//       moduleId,
//       total: scores.length,
//       ...stats,
//     });
//   } catch (err) {
//     console.error("Error:", err);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: err.message });
//   }
// };

const getMenteeErrorStats = async (req, res) => {
  try {
    const { id: moduleId } = req.params;

    const data = await getMenteeErrorsByModule(moduleId);
    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ message: "No mentee data found for this module." });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

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
    const atRiskResult = await Statistics.countAtRiskStudents(courseId);
    const atRiskCount = atRiskResult ? atRiskResult.atRiskCount : 0;
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
    if (courseId === undefined || courseId === null || courseId === "") {
      return res.status(400).json({ message: "courseId is required" });
    }

    const assignmentScores = await Statistics.getAssignmentScoresByModule(
      courseId
    );
    const quizScores = await Statistics.getQuizScoresByModule(courseId);

    // 2. Gabungkan hasilnya
    const allScores = [...assignmentScores, ...quizScores];

    if (allScores.length === 0) {
      return res
        .status(404)
        .json({ message: "No score data found for assignments or quizzes." });
    }

    // 3. Lakukan agregasi manual menggunakan for loop
    const moduleStats = {};

    for (let i = 0; i < allScores.length; i++) {
      const scoreData = allScores[i];
      const { moduleId, score, mentees_id } = scoreData;

      // Jika modul ini belum ada di 'moduleStats', inisialisasi dulu
      if (!moduleStats[moduleId]) {
        moduleStats[moduleId] = {
          scores: [],
          atRiskMentees: new Set(),
        };
      }

      // Tambahkan data ke modul yang sesuai
      moduleStats[moduleId].scores.push(parseFloat(score));
      if (parseFloat(score) < 65) {
        moduleStats[moduleId].atRiskMentees.add(mentees_id);
      }
    }

    // 4. Siapkan data untuk respons
    const responseData = [];
    const moduleIds = Object.keys(moduleStats);

    for (let i = 0; i < moduleIds.length; i++) {
      const moduleId = moduleIds[i];
      const stats = moduleStats[moduleId];

      let sum = 0;
      for (let j = 0; j < stats.scores.length; j++) {
        sum += stats.scores[j];
      }
      const average = sum / stats.scores.length;

      responseData.push({
        moduleId: moduleId,
        // Anda perlu fungsi lain untuk mengambil moduleName
        moduleName: `Module ${moduleId}`, // Placeholder
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
module.exports = {
  getMenteeErrorStats,
  getOverviewMetrics,
  getStatisticCourse,
  getModulesStatisticByCourse,
};
