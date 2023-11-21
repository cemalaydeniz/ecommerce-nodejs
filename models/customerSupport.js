const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    sender: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
        maxLength: 1000,
    },
});

const CustomerSupportSchema = mongoose.Schema({
    senderId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    senderName: {
        type: String,
        required: true,
    },
    messages: [ MessageSchema ],
});

module.exports = mongoose.model('CustomerSupport', CustomerSupportSchema);
