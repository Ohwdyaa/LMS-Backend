const Users = require("../models/users");
const { hashPassword } = require("../utils/bcrypt");
const { err } = require("../utils/custom_error");

async function createUsers(req, res) {
  const data = req.body; 
  const { id: userId } = req.user;
  try {
    const password = "112233";
    const hash = await hashPassword(password);
    const userData = {
      ...data,
      password: hash,
    };
    await Users.createUser(userData, userId);

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(err.errorCreate.statusCode).json({
      message: err.errorCreate.message,
      error: error.message,
    });
  }
}

async function updateUsers(req, res) {
  const { id: userId } = req.user; //dari jwt
  const userData = req.body;
  try {
    const isUserExists = await Users.getUserById(userId);
    if (isUserExists === undefined) {
      return res.status(400).json({ message: "User not found" });
    }

    await Users.updateUser(isUserExists.id, userData);
    return res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
      error: error.message,
    });
  }
}

async function deleteUsers(req, res) {
  const { id: userId } = req.params;
  try {
    const isUserExists = await Users.getUserById(userId);
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

async function getUsersByRole(req, res) {
  const { id: roleId } = req.params;
  try {
    const isUsersExist = await Users.getUserByRole(roleId);
    if (isUsersExist === undefined) {
      return res.status(400).json({ message: "Users not found" });
    }
    return res.status(200).json({
      data: isUsersExist,
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
  getUsersByRole
};
