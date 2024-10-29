const bcrypt = require("bcryptjs");

salt = 10;
async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

async function verifyPassword (password, hashedPassword) {
  if (!password || !hashedPassword) {
   throw new Error("Invalid password or hashedPassword");
  }
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
}

module.exports = { 
  hashPassword,
  verifyPassword,
};
