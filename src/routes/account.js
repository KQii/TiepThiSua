const express = require('express');
const router = express.Router();

const accountController = require('../app/controllers/AccountsController');
const { checkUserPermission, checkAdminPermission } = require('../app/middlewares/checkPermission');

router.delete('/:TENTK', checkAdminPermission, accountController.destroy);
router.post('/handle-form-delete-actions', checkAdminPermission, accountController.handleFormDeleteActions);

module.exports = router;
