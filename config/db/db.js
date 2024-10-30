const mysql = require("mysql2/promise");
const config = require("../config");

const pool1 = mysql.createPool({
  host: config.db1.host,
  port: config.db1.port,
  user: config.db1.user,
  password: config.db1.password,
  database: config.db1.name,
  bigNumberStrings: true,
  waitForConnections: true,
});
const pool2 = mysql.createPool({
  host: config.db2.host,
  port: config.db2.port,
  user: config.db2.user,
  password: config.db2.password,
  database: config.db2.name,
  bigNumberStrings: true,
  waitForConnections: true,
});

async function query1(query, value) {
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
async function query2(query, value) {
  try {
    const [result] = await pool2.query(query, value === undefined ? [] : value);
    return result;
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error;
  }
}

module.exports = { query1, query2, formatBulkQuery1 };