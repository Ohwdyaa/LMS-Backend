const jwt = require('jsonwebtoken')
const { errorResponse, unauthorizedResponse } = require('../utils/response.js');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if(!token){
        return unauthorizedResponse(res, 'No token provided');
    }
    
    try {
        const decode = jwt.verify(token.split('')[1], process.env.JWT_SECRET)
        req.user = decode;
        next();
    } catch (err) {
        return errorResponse(res, 'Unauthorized', 401);
    }
};

const checkRoles = (roles) => {
    return async (req, res, next) => {
        const userId = req.user.userId;
        const user = await user.getUserById(userId);

        if(!user){
            return errorResponse(res, 'User not found', 404);
        }
        if(roles.includes(user.role)){
            next();
        }else{
            return unauthorizedResponse(res, 'Access forbidden: Role not allowed')
        }
    };
};

module.exports={
    verifyToken,
    checkRoles
}