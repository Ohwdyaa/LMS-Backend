const express = require("express");
const {
  createRoles,
  getAllRoles,
  deleteRoles,
  changeUserRoles,
} = require("../../../controllers/roles");
const router = express.Router();
const {
  validateMiddleware,
  roleSchema,
  deleteRoleSchema,
  changeRoleSchema,
} = require("../../../middlewares/validate");

router.post("/role", validateMiddleware(roleSchema), createRoles); 
router.get("/role", getAllRoles);
router.delete("/role/:id", validateMiddleware(deleteRoleSchema), deleteRoles);
router.put("/user/:id", validateMiddleware(changeRoleSchema), changeUserRoles);

module.exports = router;