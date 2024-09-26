const db = require('../config/db/db')

class Religions{
    constructor(id, name){
        this.id = id;
        this.name = name;
    }
    static async getReligionById(religionId) {
        try {
            const [result] = await db.query('SELECT * FROM religions WHERE id = ?', [religionId]);
            if (result.length === 0) {
                return null;
            }
            return result[0];
        } catch (error) {
            throw new Error('Database error');
        }
    }
}

module.exports = Religions;