const db = require('../config/db/db')

class Genders{
    constructor(id, name){
        this.id = id;
        this.name = name;
    }
    static async getGenderById(genderId) {
        try {
            const [result] = await db.query('SELECT * FROM genders WHERE id = ?', [genderId]);
            if (result.length === 0) {
                return null;
            }
            return result[0];
        } catch (error) {
            throw new Error('Database error');
        }
    }
}

module.exports = Genders;