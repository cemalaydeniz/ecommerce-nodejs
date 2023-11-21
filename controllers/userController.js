const jsonResponse = require('../utility/responseJsonUtil');

const User = require('../models/user');

const register = async(req, res) => {
    const { name, email, phone, address } = req.body;

    const emailExists = await User.findOne({ emailAddress: email });
    if (emailExists) {
        return res.status(400).json(jsonResponse.generateErrorResponse('This email address already exists'));
    }

    try {
        await User.create({
            name,
            emailAddress: email,
            phoneNumber: phone,
            address,
        });
    }
    catch(error) {
        return res.status(400).json(jsonResponse.generateErrorResponse(error.message));
    }

    res.status(201).json(jsonResponse.generateSuccessResponse('The user has been created successfully'));
};

module.exports = {
    register,
};
