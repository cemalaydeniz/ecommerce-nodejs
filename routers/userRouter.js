const express = require('express');
const router = express.Router();

const errorHandler = require('../utility/errorHandlerUtil');
const controller = require('../controllers/userController');

router.post('/register', errorHandler(controller.register));

module.exports = router;
