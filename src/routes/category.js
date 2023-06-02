const express = require('express');
const router = express.Router();

const categoriesController = require('../app/controllers/CategoriesController');

router.get('/create', categoriesController.create);
router.post('/store', categoriesController.store);
router.post('/handle-form-delete-actions', categoriesController.handleFormDeleteActions);
router.get('/:MALOAI/edit', categoriesController.edit);
router.get('/:MALOAI', categoriesController.getByMALOAI);
router.put('/:MALOAI', categoriesController.update);
router.delete('/:MALOAI', categoriesController.destroy);
// router.get('/', productsController.getList);

module.exports = router;
