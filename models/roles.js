const db = require('../config/db/db')

class Roles{
    constructor(id, name){
        this.id = id;
        this.name = name;
    }

    static async getRoleById(roleId) {
        try {
            const [result] = await db.query('SELECT * FROM roles WHERE id = ?', [roleId]);
            if (result.length === 0) {
                return null; 
            }
            return result[0]; 
        } catch (error) {
            throw new Error('Database error');
        }
    }

    static async getAllRoles() {
        const [result] = await db.query('SELECT * FROM roles');
        return result;
    }

    static async createRole(name) {
        const [result] = await db.query('INSERT INTO roles (name) VALUES (?)', [name]);
        return result.insertId; 
    }
}

module.exports = Roles;
