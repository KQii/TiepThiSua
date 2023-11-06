const bcrypt = require('bcrypt');
const Account = require('../models/Account');
const Customer = require('../models/Customer');
const passport = require('passport');

class SiteController {
    // [GET] /
    index(req, res) {
        (async () => {
            try {
                const existCustomer = await Customer.isExistCustomerWithPhonenumber(req.user.TENTK);
                if (existCustomer) {
                    res.render('home', { name: req.user.TENTK, role: req.user.ROLE });
                } else {
                    res.redirect('/info-update');
                }
            } catch (error) {
                console.log('Error: ' + error);
                res.redirect('/error'); // Chuyển hướng đến trang lỗi trong trường hợp xảy ra lỗi
            }
        })();
    }


    // [GET] /search
    search(req, res) {
        res.render('search', {name: req.user.TENTK, role: req.user.ROLE});
    }

    // [GET] /contact
    contact(req, res) {
        res.render('contact', {name: req.user.TENTK, role: req.user.ROLE});
    }

    // [GET] /login
    login(req, res) {
        res.render('login', { layout: false });
    }

    // [POST] /login
    // async loginPost(req, res) {
    //     passport.authenticate('local', {
    //         successRedirect: "/",
    //         failureRedirect: "/login",
    //         failureFlash: true,
    //     })
    // }

    // [GET] /register
    async register(req, res) {
        res.render('register', { layout: false });
    }

    // [POST] /register
    async registerPost(req, res) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const newAccount = await Account.createAccount(req.body.phonenumber, hashedPassword);
            res.redirect('/login');
        } catch (e) {
            console.log(e);
            // res.redirect('/register');
        }
    }

    // [GET] /info-update
    infoUpdate(req, res) {
        res.render('info-update', { SDT1: req.user.TENTK, layout: false });
    }

    // [POST] /info-update
    async infoUpdatePost(req, res) {
        try {
            let a = req.body;
            console.log(a.sdt1, a.lastname, a.firstname, a.birthdaydate, a.inlineRadioOptions, a.email, a.address);
            await Customer.createCustomer(a.sdt1, a.lastname, a.firstname, a.birthdaydate, a.inlineRadioOptions, a.email, a.address);
            res.redirect('/');
        } catch (e) {
            console.log('Error: ' + error);
        }
    }

    // [DELETE] /logout
    logout(req, res) {
        req.logout(req.user, err => {
            if (err) return next(err)
            res.redirect("/")
        })
    }
}

module.exports = new SiteController();
