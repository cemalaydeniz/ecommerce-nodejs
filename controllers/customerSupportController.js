const mongoose = require('mongoose');

const jsonResponses = require('../utility/responseJsonUtil');

const Order = require('../models/order');
const CustomerSupport = require('../models/customerSupport');

const newSupport = async(req, res) => {
    const { message } = req.body;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId });
    if (!order)
        return res.status(400).json(jsonResponses.error('Bad request'));

    if (order.supportTicketId)
        return res.status(400).json(jsonResponses.data(false, order.supportTicketId, 'There is already a created support ticket related to this product'));

    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
        const ticket = await CustomerSupport.create({
            orderId,
            messages: [{
                senderId: req.user.id,
                content: message
            }],
        });

        // Add the ID of the ticket to the order, so that it will be possible to check if there is already a created ticket
        order.supportTicketId = ticket._id;
        await order.save();

        await session.commitTransaction();
        await session.endSession();
    }
    catch (error) {
        await session.abortTransaction();
        await session.endSession();
        return res.status(500).json(jsonResponses.error(error.message));
    }

    res.status(201).json(jsonResponses.success('The support ticket has been created'));
};

module.exports = {
    newSupport,
};
