const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    roles: {
        type: [String],
        default: ['user'],
    },
    name: {
        type: String,
        required: true,
        index: true,        // If the users/customers are searched by their names often
        minLength: 3,
        maxLength: 50,
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: props => `${props.value} is not a valid email address`
        },
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        maxLength: 15
    },
    address: {
        type: String,
        maxLength: 255,
    },
    createdAt : {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    }
});

module.exports = mongoose.model('User', UserSchema);
