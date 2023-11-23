const express = require('express');
const router = express.Router();

const errorHandler = require('../utility/errorHandlerUtil');
const controller = require('../controllers/customerSupportController');
const authentication = require('../middlewares/authentication');

router.post('/response/:ticketId', authentication.authenticateUser, errorHandler(controller.response));
router.post('/:orderId', authentication.authenticateUser, errorHandler(controller.newSupport));

module.exports = router;
