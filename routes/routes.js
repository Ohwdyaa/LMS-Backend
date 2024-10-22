const express = require("express");
const router = express.Router();
const { passport } = require("../middlewares/auth");

const userRoutes = require("./route/users");
const forgetPasswordRoutes = require("./route/forgot_password");
const roleRoutes = require("./route/roles");
const religionRoutes = require("./route/religions");
const genderRoutes = require("./route/genders");
const modulePermission = require("./route/module_permission");
const moduleCategory = require("./route/module_category");
const permissions = require("./route/permissions");

router.use("/", userRoutes);
router.use("/", passport.authenticate("jwt", { session: false }), forgetPasswordRoutes);
router.use("/", passport.authenticate("jwt", { session: false }), roleRoutes);
router.use("/", passport.authenticate("jwt", { session: false }), religionRoutes);
router.use("/", passport.authenticate("jwt", { session: false }), genderRoutes);
router.use("/", passport.authenticate("jwt", { session: false }), modulePermission);
router.use("/", passport.authenticate("jwt", { session: false }), moduleCategory);
router.use("/", passport.authenticate("jwt", { session: false }), permissions);

module.exports = router;