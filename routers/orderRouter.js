const express = require('express');
const router = express.Router();

const errorHandler = require('../utility/errorHandlerUtil');
const controller = require('../controllers/orderController');
const authentication = require('../middlewares/authentication');

// TODO: Webhook

router.post('/pay/:id', authentication.authenticateUser, errorHandler(controller.pay));

module.exports = router;
