require('dotenv').config();

const jsonResponse = require('../utility/responseJsonUtil');
const jwt = require('jsonwebtoken');

const authenticateUser = async(req, res, next) => {
    try {
        const token = req.signedCookies.token;
        const { id, email, roles } = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = { id, email, roles };
        
        next();
    }
    catch (error) {
        res.status(401).json(jsonResponse.generateErrorResponse('Unauthorized'));
    }
};

const authenticateRole = async(...roles) => {
    if (!roles.includes(req.user.roles))
        return res.status(403).json(jsonResponse.generateErrorResponse('Forbidden'));

    next();
};

module.exports = {
    authenticateUser,
    authenticateRole,
};
