const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

router.get('/login', siteController.login);
router.get('/info-update', siteController.infoUpdate);
router.get('/register', siteController.register);
router.post('/register', siteController.registerPost);
router.get('/search', siteController.search);
router.get('/contact', siteController.contact);
router.get('/', siteController.index);

module.exports = router;
