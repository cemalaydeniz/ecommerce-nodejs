const jsonResponse = require('../utility/responseJsonUtil');
const stripe = require('stripe');

const Product = require('../models/products');

const pay = async(req, res) => {
    const { cart } = req.body;
    const productIds = cart.map(item => item.id);

    const products = await Product.find({ _id: { $in: productIds }});
    if (products.length != productIds.length)
        return res.status(400).json(jsonResponse.error('Bad request'));

    const totalAmount = 0;
    for(const product of products) {
        totalAmount += product.price;
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: 'usd',
        created: (Date.now() / 1000),
        customer: req.user.id,
        receipt_email: req.user.email,
    });

    res.status(200).json(jsonResponse.data({ clientSecret: paymentIntent.client_secret }));
};

module.exports = {
    pay,
};
