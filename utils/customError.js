class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const errorMessages = {
    invalidEmail: { 
        message: 'Invalid email format', 
        statusCode: 400 
    },
    requiredEmailPassword: { 
        message: 'Email and password are required', 
        statusCode: 400 
    },
    requiredTokenRefresh: { 
        message: 'Refresh token is required', 
        statusCode: 400 
    },
    invalidTokenRefresh: { 
        message: 'Invalid refresh token', 
        statusCode: 400 
    },
    invalidPassword: { 
        message: 'Invalid password', 
        statusCode: 400 
    },
    unauthorized: { 
        message: 'Unauthorized access', 
        statusCode: 401
    },
    userNotFound: { 
        message: 'User not found', 
        statusCode: 404 
    },
    internalServerError: { 
        message: 'Internal Server Error', 
        statusCode: 500 
    },
    notFound: { 
        message: 'Resource not found', 
        statusCode: 404 
    },
    roleGenderReligionNotFound: { 
        message: 'Invalid role, gender, or religion ID', 
        statusCode: 404 
    },
    roleNotFound:{ 
        message: 'invalid role', 
        statusCode: 400
    },
    genderNotFound:{ 
        message: 'invalid gender', 
        statusCode: 400
    },
    religionNotFound:{ 
        message: 'invalid religion', 
        statusCode: 400
    },
    emailAlready:{ 
        message: 'Email is already registered. Please use another email', 
        statusCode: 409
    },
    failedCreate:{ 
        message: 'Failed to create user', 
        statusCode: 500
    },
    incorrectPass:{ 
        message: 'Incorrect password', 
        statusCode: 401
    },
    updatePass:{ 
        message: 'Password needs to be updated. Please contact administrator', 
        statusCode: 400
    },
};

module.exports = { CustomError, errorMessages };
