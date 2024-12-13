const Mentors = require("../models/mentors");
const Enrollments = require("../models/enrollments");
const { hashPassword } = require("../utils/bcrypt");
const { err } = require("../utils/custom_error");

async function createMentor(req, res) {
  const { email, username } = req.body;
  const { npwp, contract, cv, profileImage } = req.files;
  const { id: userId } = req.user;
  try {
    const isUserExist = await Mentors.getMentorByUsernameAndEmail(
      username,
      email
    );

    if (isUserExist) {
      let message;
      if (isUserExist.email.toLowerCase() === email.toLowerCase()) {
        message = "Email already registered";
      } else if (
        isUserExist.username.toLowerCase() === username.toLowerCase()
      ) {
        message = "Username already registered";
      }
      return res.status(400).json({
        message,
      });
    }

    // create file url
    const npwpUrl = npwp
      ? `${req.protocol}://${req.get("host")}/uploads/profile-mentors/${
          npwp[0].filename
        }`
      : "";
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
    const mentorData = {
      ...req.body,
      password: hash,
      npwp: npwpUrl,
      contract: contractUrl,
      cv: cvUrl,
      profileImage: profileImageUrl,
    };

    await Mentors.createMentor(mentorData, userId);

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
  const { id: userId } = req.user;
  const { id: mentorId } = req.params;
  const { username, email } = req.body;
  const { npwp, contract, cv, profileImage } = req.files;

  try {
    const isMentorUsernameOrEmailDuplicate =
      await Mentors.getMentorByUsernameAndEmail(username, email, mentorId);

    if (isMentorUsernameOrEmailDuplicate) {
      let message;
      if (
        isMentorUsernameOrEmailDuplicate.email.toLowerCase() ===
        email.toLowerCase()
      ) {
        message = "Email already registered";
      } else if (
        isMentorUsernameOrEmailDuplicate.username.toLowerCase() ===
        username.toLowerCase()
      ) {
        message = "Username already registered";
      }
      return res.status(400).json({
        message,
      });
    }

    const isMentorExists = await Mentors.getMentorDetails(mentorId);

    // create file url
    const npwpUrl = npwp
      ? `${req.protocol}://${req.get("host")}/uploads/docs-mentors/${
          npwp[0].filename
        }`
      : isMentorExists.npwp;
    const contractUrl = contract
      ? `${req.protocol}://${req.get("host")}/uploads/docs-mentors/${
          contract[0].filename
        }`
      : isMentorExists.contract;
    const cvUrl = cv
      ? `${req.protocol}://${req.get("host")}/uploads/docs-mentors/${
          cv[0].filename
        }`
      : isMentorExists.cv;
    const profileImageUrl = profileImage
      ? `${req.protocol}://${req.get("host")}/uploads/profile-mentors/${
          profileImage[0].filename
        }`
      : isMentorExists.profileImage;

    if (isMentorExists === undefined) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const mentorData = {
      ...req.body,
      npwp: npwpUrl,
      contract: contractUrl,
      cv: cvUrl,
      profileImage: profileImageUrl,
    };

    await Mentors.updateMentor(isMentorExists.id, mentorData, userId);

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
  const { id: mentorId } = req.params;
  const { id: userId } = req.user;
  try {
    const isMentorExists = await Mentors.getMentorById(mentorId);
    if (isMentorExists === undefined) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    await Mentors.softDeleteMentor(isMentorExists.id, userId);
    await Enrollments.unEnrollByMentor(isMentorExists.id, userId);

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
    if (!mentors || mentors.length === 0) {
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
  const { id: subCategoryId } = req.params;
  try {
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

async function getMentorById(req, res) {
  const { id: mentorId } = req.params;
  try {
    const isMentorExist = await Mentors.getMentorDetails(mentorId);
    if (isMentorExist === undefined) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    const { password, ...mentorDetails } = isMentorExist;
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
  getMentorById,
};
