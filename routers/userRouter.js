const express = require('express');
const router = express.Router();

const errorHandler = require('../utility/errorHandlerUtil');
const controller = require('../controllers/userController');
const authentication = require('../middlewares/authentication');

router.post('/register', errorHandler(controller.register));
router.post('/login', errorHandler(controller.login));
router.get('/logout', errorHandler(controller.logout));

router.put('/updateProfile', authentication.authenticateUser, errorHandler(controller.updateProfile));

module.exports = router;
