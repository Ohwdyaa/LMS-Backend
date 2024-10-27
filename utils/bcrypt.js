const bcrypt = require("bcryptjs");

salt = 10;
async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(hashedPassword)
  return hashedPassword;
};



async function verifyPassword (password, hashedPassword) {
  console.log(hashedPassword)
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
