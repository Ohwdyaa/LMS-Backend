const express = require("express");
const { createSubModules, updateSubModules, deleteSubModules, getAllSubModules } = require("../../../controllers/sub_modules_course");
const router = express.Router();

router.post("/subModule", createSubModules);
router.put("/subModule/:id", updateSubModules);
router.delete("/subModule/:id", deleteSubModules);
router.get("/subModule", getAllSubModules);

module.exports = router;