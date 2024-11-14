const express = require("express");
const router = express.Router();

const userRoutes = require("./users");
const forgetPasswordRoutes = require("./forgot_password");
const roleRoutes = require("./roles");
const religionRoutes = require("./religions");
const genderRoutes = require("./genders");
const modulePermission = require("./module");
const moduleCategory = require("./category_module");
const permissions = require("./permissions");
const course = require("./course");
const subCategory = require("./sub_category");
const categoryCourse = require("./category_course");
const modulesCourse = require("./modules_course");
const contentType = require("./content_types");
const subModuleCourse = require("./sub_modules_course");
const materials = require("./materials");
const enrollment = require("./enrollment");

router.use(userRoutes);
router.use(forgetPasswordRoutes);
router.use(roleRoutes);
router.use(religionRoutes);
router.use(genderRoutes);

router.use(modulePermission);
router.use(moduleCategory);
router.use(permissions);

router.use(course);
router.use(modulesCourse);
router.use(categoryCourse);
router.use(subCategory);
router.use(subModuleCourse);
router.use(contentType);
router.use(materials);
router.use(enrollment);

module.exports = router;