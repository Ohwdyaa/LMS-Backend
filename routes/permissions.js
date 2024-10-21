const express = require("express");
const {
  updatePermissionHandler,
  getAllPermissionHandler
} = require("../controllers/permissions");
const router = express.Router();

router.get("/permission", getAllPermissionHandler);
router.put("/permission", updatePermissionHandler);
module.exports = router;