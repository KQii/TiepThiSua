const express = require('express');
const router = express.Router();

const productsController = require('../app/controllers/ProductsController');

router.get('/create', productsController.create);
router.post('/handle-form-delete-actions', productsController.handleFormDeleteActions);
router.post('/handle-form-restore-actions', productsController.handleFormRestoreActions);
router.post('/store', productsController.store);
router.post('/add-item', productsController.addItem);
router.post('/change-price', productsController.changePrice);
router.patch('/:MASP/restore', productsController.restore);
router.patch('/:MASP/soft-delete', productsController.updateSoftDelete);
router.put('/:MASP', productsController.update);
router.delete('/:MASP', productsController.destroy);
router.get('/:MASP/edit', productsController.edit);
router.get('/:MASP', productsController.getByMASP);
router.get('/', productsController.getList);

module.exports = router;
