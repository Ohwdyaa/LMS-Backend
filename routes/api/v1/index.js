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
const subCategories = require("./sub_category");
const categories = require("./category_course");

router.use(userRoutes);
router.use(forgetPasswordRoutes);
router.use(roleRoutes);
router.use(religionRoutes);
router.use(genderRoutes);

router.use(modulePermission);
router.use(moduleCategory);
router.use(permissions);

router.use(course);
router.use(categories);
router.use(subCategories);

module.exports = router;
