const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,        // If the products are searched by their names often
    },
    price: {
        type: Number,
        required: true,
    },
    description: String,
});

module.exports = mongoose.model(ProductSchema);
