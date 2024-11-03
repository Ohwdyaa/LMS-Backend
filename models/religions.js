const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const Users = require("../models/users");

const Religions = {
  createReligion: async (data, creatorEmail) => {
    try {
      const creatorReligion = await Users.getUserByEmail(creatorEmail);
      if(creatorReligion === undefined || creatorReligion === null){
        throw new Error ('Creator not found');
      }
      creatorId = creatorReligion.id;
      creatorUsername = creatorReligion.username;
  
      const id = uuid();
      const result = await lmsManagement(
        `
        INSERT INTO religions (
        id,
        name,
        created_by
        ) VALUES (?,?,?)`,
        [id, data.name, creatorId]
      );
      console.log("religion created : ", {
        id, 
        name : data.name,
        created_by : creatorId,
        created_by_username : creatorUsername,
       });
      return result.insertId;
      }catch (error) {
        console.error("Error creating religion:", error.message);
        throw error;
      }
    
    // } catch (error) {
    //   throw error;
    // }
  },
  getAllReligion: async () => {
    try {
      const result = await lmsManagement("SELECT name FROM religions WHERE is_deleted = 0");
      return result;
    } catch (error) {
      throw error;
    }
  },
};
module.exports = Religions;