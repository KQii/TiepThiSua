const Product = require('../models/Product');
const Account = require('../models/Account');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Receipt = require('../models/Receipt');
const History = require('../models/History');

class MeController {
    
    // [GET] /me/stored/products
    async storedProducts(req, res, next) {
        try {
            const products = await Product.getAllRemainProducts(req.query);
            res.render('me/stored-products', {products});
        } catch (err) {
            next(err);
        }
    }

    // [GET] /me/trash/products
    async trashProducts(req, res, next) {
        try {
            const products = await Product.getAllDeletedProducts(req.query);
            res.render('me/trash-products', {products});
        } catch (err) {
            next(err);
        }
    }

    // [GET] /me/stored/categories
    async storedCategories(req, res, next) {
        try {
            const categories = await Category.getCategories();
            res.render('me/stored-categories', {categories});
        } catch (err) {
            next(err);
        }
    } 

    // [GET] /me/stored/accounts
    async storedAccounts(req, res, next) {
        try {
            const accounts = await Account.getAccounts();
            res.render('me/stored-accounts', {accounts});
        } catch (err) {
            next(err);
        }
    }

    // [GET] /me/stored/orders
    async storedOrders(req, res, next) {
        try {
            const orders = await Order.getOrders();
            res.render('me/stored-orders', {orders});
        } catch (err) {
            next(err);
        }
    }   

    // [GET] /me/stored/orders/:MADH
    async detailOrders(req, res, next) {
        try {
            const MADH = req.params.MADH;
            const detailOrders = await Order.getDetailOrders(MADH);
            res.render('me/stored-detail-orders', {detailOrders});
        } catch (err) {
            next(err);
        }
    }

    // [GET] me/stored/customers
    async storedCustomers(req, res, next) {
        try {
            const customers = await Customer.getCustomers();
            res.render('me/stored-customers', {customers});
        } catch (err) {
            next(err);
        }
    }

    // [GET] me/stored/receipts
    async storedReceipts(req, res, next) {
        try {
            const receipts = await Receipt.getReceipts();
            res.render('me/stored-receipts', { receipts });
        } catch (err) {
            next(err);
        }
    }

    // [GET] me/stored/receipts/:MAPN
    async detailReceipts(req, res, next) {
        try {
            var MAPN = req.params.MAPN;
            console.log(MAPN);
            const detailReceipts = await Receipt.getDetailReceipts(MAPN);
            res.render('me/stored-detail-receipts', {detailReceipts});
        } catch (err) {
            next(err);
        }
    }

    // [GET] me/add-item
    async addItem(req, res, next) {
        try {
            const product = await Product.getAllProducts();
            res.render('me/add-item', { product });
        } catch (err) {
            next(err);
        }
    }

    // [GET] me/change-price
    async changePrice(req, res, next) {
        try {
            const product = await Product.getAllProductsWithPrice();
            res.render('me/change-price', { product });
        } catch (err) {
            next(err);
        }
    }

    // [GET] me/change-price/:MASP
    async priceHistory(req, res, next) {
        try {
            const MASP = req.params.MASP;
            const history = await History.getPriceHistory(MASP);
            res.render('me/price-history', { history });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new MeController();
