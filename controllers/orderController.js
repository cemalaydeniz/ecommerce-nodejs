require('dotenv').config();

const jsonResponse = require('../utility/responseJsonUtil');
const jsonChecker = require('../utility/jsonChecker');
const stripe = require('stripe');

const Product = require('../models/products');
const Order = require('../models/order');

const pay = async(req, res) => {
    const { cart } = req.body;
    if (cart.length == 0 || !jsonChecker(cart, ['productId', 'quantity']))
        return res.status(400).json(jsonResponse.error('Bad request'));

    const productIds = cart.map(item => item.id);

    const products = await Product.find({ _id: { $in: productIds }});
    if (!products || products.length != productIds.length)
        return res.status(400).json(jsonResponse.error('Bad request'));

    const totalAmount = 0;
    for(const product of products) {
        totalAmount += product.price;
    }

    // Add user ID to the cart in order to make inserting data process easy in the webhook
    for (let item of cart) {
        item['userId'] = req.user.id;
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: 'usd',
        created: (Date.now() / 1000),
        customer: req.user.id,
        metadata: {
            cart: cart,
        },
        receipt_email: req.user.email,
    });

    res.status(200).json(jsonResponse.data(true, paymentIntent.client_secret));
};

const paymentCheck = async(req, res) => {
    const signature = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_ENDPOINT_KEY;
    const event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);

    if (event.type == 'payment_intent.succeeded') {
        await Order.create(event.data.object.metadata.cart);
    }

    res.status(200).end();
};

module.exports = {
    pay,
    paymentCheck,
};
