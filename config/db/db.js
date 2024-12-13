const mysql = require("mysql2/promise");
const config = require("../config");

const pool1 = mysql.createPool({
  host: config.dbLearningManagementSystem.host,
  port: config.dbLearningManagementSystem.port,
  user: config.dbLearningManagementSystem.user,
  password: config.dbLearningManagementSystem.password,
  database: config.dbLearningManagementSystem.name,
  bigNumberStrings: true,
  waitForConnections: true,
});
const pool2 = mysql.createPool({
  host: config.dbModulePages.host,
  port: config.dbModulePages.port,
  user: config.dbModulePages.user,
  password: config.dbModulePages.password,
  database: config.dbModulePages.name,
  bigNumberStrings: true,
  waitForConnections: true,
});

async function learningManagementSystem(query, value) {
  try {
    const [result] = await pool1.query(query, value === undefined ? [] : value);
    return result;
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error;
  }
}

function formatBulkQuery1(query, array) {
  try {
    return pool1.format(query, array === undefined ? [] : array);
  } catch (error) {
    console.log(error);
  }
}
async function modulePages(query, value) {
  try {
    const [result] = await pool2.query(query, value === undefined ? [] : value);
    return result;
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error;
  }
}

module.exports = { learningManagementSystem, modulePages, formatBulkQuery1 };