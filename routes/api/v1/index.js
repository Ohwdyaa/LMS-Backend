const express = require("express");
const router = express.Router();

const userRoutes = require("./users");
const forgetPasswordRoutes = require("./forgot_password");
const roleRoutes = require("./roles");
const religionRoutes = require("./religions");
const genderRoutes = require("./genders");
const modulePermission = require("./module");
const moduleCategory = require("./category_module");
const courseCategory = require("./category_course");
const permissions = require("./permissions");

router.use(userRoutes);
router.use(forgetPasswordRoutes);
router.use(roleRoutes);
router.use(religionRoutes);
router.use(genderRoutes);
router.use(modulePermission);
router.use(moduleCategory);
router.use(courseCategory);
router.use(permissions);


module.exports = router;
