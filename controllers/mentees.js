const Mentees = require("../models/mentees");
const { hashPassword } = require("../utils/bcrypt");

async function createMentee(req, res) {
  try {
    const { id: userId } = req.user;
    const data = req.body;
    const password = "112233";

    const isUserExist = await Mentees.getMenteeByUsernameAndEmail(
      data.username,
      data.email
    );
    if (isUserExist) {
      let message;
      if (isUserExist.email.toLowerCase() === data.email.toLowerCase()) {
        message = "Email already registered";
      } else if (
        isUserExist.username.toLowerCase() === data.username.toLowerCase()
      ) {
        message = "Username already registered";
      }
      return res.status(400).json({
        message,
      });
    }
    const hash = await hashPassword(password);
    const userData = {
      ...data,
      password: hash,
    };
    await Mentees.createMentee(userData, userId);
    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}
module.exports = {
  createMentee,
};
