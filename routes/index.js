const express = require("express");
const router = express.Router();
const { passport } = require("../middlewares/auth");

const authV1 = require("./api/v1/auth");
const apiV1 = require("./api/v1");

// auth route
router.use(authV1);

router.use(passport.authenticate("jwt", { session: false }), apiV1);

module.exports = router;
