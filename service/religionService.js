const Religions = require("../models/religions");
const { CustomError, errors } = require("../utils/customError");

async function createReligion(religionData) {
    try {
        const religionId = await Religions.createReligion(religionData);
        return religionId;
    } catch (error) {
        throw new CustomError(
            errors.failedReligion.message,
            errors.failedReligion.statusCode
        );
    }
}

module.exports = {
    createReligion,
}