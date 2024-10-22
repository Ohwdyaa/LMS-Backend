const express = require("express");
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} = require("../controllers/roles");
const router = express.Router();

router.post("/role", createRole);
router.get("/role/:id", getRoleById);
router.get("/role", getAllRoles);
router.put("/role/:id", updateRole);
router.delete("/role/:id", deleteRole);

module.exports = router;
