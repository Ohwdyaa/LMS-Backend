const ss = require("simple-statistics");

function calculateStats(scores) {
  if (scores.length === 0) return null;

  return {
    mean: ss.mean(scores),
    median: ss.median(scores),
    mode: ss.mode(scores),
    stdDev: ss.standardDeviation(scores),
    min: Math.min(...scores),
    max: Math.max(...scores)
  };
}

module.exports = { calculateStats };