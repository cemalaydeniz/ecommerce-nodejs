require('dotenv').config();

const jsonResponse = require('../utility/responseJsonUtil');
const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    try {
        const token = req.signedCookies.token;
        const { id, email, roles } = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = { id, email, roles };
        
        next();
    }
    catch (error) {
        res.status(401).json(jsonResponse.error('Unauthorized'));
    }
};

const authenticateRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.roles))
            return res.status(403).json(jsonResponse.error('Forbidden'));

        next();
    };
};

module.exports = {
    authenticateUser,
    authenticateRole,
};
