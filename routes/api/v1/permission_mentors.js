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
  "/permission-mentor/:id",
  validateMiddleware(permissionSchema),
  updatePermissionMentor
);

router.get("/permission-mentor/:id", getPermissionMentorByRole);

module.exports = router; 
