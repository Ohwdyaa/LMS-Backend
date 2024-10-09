const express = require("express");
const {
  createRoleHandler,
  deleteRoleHandler,
  getRoleByIdHandler,
  getAllRolesHandler,
  rolePermissionHandler,
} = require("../controllers/roles");
const router = express.Router();

router.post("/role", createRoleHandler);
router.delete("/role/:id", deleteRoleHandler);
router.get("/role/:id", getRoleByIdHandler);
router.get("/role", getAllRolesHandler);
router.post("/permission", rolePermissionHandler);

module.exports = router;
