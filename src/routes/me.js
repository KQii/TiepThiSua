const express = require('express');
const router = express.Router();

const meController = require('../app/controllers/MeController');

router.get('/stored/products', meController.storedProducts);
router.get('/stored/categories', meController.storedCategories);
router.get('/stored/accounts', meController.storedAccounts);
router.get('/stored/customers', meController.storedCustomers);
router.get('/stored/orders/:MADH', meController.detailOrders);
router.get('/stored/orders', meController.storedOrders);
router.get('/stored/receipts/:MAPN', meController.detailReceipts);
router.get('/stored/receipts', meController.storedReceipts);
router.get('/trash/products', meController.trashProducts);
router.get('/add-item', meController.addItem);
router.get('/change-price/:MASP', meController.priceHistory);
router.get('/change-price', meController.changePrice);

module.exports = router;
