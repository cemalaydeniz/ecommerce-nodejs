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
        res.status(500).json(jsonResponse.error(error.message));
    }
};

const authenticateRole = (...roles) => {
    return (req, res, next) => {
        try {
            for (const element of roles) {
                if (req.user.roles.includes(element))
                    continue;

                return res.status(403).json(jsonResponse.error('Forbidden'));
            }

            next();
        }
        catch (error) {
            res.status(500).json(jsonResponse.error(error.message));
        }
    };
};

module.exports = {
    authenticateUser,
    authenticateRole,
};
