const express = require("express");
const router = express.Router();

const upload = require("./upload");

const teams = require("./teams");
const roleTeams = require("./role_teams");
const mentors = require("./mentors");
const roleMentors = require("./role_mentors");
// const mentees = require("./mentees");
const forgetPassword = require("./forgot_password");
const religionRoutes = require("./religions");
const genderRoutes = require("./genders");

const categoryPermission = require("./category_permissions");
const modulePermission = require("./module_permissions");
const permissionTeams = require("./permission_teams");
const permissionMentors = require("./permission_mentors");

const categories = require("./categories");
const subCategory = require("./sub_categories");

const enrollments = require("./enrollments");
const courses = require("./courses");
const moduleCourses = require("./module_courses");
const subModuleCourses = require("./sub_module_courses");
const contentTypes = require("./content_types");
const materials = require("./materials");
const quizzes = require("./quiz");
const levels = require("./levels");

router.use(upload);

router.use(teams);
router.use(roleTeams);
router.use(mentors);
router.use(roleMentors);
// router.use(mentees);
router.use(forgetPassword);
router.use(religionRoutes);
router.use(genderRoutes);

router.use(categoryPermission);
router.use(modulePermission);
router.use(permissionTeams);
router.use(permissionMentors);

router.use(categories);
router.use(subCategory);

router.use(enrollments);
router.use(courses);
router.use(moduleCourses);
router.use(subModuleCourses);
router.use(contentTypes);
router.use(materials);
router.use(quizzes);
router.use(levels);

module.exports = router;