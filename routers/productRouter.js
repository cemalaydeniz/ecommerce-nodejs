const express = require('express');
const router = express.Router();

const errorHandler = require('../utility/errorHandlerUtil');
const controller = require('../controllers/productController');
const authentication = require('../middlewares/authentication');

router.post('/', [authentication.authenticateUser, authentication.authenticateRole('admin')], errorHandler(controller.newProduct));

router.route('/:id')
    .get(errorHandler(controller.getProduct))
    .put([authentication.authenticateUser, authentication.authenticateRole('admin')], errorHandler(controller.updateProduct));

module.exports = router;
