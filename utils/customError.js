class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const errorMessages = {
    invalidEmail: { message: 'Invalid email format', statusCode: 400 },
    invalidPassword: { message: 'Invalid password', statusCode: 401 },
    requiredEmailPassword: { message: 'Email and password are required', statusCode: 400 },
    requiredTokenRefresh: { message: 'Refresh token is required', statusCode: 400 },
    invalidTokenRefresh: { message: 'Invalid refresh token', statusCode: 400 },
    unauthorized: { message: 'Unauthorized access', statusCode: 403 },
    userNotFound: { message: 'User not found', statusCode: 404 },
    internalServerError: { message: 'Internal Server Error', statusCode: 500 },
    notFound: { message: 'Resource not found', statusCode: 404 },
    roleGenderReligionNotFound: { message: 'Invalid role, gender, or religion ID', statusCode: 404 },
    roleNotFound:{ message: 'invalid role', statusCode: 400},
    genderNotFound:{ message: 'invalid gender', statusCode: 400},
    religionNotFound:{ message: 'invalid religion', statusCode: 400},
};

module.exports = { CustomError, errorMessages };
