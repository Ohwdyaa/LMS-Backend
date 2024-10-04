const bcrypt = require("bcryptjs");

const salt = 10;
const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const verifyPassword = async (password, hashedPassword) => {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
};

module.exports = {
  hashPassword,
  verifyPassword,
};
