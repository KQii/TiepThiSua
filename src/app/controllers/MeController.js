const Product = require('../models/Product');
const Account = require('../models/Account');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Receipt = require('../models/Receipt');
const History = require('../models/History');
const Report = require('../models/Report');
const Cart = require('../models/Cart');

class MeController {
    
    // [GET] /me/stored/products
    async storedProducts(req, res, next) {
        try {
            const products = await Product.getAllRemainProducts(req.query);
            res.render('me/stored-products', { products, name: req.user.TENTK, role: req.user.ROLE });
        } catch (err) {
            next(err);
        }
    }

    // [GET] /me/trash/products
    async trashProducts(req, res, next) {
        try {
            const products = await Product.getAllDeletedProducts(req.query);
            res.render('me/trash-products', {products, name: req.user.TENTK, role: req.user.ROLE});
        } catch (err) {
            next(err);
        }
    }

    // [GET] /me/stored/categories
    async storedCategories(req, res, next) {
        try {
            const categories = await Category.getCategories(req.query);
            res.render('me/stored-categories', {categories, name: req.user.TENTK, role: req.user.ROLE});
        } catch (err) {
            next(err);
        }
    } 

    // [GET] /me/stored/accounts
    async storedAccounts(req, res, next) {
        try {
            const accounts = await Account.getAccounts(req.query);
            res.render('me/stored-accounts', {accounts, name: req.user.TENTK, role: req.user.ROLE});
        } catch (err) {
            next(err);
        }
    }

    // [GET] /me/stored/orders
    async storedOrders(req, res, next) {
        try {
            const orders = await Order.getOrders(req.query);
            res.render('me/stored-orders', {orders, name: req.user.TENTK, role: req.user.ROLE});
        } catch (err) {
            next(err);
        }
    }   

    // [GET] /me/stored/orders/:MADH
    async detailOrders(req, res, next) {
        try {
            const MADH = req.params.MADH;
            const detailOrders = await Order.getDetailOrders(MADH);
            res.render('me/stored-detail-orders', {detailOrders, name: req.user.TENTK, role: req.user.ROLE});
        } catch (err) {
            next(err);
        }
    }

    // [GET] /me/order
    async viewOrder(req, res, next) {
        try {
            const order = await Order.getOrdersByCustomer(req.user.TENTK);
            res.render('me/order', {order, name: req.user.TENTK, role: req.user.ROLE});
        } catch (err) {
            next(err);
        }
    }

    // [GET] /me/order/:MADH
    async viewdetailOrder(req, res, next) {
        try {
            const MADH = req.params.MADH;
            console.log(MADH);
            const detailOrders = await Order.getDetailOrdersByCustomer(MADH);
            res.render('me/detail-order', {detailOrders, name: req.user.TENTK, role: req.user.ROLE});
        } catch (err) {
            next(err);
        }
    }

    // [GET] me/stored/customers
    async storedCustomers(req, res, next) {
        try {
            const customers = await Customer.getCustomers(req.query);
            res.render('me/stored-customers', {customers, name: req.user.TENTK, role: req.user.ROLE});
        } catch (err) {
            next(err);
        }
    }

    // [GET] me/stored/receipts
    async storedReceipts(req, res, next) {
        try {
            const receipts = await Receipt.getReceipts(req.query);
            res.render('me/stored-receipts', { receipts, name: req.user.TENTK, role: req.user.ROLE });
        } catch (err) {
            next(err);
        }
    }

    // [GET] me/stored/receipts/:MAPN
    async detailReceipts(req, res, next) {
        try {
            var MAPN = req.params.MAPN;
            const detailReceipts = await Receipt.getDetailReceipts(MAPN, req.query);
            res.render('me/stored-detail-receipts', {detailReceipts, name: req.user.TENTK, role: req.user.ROLE});
        } catch (err) {
            next(err);
        }
    }

    // [GET] me/add-item
    async addItem(req, res, next) {
        try {
            const product = await Product.getAllProducts();
            res.render('me/add-item', { product, name: req.user.TENTK, role: req.user.ROLE });
        } catch (err) {
            next(err);
        }
    }

    // [GET] me/change-price
    async changePrice(req, res, next) {
        try {
            const product = await Product.getAllProductsWithPrice();
            res.render('me/change-price', { product, name: req.user.TENTK, role: req.user.ROLE });
        } catch (err) {
            next(err);
        }
    }

    // [GET] me/change-price/:MASP
    async priceHistory(req, res, next) {
        try {
            const MASP = req.params.MASP;
            const history = await History.getPriceHistory(MASP);
            res.render('me/price-history', { history, name: req.user.TENTK, role: req.user.ROLE });
        } catch (err) {
            next(err);
        }
    }

    // [GET] me/report
    async report(req, res, next) {
        try {
            const startDate = req.query.startdate;
            const endDate = req.query.enddate;
            const report = await Report.getReport(startDate, endDate);
            const soldProduct = await Report.getSoldProduct(startDate, endDate);
            const mostSoldProduct = await Report.getMostSoldProduct(startDate, endDate);
            const totalOrder = await Report.getTotalOrder(startDate, endDate);
            const customer = await Report.getCustomer();
            console.log(customer);
            res.render('me/report', { report, soldProduct, mostSoldProduct, totalOrder, customer, name: req.user.TENTK, role: req.user.ROLE });
        } catch (err) {
            next(err);
        }
    }

    // [POST] me/report
    async sendReport(req, res, next) {
        try {
            const { startdate, enddate } = req.body;
            await Report.createReport(startdate, enddate);
            res.redirect('/me/report?startdate=' + startdate + '&enddate=' + enddate);
        } catch (err) {
            next(err);
        }
    }

    // [GET] me/add-report
    async addReport(req, res, next) {
        try {
            res.render('me/add-report', { name: req.user.TENTK, role: req.user.ROLE });
        } catch (err) {
            next(err);
        }
    }

    // [GET] me/cart
    async cart(req, res, next) {
        try {
            const cart = await Cart.getCartByTENTK(req.user.TENTK);
            res.render('me/cart', { cart, name: req.user.TENTK, role: req.user.ROLE });
        } catch (err) {
            next(err);
        }
    }

    // [PATCH] me/cart/:ID/delete
    async deleteCart(req, res, next) {
        try {
            const ID = req.body.ID;
            await Cart.deleteCart(ID);
            res.redirect('/me/cart');
        } catch (err) {
            next(err);
        }
    }

    // [POST] me/cart/save-changes
    async saveCartChanges(req, res, next) {
        try {
            const { cartIDs, productIDs, soluong } = req.body;
            await Cart.updateCart(cartIDs, soluong);
            res.redirect('/me/cart');
        } catch (err) {
            next(err);
        }
    }

    // [POST] me/cart/create-order
    async createOrder(req, res, next) {
        try {
            const { cartIDs, productIDs, soluong } = req.body;
            await Order.createOrder(cartIDs, productIDs ,soluong, req.user.TENTK);
            res.redirect('/me/cart');
        } catch (err) {
            next(err);
        }
    }

    // [GET] me/receipts-report
    async receiptsReport(req, res, next) {
        try {
            // const receipts = await Receipt.getReceipts();
            const startDate = req.query.startdate;
            const endDate = req.query.enddate;
            const masp = req.query.MASP;
            console.log(masp);
            const product = await Product.getAllRemainProducts(req.query);
            const receiptsReport = await Report.getReceiptsReport(startDate, endDate, masp);
            res.render('me/receipts-report', { product, receiptsReport, name: req.user.TENTK, role: req.user.ROLE });
        } catch (err) {
            next(err);
        }
    }

    async outputReport(req, res, next) {
        try {
            // const receipts = await Receipt.getReceipts();
            const startDate = req.query.startdate;
            const endDate = req.query.enddate;
            const masp = req.query.MASP;
            console.log(masp);
            const product = await Product.getAllRemainProducts(req.query);
            const receiptsReport = await Report.getOutputReport(startDate, endDate, masp);
            res.render('me/output-report', { product, receiptsReport, name: req.user.TENTK, role: req.user.ROLE });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new MeController();
