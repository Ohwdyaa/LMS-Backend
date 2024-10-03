const {
  createReligion,
  updateReligion,
  deleteReligion,
  getAllReligions,
  getReligionById,
} = require("../validate/religions");
const { err } = require("../utils/customError");

async function createReligionHandler(req, res) {
  try {
    const religionData = req.body;

    const religionsId = await createReligion(religionData);
    return res.status(201).json({
      message: "Religion created successfully",
      data: { religionsId },
    });
  } catch (error) {
    console.error("Error in createReligionHandler:", error);
    return res.status(err.internalServerError.statusCode).json({
      message: err.internalServerError.message,
    });
  }
}
async function getReligionByIdHandler(req, res) {
  const { id } = req.params;
  try {
    const religion = await getReligionById(id);
    return res.status(200).json(religion);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}
async function getAllReligionsHandler(req, res) {
  try {
    const religionAll = await getAllReligions();
    return res.status(200).json({
      data: religionAll,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}
async function updateReligionHandler(req, res) {
  const { id: religionId } = req.params;
  const religionUpdate = req.body;
  try {
    const result = await updateReligion(religionId, religionUpdate);
    return res.status(200).json({
      message: "Religion updated successfully",
      result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

async function deleteReligionHandler(req, res) {
  const religionId = req.params.id;
  try {
    await deleteReligion(religionId);
    return res.status(200).json({
      message: "Religion deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  createReligionHandler,
  getReligionByIdHandler,
  getAllReligionsHandler,
  updateReligionHandler,
  deleteReligionHandler,
};
