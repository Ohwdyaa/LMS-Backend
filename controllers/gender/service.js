const Genders = require("../../models/genders");
const { CustomError, errors } = require("../../utils/customError");

async function createGender(genderData) {
    try {
        const{name} = genderData;
        const genderId = await Genders.createGender(genderData);
        return genderId;
    } catch (error) {
        throw new CustomError(
            errors.failedGender.message,
            errors.failedGender.statusCode
        );
    }
}

module.exports = {
    createGender,
}