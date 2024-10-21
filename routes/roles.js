const express = require("express");
const {
  createRole,
  getAllRoles,
  getRoleById,
  deleteRole,
} = require("../controllers/roles");
const router = express.Router();

router.post("/role", createRole);
router.delete("/role/:id", deleteRole);
router.get("/role/:id", getRoleById);
router.get("/role", getAllRoles);

module.exports = router;
