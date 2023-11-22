const express = require('express');
const router = express.Router();

const errorHandler = require('../utility/errorHandlerUtil');
const controller = require('../controllers/productController');
const authentication = require('../middlewares/authentication');

router.post('/', [authentication.authenticateUser, authentication.authenticateRole('admin')], errorHandler(controller.newProduct));

router.get('/search', errorHandler(controller.searchProducts));

router.post('/bulk-add', [authentication.authenticateUser, authentication.authenticateRole('admin')], errorHandler(controller.bulkAdd));
router.put('/bulk-edit', [authentication.authenticateUser, authentication.authenticateRole('admin')], errorHandler(controller.bulkEdit));
router.delete('/bulk-delete', [authentication.authenticateUser, authentication.authenticateRole('admin')], errorHandler(controller.bulkEdit));

router.route('/:id')
    .get(errorHandler(controller.getProduct))
    .put([authentication.authenticateUser, authentication.authenticateRole('admin')], errorHandler(controller.updateProduct))
    .delete([authentication.authenticateUser, authentication.authenticateRole('admin')], errorHandler(controller.deleteProduct));

module.exports = router;
