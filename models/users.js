const db = require('../config/db/db');

class Users {
    constructor (
        id, username, email, password, profile_image, fullName, phone_Number, address, institute, date_of_birth, roleId, genderId, religionId
    ) {
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
    }

    static async createUser({
        id, username, email, password, profile_image, fullName, phone_Number, address, institute, date_of_birth, roleId, genderId, religionId
    }) {
        try {
            const [result] = await db.query(`
                INSERT INTO users (
                    id,
                    username, 
                    email,
                    password,                
                    profile_image, 
                    fullName, 
                    phone_Number, 
                    address, 
                    institute, 
                    date_of_birth, 
                    role_id, 
                    gender_id, 
                    religion_id
                ) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                id,
                username,
                email, 
                password,             
                profile_image, 
                fullName, 
                phone_Number, 
                address, 
                institute, 
                date_of_birth,
                roleId, 
                genderId, 
                religionId
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

            const role = await Roles.getRoleById(user.role_id);
            user.role = role ? role.name : null;
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