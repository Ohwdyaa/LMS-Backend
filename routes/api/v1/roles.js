const express = require("express");
const {
  createRoles,
  getAllRoles,
  getRoleById,
  updateRoles,
  deleteRoles,
} = require("../../../controllers/roles");
const router = express.Router();
const {
  validateMiddleware,
  roleSchema,
  updateRoleSchema,
  deleteRoleSchema,
} = require("../../../middlewares/validate");

router.post("/role", validateMiddleware(roleSchema), createRoles);
router.get("/role/:id", getRoleById); // remove
router.get("/role", getAllRoles);
router.put("/role/:id", validateMiddleware(updateRoleSchema), updateRoles);
router.delete("/role/:id", validateMiddleware(deleteRoleSchema), deleteRoles);

module.exports = router;
