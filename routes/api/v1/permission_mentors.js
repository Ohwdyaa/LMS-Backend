const express = require("express");
const {
  updatePermissionMentor,
  getPermissionMentorByRole,
} = require("../../../controllers/permission_mentors");
const router = express.Router();
const {
  validateMiddleware,
  permissionSchema,
} = require("../../../middlewares/validate");

router.put(
  "/permissionMentor/:id",
  validateMiddleware(permissionSchema),
  updatePermissionMentor
);

router.get("/permissionMentor/:id", getPermissionMentorByRole);

module.exports = router; 
