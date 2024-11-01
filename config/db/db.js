const mysql = require("mysql2/promise");
const config = require("../config");

const pool1 = mysql.createPool({
  host: config.dbLmsManagement.host,
  port: config.dbLmsManagement.port,
  user: config.dbLmsManagement.user,
  password: config.dbLmsManagement.password,
  database: config.dbLmsManagement.name,
  bigNumberStrings: true,
  waitForConnections: true,
});
const pool2 = mysql.createPool({
  host: config.dbLmsModule.host,
  port: config.dbLmsModule.port,
  user: config.dbLmsModule.user,
  password: config.dbLmsModule.password,
  database: config.dbLmsModule.name,
  bigNumberStrings: true,
  waitForConnections: true,
});

async function lmsManagement(query, value) {
  try {
    const [result] = await pool1.query(query, value === undefined ? [] : value);
    return result;
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error;
  }
}

async function formatBulkQuery1(query, array) {
  try {
    return await pool1.format(query, array === undefined ? [] : array);
  } catch (error) {
    console.log(error);
  }
}
async function lmsModule(query, value) {
  try {
    const [result] = await pool2.query(query, value === undefined ? [] : value);
    return result;
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error;
  }
}

module.exports = { lmsManagement, lmsModule, formatBulkQuery1 };