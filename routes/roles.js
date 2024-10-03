const express = require("express");
const {
  createRoleHandler,
  getRoleByIdHandler,
  getAllRolesHandler,
  deleteRoleHandler,
} = require("../controllers/roles");
const router = express.Router();

router.post("/role", createRoleHandler);
router.get("/role/:id", getRoleByIdHandler);
router.get("/role", getAllRolesHandler);
router.delete("/role/:id", deleteRoleHandler);

module.exports = router;
