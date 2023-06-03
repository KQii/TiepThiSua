const bcrypt = require('bcrypt');
const Account = require('../models/Account');

class SiteController {
    // [GET] /
    index(req, res) {
        res.render('home');
    }

    // [GET] /search
    search(req, res) {
        res.render('search');
    }

    // [GET] /contact
    contact(req, res) {
        res.render('contact');
    }

    // [GET] /login
    login(req, res) {
        res.render('login', { layout: false });
    }

    // [GET] /register
    register(req, res) {
        res.render('register', { layout: false });
    }

    // [GET] /info-update
    infoUpdate(req, res) {
        res.render('info-update', { layout: false });
    }

    // [POST] /register
    async registerPost(req, res) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const newAccount = await Account.createAccount(req.body.phonenumber, hashedPassword);
            res.redirect('/login');
        } catch (e) {
            console.log(e);
            res.redirect('/register');
        }
    }
}

module.exports = new SiteController();
