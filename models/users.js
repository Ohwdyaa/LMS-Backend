const db = require('../config/db/db')
const{hashPassword} = require('../utils/crypto');

class Users{
    constructor (id, username, email, password, profile_image, fullName, phone_Number, address, institute, date_of_birth, roleId, genderId, religionId, salt,){
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.profile_image = profile_image;
        this.fullName = fullName;
        this.phone_Number = phone_Number;
        this.address = address;
        this.institute = institute;
        this.date_of_birth = date_of_birth;
        this.roleId = roleId;
        this.genderId = genderId;
        this.religionId = religionId;
        this.hashed_password = hashed_password;
        this.salt = salt;
    }
    
    static async createUser({ username, email, password, profile_image, fullName, phone_Number, address, institute, date_of_birth, roleId, genderId, religionId}) {
        try {
            const { hash, salt } = await hashPassword(password);
            console.log('Creating user with data:', {
                username,
                email,
                profile_image,
                fullName,
                phone_Number,
                address,
                institute,
                date_of_birth,
                roleId,
                genderId,
                religionId,
                hashed_password: hash, 
                salt
            });
            const [result] = await db.query(`
                INSERT INTO users (
                    username, 
                    email,
                    profile_image, 
                    fullName, 
                    phone_Number, 
                    address, 
                    institute, 
                    date_of_birth, 
                    role_id, 
                    gender_id, 
                    religion_id,
                    hashed_password,
                    salt
                ) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [username,
                email, 
                profile_image, 
                fullName, 
                phone_Number, 
                address, 
                institute, 
                date_of_birth, 
                roleId, 
                genderId, 
                religionId, 
                hash,
                salt
            ]);
            return result.insertId; 
        } catch (error) {
            console.error('Database Error:', error); 
            throw new Error('Database error');
        }
    }

    static async getUserById(id) {
        try {
            const [result] = await db.query(`
                SELECT users.*, roles.name as roleName, genders.name as genderName, religions.name as religionName
                FROM users
                JOIN roles ON users.roleId = roles.id
                JOIN genders ON users.genderId = genders.id
                JOIN religions ON users.religionId = religions.id
                WHERE users.id = ?
            `, [id]);
    
            if (result.length === 0) {
                console.warn(`User with ID ${id} not found`);
                return null;
            }
            return result[0];
        } catch (error) {
            console.error(`Error fetching user by ID ${id}:`, error.message); 
            throw new Error('Database error occurred while fetching user'); 
        }
    }
    
    static async getUserByEmail(email) {
        try {
            console.log('Attempting to get user with email:', email);
            const [result] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
            console.log('Query result:', result);
            if (result.length === 0) {
                return null; 
            }
            return result[0];
        } catch (error) {
            console.error('Database error:', error);
            throw new Error('Database error: ' + error.message);
        } 
   }
   
   static async updateRefreshToken(userId, refreshToken) {
        try {
            await db.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, userId]);
        } catch (error) {
            throw new Error('Database error');
        }
    } 
}

module.exports = Users;