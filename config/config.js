const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  issuer: process.env.JWT_ISSUER || 'APPLMS',
  audience: process.env.JWT_AUDIENCE || 'http://localhost:3000',
  // jwtSecret: process.env.JWT_SECRET || 'infinite_le@rning',
  db1: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME1 || 'lms_db2'
  },
  db2: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME2 || 'lms_module'
  }
};