const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    content: {
        type: String,
        required: true,
        maxLength: 1000,
    },
    created: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
});

const CustomerSupportSchema = mongoose.Schema({
    orderId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    messages: [ MessageSchema ],
});

module.exports = mongoose.model('Customer-Support', CustomerSupportSchema);
