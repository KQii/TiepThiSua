const express = require('express');
const router = express.Router();

const categoriesController = require('../app/controllers/CategoriesController');
const { checkUserPermission, checkAdminPermission } = require('../app/middlewares/checkPermission');

router.get('/create', checkAdminPermission, categoriesController.create);
router.post('/store', checkAdminPermission, categoriesController.store);
router.post('/handle-form-delete-actions', checkAdminPermission, categoriesController.handleFormDeleteActions);
router.get('/:MALOAI/edit', checkAdminPermission, categoriesController.edit);
router.get('/:MALOAI', checkUserPermission, categoriesController.getByMALOAI);
router.put('/:MALOAI', checkAdminPermission, categoriesController.update);
router.delete('/:MALOAI', checkAdminPermission, categoriesController.destroy);
// router.get('/', productsController.getList);

module.exports = router;
