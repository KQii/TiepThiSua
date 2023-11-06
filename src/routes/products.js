const express = require('express');
const router = express.Router();

const productsController = require('../app/controllers/ProductsController');
const { checkUserPermission, checkAdminPermission } = require('../app/middlewares/checkPermission');

router.get('/create', checkAdminPermission, productsController.create);
router.post('/handle-form-delete-actions', checkAdminPermission, productsController.handleFormDeleteActions);
router.post('/handle-form-restore-actions', checkAdminPermission, productsController.handleFormRestoreActions);
router.post('/store', checkAdminPermission, productsController.store);
router.post('/add-item', checkAdminPermission, productsController.addItem);
router.post('/change-price', checkAdminPermission, productsController.changePrice);
router.post('/add-to-cart', checkUserPermission, productsController.addToCart);
router.patch('/:MASP/restore', checkAdminPermission, productsController.restore);
router.patch('/:MASP/soft-delete', checkAdminPermission, productsController.updateSoftDelete);
router.put('/:MASP', checkAdminPermission, productsController.update);
router.delete('/:MASP', checkAdminPermission, productsController.destroy);
router.get('/:MASP/edit', checkAdminPermission, productsController.edit);
router.get('/:MASP', checkUserPermission, productsController.getByMASP);
router.get('/', checkUserPermission, productsController.getList);

module.exports = router;
