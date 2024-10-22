const express = require("express");
const {
  createRoles,
  getAllRoles,
  getRoleById,
  updateRoles,
  deleteRoles,
} = require("../../controllers/roles");
const router = express.Router();

router.post("/role", createRoles);
router.get("/role/:id", getRoleById);
router.get("/role", getAllRoles);
router.put("/role/:id", updateRoles);
router.delete("/role/:id", deleteRoles);

module.exports = router;
