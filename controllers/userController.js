require('dotenv').config();

const jsonResponse = require('../utility/responseJsonUtil');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const timeUtil = require('../utility/timeUtil');

const User = require('../models/user');

//~ Begin - Login-Register APIs
const register = async(req, res) => {
    const { name, email, password, phone, address } = req.body;

    if (typeof password !== 'string')
        return res.status(400).json(jsonResponse.error('Wrong parameter'));
    if (password.length < 6 || password.length > 128)
        return res.status(400).json(jsonResponse.error('The password must be between 6 and 128 characters'));

    // The password must include at least a number and a character
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z]).+$/;
    if (!passwordRegex.test(password))
        return res.status(400).json(jsonResponse.error('The password must include at least a number and a character'));

    const emailExists = await User.findOne({ emailAddress: email });
    if (emailExists)
        return res.status(400).json(jsonResponse.error('This email address already exists'));

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
        return res.status(400).json(jsonResponse.error(error.message));
    }

    res.status(201).json(jsonResponse.success('The user has been created successfully'));
};

const login = async(req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ emailAddress: email });
    if (!user)
        return res.status(404).json(jsonResponse.error('The email address or the password is wrong'));

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
        return res.status(401).json(jsonResponse.error('The email address or the password is wrong'));

    const token = jwt.sign({ "id": user._id, "email": user.emailAddress, "roles": user.roles }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_LIFESPAN });

    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + timeUtil.returnTimeInMilliseconds(24, 0, 0)),
        secure: true,
        signed: true,
    });

    res.status(200).json(jsonResponse.data({'token': token}));
};

const logout = async(req, res) => {
    res.cookie('token', 'logged out', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000),
    });

    res.status(200).json(jsonResponse.success('Successfully logged out'));
};
//~ End


//~ Begin -Profile APIs
const updateProfile = async(req, res) => {
    const { name, address } = req.body;

    const user = await User.findById(req.user.id);
    if (!user)
        return res.status(404).json(jsonResponse.error('User not found'));

    if (!name && !address)
        return res.status(200).json(jsonResponse.success('No changes were made'));

    if (name) user.name = name;
    if (address) user.address = address;
    await user.save();

    res.status(200).json(jsonResponse.success('The profile has been updated'));
};
//~ End


module.exports = {
    register,
    login,
    logout,
    
    updateProfile,
};
