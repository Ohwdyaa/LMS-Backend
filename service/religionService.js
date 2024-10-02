const Religions = require("../models/religions");
const { CustomError, err } = require("../utils/customError");

async function createReligion(religionData) {
    try {
        const religionId = await Religions.createReligion(religionData);
        return religionId;
    } catch (error) {
        throw new CustomError(
            err.failedReligion.message,
            err.failedReligion.statusCode
        );
    }
}

module.exports = {
    createReligion,
}