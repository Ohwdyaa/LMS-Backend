const { lmsManagement } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const Users = require("../models/users");

const Genders = {
  createGender: async (genderData, creatorEmail) => {
    try {
      const creator = await Users.getUserByEmail(creatorEmail);
      if(creator === undefined || creator=== null){
        throw new Error ('Creator not found');
      }
      creatorId = creator.id;
      creatorUsername = creator.username;
  
      
      const id = uuid();
      const result = await lmsManagement(
        `
        INSERT INTO genders (
        id,
        name,
        created_by
        ) VALUES (?,?,?)`,
        [id, genderData.name, creatorId]
      );
      console.log("gender created : ", {
        id, 
        name : genderData.name,
        created_by : creatorId,
        created_by_username : creatorUsername,
       });
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllGenders: async () => {
    try {
      const result = await lmsManagement(" SELECT name FROM genders");
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Genders;
