const crypto = require('crypto');

async function hashPassword(password) {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString('hex');
        crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
            if (err) reject(err);
            resolve({ hash: derivedKey.toString('hex'), salt });
        });
    });
}

async function verifyPassword(password, hashedPassword, salt) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
            if (err) reject(err);
            const calculatedHash = derivedKey.toString('hex');
            console.log('Calculated hash:', calculatedHash);
            console.log('Stored hash:', hashedPassword);
            console.log('Are hashes equal?', calculatedHash === hashedPassword);
            resolve(calculatedHash === hashedPassword);
        });
    });
}

module.exports = { 
    hashPassword, 
    verifyPassword 
};
