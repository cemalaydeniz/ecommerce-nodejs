const jsonResponse = require('../utility/responseJsonUtil');
const mongoose = require('mongoose');

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

    res.status(200).json(jsonResponse.data(true, product));
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

    let product = await Product.findOne({ _id: id })
    if (!product)
        return res.status(404).json(jsonResponse.error('Product not found'));

    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    await product.save();

    res.status(200).json(jsonResponse.success('The product has been updated'));
};

const deleteProduct = async(req, res) => {
    const { id } = req.params;
    if (!id)
        return res.status(400).json(jsonResponse.success('Bad request'));

    await Product.deleteOne({ _id: id });

    res.status(200).json(jsonResponse.success('The product has been deleted'));
};

const searchProducts = async(req, res) => {
    const name = req.query.name;
    if (!name)
        return res.status(400).json(jsonResponse.success('Bad request'));

    const page = req.query.page && req.query.page > 1 ? req.query.page : 1;
    const query = {
        name: new RegExp(name, 'i'),
        isDeleted: { $ne: true }
    };

    const pageSize = 10;        // This can be in the environment variables
    const products = await Product.find(query).skip((page - 1) * pageSize).limit(pageSize);

    res.status(200).json(jsonResponse.data(true, products));
};

const bulkAdd = async(req, res) => {
    const { products } = req.body;
    if (!products || products.length == 0)
        return res.status(400).json(jsonResponse.success('Bad request'));

    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
        await Product.create(products, { session: session });
        await session.commitTransaction();
        await session.endSession();
    }
    catch (error) {
        await session.abortTransaction();
        await session.endSession();
        return res.status(500).json(jsonResponse.success(error.message));
    }
    
    res.status(200).json(jsonResponse.success('Bulk addition has been completed successfully'));
};

const bulkEdit = async(req, res) => {
    const { products } = req.body;
    if (!products || products.length == 0)
        return res.status(400).json(jsonResponse.success('Bad request'));

    const query = products.map((value) => ({
        updateOne: {
            filter: { _id: value.id },
            update: { $set: value }
        }
    }));

    await Product.bulkWrite(query, { runValidation: true });

    res.status(200).json(jsonResponse.success('Bulk editing has been completed successfully'));
};

const bulkDelete = async (req, res) => {
    const { ids } = req.body;
    if (!ids || ids.length == 0)
        return res.status(400).json(jsonResponse.success('Bad request'));

    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
        await Product.updateMany({ _id: {$in: ids}}, { $set: { isDeleted: true }});
        await session.commitTransaction();
        await session.endSession();
    }
    catch (error) {
        await session.abortTransaction();
        await session.endSession();
        return res.status(500).json(jsonResponse.success(error.message));
    }

    res.status(200).json(jsonResponse.success('Bulk deleting has been completed successfully'));
};

module.exports = {
    newProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    searchProducts,

    bulkAdd,
    bulkEdit,
    bulkDelete,
};
