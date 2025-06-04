const { err } = require("../utils/custom_error");
const Statistics = require("../models/statistics");
const Modules = require("../models/module_courses");
const { calculateStats } = require("../utils/statistics");
const { getMenteeErrorsByModule } = require("../models/statistics");

const getAllModulesStatistic = async (req, res) => {
  const { id: courseId } = req.params;
  try {
    const modules = await Modules.getModuleByCourse(courseId);
    if (modules.length === 0) {
      return res.status(404).json({ message: "No module found." });
    }
    var statsArray = [];

    for (var i = 0; i < modules.length; i++) {
      var mod = modules[i];
      var scores = await Statistics.getScoresByModule(mod.id);
      var stats = calculateStats(scores);
      var stats = calculateStats(scores) || {
        mean: 0,
        median: 0,
        mode: 0,
        stdDev: 0,
        min: 0,
        max: 0,
      };
      statsArray.push({
        moduleId: mod.id,
        moduleName: mod.name,
        total: scores.length,
        mean: stats.mean,
        median: stats.median,
        mode: stats.mode,
        stdDev: stats.stdDev,
        min: stats.min,
        max: stats.max,
      });
    }

    if (statsArray.length === 0) {
      return res.status(404).json({ message: "No module statistics found." });
    }

    return res.status(200).json(statsArray);
  } catch (err) {
    console.error("Error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
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

module.exports = {
  getAllModulesStatistic,
  getMenteeErrorStats,
};
