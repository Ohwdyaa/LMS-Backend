const mysql = require("mysql2/promise");
const config = require("../config");

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  bigNumberStrings: true,
  waitForConnections: true,
});

async function query(query, value) {
  try {
    const [result] = await pool.query(query, value === undefined ? [] : value);
    console.log(`Executed query: ${query} with values: ${JSON.stringify(value)}`);
    return result;
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error;
  }
}

testConnection();

module.exports = { query };