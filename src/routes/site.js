const express = require('express');
const router = express.Router();
const passport = require('passport');
const { checkAuthenticated, checkNotAuthenticated } = require('../app/middlewares/checkAuthenticated');

const siteController = require('../app/controllers/SiteController');

router.get('/login', checkNotAuthenticated, siteController.login);
router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
}));
router.get('/info-update', checkAuthenticated, siteController.infoUpdate);
router.post('/info-update', checkAuthenticated, siteController.infoUpdatePost);
router.get('/register', checkNotAuthenticated, siteController.register);
router.post('/register', checkNotAuthenticated, siteController.registerPost);
router.get('/search', siteController.search);
router.get('/contact', siteController.contact);
router.delete('/logout', siteController.logout);
router.get('/', checkAuthenticated, siteController.index);

module.exports = router;
