const express = require("express");
const {
  createReligionHandler,
  updateReligionHandler,
  deleteReligionHandler,
  getReligionByIdHandler,
  getAllReligionsHandler,
} = require("../controllers/religions");
const router = express.Router();

router.post("/religion", createReligionHandler);
router.put("/religion/:id", updateReligionHandler);
router.delete("/religion/:id", deleteReligionHandler);
router.get("/religion/:id", getReligionByIdHandler);
router.get("/religion", getAllReligionsHandler);

module.exports = router;
