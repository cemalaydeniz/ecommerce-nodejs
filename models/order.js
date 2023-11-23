const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    userId: mongoose.SchemaTypes.ObjectId,
    productId: mongoose.SchemaTypes.ObjectId,
    quantity: {
        type: Number,
        min: 1,
        validate: {
            validator: Number.isInteger,
            message: 'The quantity is not an integer'
        },
    }
});

module.exports = mongoose.model('Order', OrderSchema);
