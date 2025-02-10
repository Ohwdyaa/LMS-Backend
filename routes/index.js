const express = require("express");
const router = express.Router();
const { passport } = require("../middlewares/passport");

const authV1 = require("./api/v1/auth");
const apiV1 = require("./api/v1");

// auth route
router.use(authV1);

router.use(
   passport.authenticate("internal-rule", { session: false }), 
    apiV1);

module.exports = router;
