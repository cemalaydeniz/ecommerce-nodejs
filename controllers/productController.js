const jsonResponse = require('../utility/responseJsonUtil');

const Product = require('../models/products');

const newProduct = async(req, res) => {
    const { name, price, description } = req.body;
    if (!name && !price && !description)
        return res.status(400).json(jsonResponse.success('Bad request'));

    await Product.create({ name, price, description });

    res.status(201).json(jsonResponse.success('The product has been created successfully'));
};

const getProduct = async(req, res) => {
    const { id } = req.params;
    if (!id)
        return res.status(400).json(jsonResponse.success('Bad request'));

    const product = await Product.findOne({ _id: id });
    if (!product)
        return res.status(404).json(jsonResponse.error('Product not found'));

    res.status(200).json(jsonResponse.data(product));
};

module.exports = {
    newProduct,
    getProduct,
};