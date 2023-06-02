const express = require('express');
const router = express.Router();

const accountController = require('../app/controllers/AccountsController');

router.delete('/:TENTK', accountController.destroy);
router.post('/handle-form-delete-actions', accountController.handleFormDeleteActions);

module.exports = router;
