require('dotenv').config();

const jsonResponse = require('../utility/responseJsonUtil');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const timeUtil = require('../utility/timeUtil');

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

const login = async(req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ emailAddress: email });
    if (!user)
        return res.status(404).json(jsonResponse.generateErrorResponse('The email address or the password is wrong'));

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
        return res.status(401).json(jsonResponse.generateErrorResponse('The email address or the password is wrong'));

    const token = jwt.sign({ "id": user._id, "email": user.emailAddress }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_LIFESPAN });

    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + timeUtil.returnTimeInMilliseconds(24, 0, 0)),
        secure: true,
        signed: true,
    });

    res.status(200).json(jsonResponse.generateDataResponse({'token': token}));
};

const logout = async(req, res) => {
    res.cookie('token', 'logged out', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000),
    });

    res.status(200).json(jsonResponse.generateSuccessResponse('Successfully logged out'));
};

module.exports = {
    register,
    login,
    logout,
};
