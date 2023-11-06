const express = require('express');
const router = express.Router();

const meController = require('../app/controllers/MeController');
const { checkAdminPermission, checkUserPermission } = require('../app/middlewares/checkPermission');

router.get('/stored/products', checkAdminPermission, meController.storedProducts);
router.get('/stored/categories', checkAdminPermission, meController.storedCategories);
router.get('/stored/accounts', checkAdminPermission, meController.storedAccounts);
router.get('/stored/customers', checkAdminPermission, meController.storedCustomers);
router.get('/stored/orders/:MADH', checkAdminPermission, meController.detailOrders);
router.get('/stored/orders', checkAdminPermission, meController.storedOrders);
router.get('/stored/receipts/:MAPN', checkAdminPermission, meController.detailReceipts);
router.get('/stored/receipts', checkAdminPermission, meController.storedReceipts);
router.get('/trash/products', checkAdminPermission, meController.trashProducts);
router.get('/add-item', checkAdminPermission, meController.addItem);
router.get('/change-price/:MASP', checkAdminPermission, meController.priceHistory);
router.get('/change-price', checkAdminPermission, meController.changePrice);
router.get('/add-report', checkAdminPermission, meController.addReport);
router.get('/report', checkAdminPermission, meController.report);
router.get('/cart', checkUserPermission, meController.cart);
router.get('/order', checkUserPermission, meController.viewOrder);
router.get('/order/:MADH', checkUserPermission, meController.viewdetailOrder);
router.post('/cart/save-changes', checkUserPermission, meController.saveCartChanges)
router.post('/cart/create-order', checkUserPermission, meController.createOrder)
router.patch('/cart/:ID/delete', checkUserPermission, meController.deleteCart);
router.post('/report', checkAdminPermission, meController.sendReport);
router.get('/receipts-report', checkAdminPermission, meController.receiptsReport);
router.get('/output-report', checkAdminPermission, meController.outputReport);


module.exports = router;
