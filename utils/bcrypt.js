const bcrypt = require("bcryptjs");

salt = 10;
async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("Hashed Password:", hashedPassword);
  return hashedPassword;
};


const verifyPassword = async (password, hashedPassword) => {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
}

module.exports = {
  hashPassword,
  verifyPassword,
};
