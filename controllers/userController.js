const jsonResponse = require('../utility/responseJsonUtil');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const register = async(req, res) => {
    const { name, email, password, phone, address } = req.body;

    if (typeof password !== 'string')
        return res.status(400).json(jsonResponse.generateErrorResponse('Wrong parameter'));
    if (password.length < 6 || password.length > 128)
        return res.status(400).json(jsonResponse.generateErrorResponse('The password must be between 6 and 128 characters'));

    const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z]).+$/;
    if (!passwordRegex.test(password))
        return res.status(400).json(jsonResponse.generateErrorResponse('The password must include at least a number and a character'));

    const emailExists = await User.findOne({ emailAddress: email });
    if (emailExists)
        return res.status(400).json(jsonResponse.generateErrorResponse('This email address already exists'));

    const hashedPassword = await bcrypt.hash(password, 6);
    try {
        await User.create({
            name,
            emailAddress: email,
            password: hashedPassword,
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
