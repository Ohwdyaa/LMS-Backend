const Genders = require("../models/genders");
const { CustomError, err } = require("../utils/customError");

async function createGender(genderData) {
    try {
        const genderId = await Genders.createGender(genderData);
        return genderId;
    } catch (error) {
        throw new CustomError(
            err.failedGender.message,
            err.failedGender.statusCode
        );
    }
}

module.exports = {
    createGender,
}