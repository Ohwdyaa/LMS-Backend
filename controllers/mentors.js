const Mentors = require("../models/mentors");
const Enrollments = require("../models/enrollments");
const { hashPassword } = require("../utils/bcrypt");
const { err } = require("../utils/custom_error");

async function createMentor(req, res) {
  try {
    const { id: userId } = req.user;
    const { email } = req.body;
    const { contract, cv, profileImage } = req.files;

    const isUserExist = await Mentors.getMentorByEmail(email);
    if (isUserExist) {
      let message;
      if (isUserExist.email.toLowerCase() === email.toLowerCase()) {
        message = "Email already registered";
      }
      return res.status(400).json({
        message,
      });
    }

    // create file url
    const contractUrl = contract
      ? `${req.protocol}://${req.get("host")}/uploads/docs-mentors/${
          contract[0].filename
        }`
      : "";
    const cvUrl = cv
      ? `${req.protocol}://${req.get("host")}/uploads/docs-mentors/${
          cv[0].filename
        }`
      : "";
    const profileImageUrl = profileImage
      ? `${req.protocol}://${req.get("host")}/uploads/profile-mentors/${
          profileImage[0].filename
        }`
      : "";

    const password = "112233";
    const hash = await hashPassword(password);
    const data = {
      ...req.body,
      password: hash,
      contract: contractUrl,
      cv: cvUrl,
      profileImage: profileImageUrl,
    };

    await Mentors.createMentor(data, userId);

    return res.status(201).json({
      message: "Mentor created successfully",
    });
  } catch (error) {
    return res.status(err.errorCreate.statusCode).json({
      message: error.message,
      error: err.errorCreate.message,
    });
  }
}

async function updateMentor(req, res) {
  try {
    const { id: userId } = req.user;
    const { id: mentorId } = req.params;
    const { contract, cv, profileImage } = req.files;

    const isUserExist = await Mentors.getMentorDetails(mentorId);
    if (isUserExist === undefined) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const contractUrl = contract
      ? `${req.protocol}://${req.get("host")}/uploads/docs-mentors/${
          contract[0].filename
        }`
      : isUserExist.contract;
    const cvUrl = cv
      ? `${req.protocol}://${req.get("host")}/uploads/docs-mentors/${
          cv[0].filename
        }`
      : isUserExist.cv;
    const profileImageUrl = profileImage
      ? `${req.protocol}://${req.get("host")}/uploads/profile-mentors/${
          profileImage[0].filename
        }`
      : isUserExist.profileImage;

    const data = {
      ...req.body,
      contract: contractUrl,
      cv: cvUrl,
      profileImage: profileImageUrl,
    };

    await Mentors.updateMentor(isUserExist.id, data, userId);
    return res.status(200).json({
      message: "Mentor updated successfully",
    });
  } catch (error) {
    return res.status(err.errorUpdate.statusCode).json({
      message: error.message,
      error: err.errorUpdate.message,
    });
  }
}

async function deleteMentor(req, res) {
  try {
    const { id: userId } = req.user;
    const { id: mentorId } = req.params;

    const isUserExist = await Mentors.getMentorById(mentorId);
    if (isUserExist === undefined) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    await Mentors.softDeleteMentor(isUserExist.id, userId);
    await Enrollments.unEnrollByMentor(isUserExist.id, userId);
    return res.status(200).json({
      message: "Mentor deleted successfully",
    });
  } catch (error) {
    return res.status(err.errorDelete.statusCode).json({
      message: error.message,
      error: err.errorDelete.message,
    });
  }
}

async function getAllMentors(req, res) {
  try {
    const mentors = await Mentors.getAllMentors();
    if (mentors.length === 0) {
      return res.status(404).json({ message: "Mentors not found" });
    }
    return res.status(200).json({
      data: mentors,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

async function getMentorBySubCategory(req, res) {
  try {
    const { id: subCategoryId } = req.params;

    const isSubCategoryExist = await Mentors.getMentorsBySubCategory(
      subCategoryId
    );
    if (isSubCategoryExist === undefined) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    return res.status(200).json({
      data: isSubCategoryExist,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

async function getMentorDetail(req, res) {
  try {
    const { id: mentorId } = req.params;

    const isUserExist = await Mentors.getMentorDetails(mentorId);
    if (isUserExist === undefined) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    const { password, ...mentorDetails } = isUserExist;
    return res.status(200).json({
      data: mentorDetails,
    });
  } catch (error) {
    return res.status(err.errorSelect.statusCode).json({
      message: error.message,
      error: err.errorSelect.message,
    });
  }
}

module.exports = {
  createMentor,
  updateMentor,
  deleteMentor,
  getAllMentors,
  getMentorBySubCategory,
  getMentorDetail,
};
