const jsonResponse = require('../utility/responseJsonUtil');

const Product = require('../models/products');

const newProduct = async(req, res) => {
    const { name, price, description } = req.body;
    if (!name && !price && !description)
        return res.status(400).json(jsonResponse.success('Bad request'));

    await Product.create({ name, price, description });

    res.status(201).json(jsonResponse.success('The product has been created successfully'));
};

module.exports = {
    newProduct,
};
