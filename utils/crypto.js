const crypto = require('crypto');

async function hashPassword(password) {
    const hash = crypto.createHash('sha256'); 
    hash.update(password);
    return hash.digest('hex'); 
}

async function verifyPassword(password, hashedPassword) {
    const hash = await hashPassword(password);
    return hash === hashedPassword;
}


module.exports = { 
    hashPassword, 
    verifyPassword 
};
