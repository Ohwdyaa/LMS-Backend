const express = require("express");
const { createRoleHandler, getRoleByIdHandler, getAllRolesHandler } = require("../controllers/rolesHandler");
const router = express.Router();

router.post("/role", createRoleHandler);
router.get("/role/:id", getRoleByIdHandler);
router.get("/role", getAllRolesHandler);


module.exports = router;