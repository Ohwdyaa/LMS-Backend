const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT,
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
  dbLmsManagement: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME1
  },
  dbLmsModule: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ,
    name: process.env.DB_NAME2 
  }
};