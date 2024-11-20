const Mentors = require("../models/mentors");
const { hashPassword } = require("../utils/bcrypt");
const { err } = require("../utils/custom_error");

async function createMentor(req, res) {
  const data = req.body;
  const { id: userId } = req.user;
  try {
    const isUserExist = await Mentors.getMentorByEmail(data.email);
    if (isUserExist !== undefined) {
      await Mentors.activeMentor(isUserExist.id, userId);
      return res.status(201).json({
        message: "Mentor is active successfully",
      });
    }  
    if (isExist === undefined) {
      const password = "112233";
      const hash = await hashPassword(password);
      const mentorData = {
        ...data,
        password: hash,
      };
      await Mentors.createMentor(mentorData, userId);
      return res.status(201).json({
        message: "Mentor created successfully",
      });
    }  
  } catch (error) {
    return res.status(err.errorCreate.statusCode).json({
      message: err.errorCreate.message,
      error: error.message,
    });
  }
}

async function updateMentor(req, res) {
  const { id: mentorId } = req.user;
  const data = req.body;
  try {
    const isMentorExists = await Mentors.getMentorById(mentorId);
    if (isMentorExists === undefined) {
      return res.status(400).json({ message: "User not found" });
    }
    await Mentors.updateMentor(isMentorExists.id, data);
    return res.status(200).json({
      message: "Mentor updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: err.errorUpdate.message,
      error: error.message,
    });
  }
}

async function deleteMentor(req, res) {
  const { id: mentorId } = req.params;
  const { id: userId } = req.user; 
  try {
    const isMentorExists = await Mentors.getMentorById(mentorId);
    if (isMentorExists === undefined) {
      return res.status(400).json({ message: "User not found" });
    }

    await Mentors.deleteMentor(isMentorExists.id, userId);
    return res.status(200).json({
      message: "Mentor deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: err.errorDelete.message,
      error: error.message,
    });
  }
}

async function getAllMentors(req, res) {
  try {
    const mentors = await Mentors.getAllMentors();
    if (!mentors || mentors.length === 0) {
      return res.status(400).json({ message: "No mentors found" });
    }
    const mentorList = [];
    for (let i = 0; i < mentors.length; i++) {
      const mentor = mentors[i];
      const mentorObj = new Object();
      mentorObj.id = mentor.id;
      mentorObj.fullname = mentor.fullname;
      mentorObj.username = mentor.username;
      mentorObj.email = mentor.email;
      mentorObj.role = mentor.role;
      mentorObj.subCategory = mentor.subCategory;
      mentorList.push(mentorObj);
    }
    return res.status(200).json({
      data: mentorList,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}

async function getMentorBySubCategory(req, res) {
  const { id: subCategoryId } = req.params;
  try {
    const isSubCategoryExist = await Mentors.getMentorsBySubCategory(
      subCategoryId
    );
    if (isSubCategoryExist === undefined) {
      return res.status(400).json({ message: "Mentor not found" });
    }
    return res.status(200).json({
      data: isSubCategoryExist,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}
async function getMentorById(req, res) {
  const { id: mentorId } = req.params;
  try {
    const isMentorExist = await Mentors.getMentorById(mentorId);
    if (isMentorExist === undefined) {
      return res.status(400).json({ message: "Mentor not found" });
    }
    return res.status(200).json({
      data: isMentorExist,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: err.errorSelect.message,
      error: error.message,
    });
  }
}

module.exports = {
  createMentor,
  updateMentor,
  deleteMentor,
  getAllMentors,
  getMentorBySubCategory,
  getMentorById,
};
