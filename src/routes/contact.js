const express = require('express');
const router = express.Router();

const contactController = require('../app/controllers/SiteController');
router.get('/search', siteController.search);
router.get('/', siteController.index);

module.exports = router;
