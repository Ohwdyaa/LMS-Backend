const Users = require("../models/users");
const { hashPassword } = require("../utils/bcrypt");
const { err } = require("../utils/custom_error");


async function createUsers(req, res) {
  const data = req.body;
  try {
    const createdByEmail = req.user.email;
    const password = "admin12345"; 
    const hash = await hashPassword(password);
    
    const userData = {
      ...data,
      password: hash,
    };
    const result = await Users.createUser(userData, createdByEmail);
    return res.status(201).json({
      message: "User created successfully",
      createdUserId: result.userId,        
      createdById: result.createdById,         
      createdByUsername: result.createdByUsername,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
}

async function updateUsers(req, res) {
  const { email: userEmail } = req.user; 
  const userData = req.body;

  try {
    const updatedUser = await Users.updateUser(userEmail, userData); 
    return res.status(200).json({
      message: "User updated successfully",
      updatedUser,        
      updatedByUsername:userEmail,
    });
  } catch (error) {
    console.error(error); 
    return res.status(500).json({
      message: "An error occurred while updating user",
      error: error.message,
    });
  }
}

async function deleteUsers(req, res) {
  const {id: userId} = req.params;
  try {
    const isUserExists = await Users.getUserById(userId);
    console.log(isUserExists)
    if (isUserExists === undefined) {
      return res.status(400).json({ message: "User not found" });
    }

    await Users.deleteUser(isUserExists.id);
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) { 
    return res.status(err.errorDelete.statusCode).json({
      message: err.errorDelete.message,
      error: error.message,
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await Users.getAllUser();
    if (!users || users.length === 0) {
      return res.status(400).json({ message: "No users found" });
    }
    const userList = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const userObj = new Object();
      userObj.id = user.id;
      userObj.username = user.username;
      userObj.email = user.email;
      userObj.fullname = user.fullname;
      userObj.roleId = user.role_id;
      userObj.role = user.role;
      userList.push(userObj);
    }
    return res.status(200).json({
      data: userList,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}

module.exports = {
  createUsers,
  updateUsers,
  deleteUsers,
  getAllUsers,
};