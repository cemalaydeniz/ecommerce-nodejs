const jsonResponse = require('../utility/responseJsonUtil');

const Product = require('../models/products');

const newProduct = async(req, res) => {
    const { name, price, description } = req.body;
    if (price && (isNaN(price) || price < 0))
        return res.status(400).json(jsonResponse.error('Bad request'));

    if (!name && !description)
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

const updateProduct = async(req, res) => {
    const { id } = req.params;
    if (!id)
        return res.status(400).json(jsonResponse.success('Bad request'));

    const { name, price, description } = req.body;
    if (price && (isNaN(price) || price < 0))
        return res.status(400).json(jsonResponse.error('Bad request'));

    if (!name && !description)
        return res.status(200).json(jsonResponse.success('No changes were made'));

    const product = await Product.findOne({ _id: id })
    if (!product)
        return res.status(404).json(jsonResponse.error('Product not found'));

    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    await product.save();

    res.status(200).json(jsonResponse.success('The product has been updated'));
};

module.exports = {
    newProduct,
    getProduct,
    updateProduct,
};
