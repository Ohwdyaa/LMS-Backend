const { lmsModule } = require("../config/db/db");
const { uuid } = require("../utils/tools");
const Users = require("../models/users");

const moduleCategory = {
  createCategory: async (data, creatorEmail) => {
    try {
      const creator = await Users.getUserByEmail(creatorEmail);
      if(creator === undefined || creator=== null){
        throw new Error ('Creator not found');
      }
      creatorId = creator.id;
      creatorUsername = creator.username;
  
      const id = uuid();
      const result = await lmsModule(
        `INSERT INTO category_module(
          uuid, 
          name,
          created_by
        ) 
        VALUES (?,?,?)`,
        [id, data.name, creatorId]
      );
      console.log("category modul created : ", {
        id, 
        name : data.name,
        created_by : creatorId,
        created_by_username : creatorUsername,
       });
      return result;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = moduleCategory;