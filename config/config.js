const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT || 3306,
  jwtSecret: process.env.JWT_SECRET || '',
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'mysql@123',
    name: process.env.DB_NAME || 'lms_db'
  }
};