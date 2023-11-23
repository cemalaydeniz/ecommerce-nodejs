const express = require('express');
const router = express.Router();

const errorHandler = require('../utility/errorHandlerUtil');
const controller = require('../controllers/customerSupportController');
const authentication = require('../middlewares/authentication');

router.get('/close/:ticketId', [authentication.authenticateUser, authentication.authenticateRole('admin')], errorHandler(controller.closeTicket));
router.post('/response/:ticketId', authentication.authenticateUser, errorHandler(controller.response));
router.post('/:orderId', authentication.authenticateUser, errorHandler(controller.newTicket));

module.exports = router;
