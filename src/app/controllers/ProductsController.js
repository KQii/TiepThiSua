const Product = require('../models/Product');
const Category = require('../models/Category');
const Receipt = require('../models/Receipt');

class ProductsController {

    // [GET] /products
    async getList(req, res, next) {
        try {
            const product = await Product.getAllProducts();
            res.render('products/show', { product });
        } catch (err) {
            next(err);
        }

        // catch (err) {
        //     console.log(err);
        //     res.send('Đã xảy ra lỗi khi lấy danh sách sản phẩm');
        // }
    }

    // [GET]/products/:MASP/edit
    async edit(req, res, next) {
        try {
            const MASP = req.params.MASP;
            const product = await Product.getProductsByMASP(MASP);
            const category = await Category.getCategories();
            res.render('products/edit', { product, category });
        } catch (err) {
            next(err);
        }
    }


    // [GET] /products/:MASP
    async getByMASP(req, res, next) {
        try {
            const MASP = req.params.MASP;
            const product = await Product.getProductsByMASP(MASP);
            res.render('products/detail', { product });
        } catch (err) {
            next(err);
        }
    }

    // [GET] products/create
    async create(req, res, next) {
        try {
            const product = await Product.createProducts();
            const category = await Category.getCategories();
            res.render('products/create', { product, category })
        } catch (err) {
            next(err);
        }

    }

    // [POST] products/store
    async store(req, res, next) {
        try {
            const { MASP, MALOAI, TENSP, HINHANH, MOTA, NSX, DAXOA } = req.body;
            const newSP = await Product.createProducts(MASP, MALOAI, TENSP, HINHANH, MOTA, NSX, DAXOA);
            // res.status(201).json(newSP);
            res.redirect('/me/stored/products');
        } catch (err) {
            next(err);
        }
    }

    // [POST] products/add-item
    async addItem(req, res, next) {
        try {
            const { masp, soluong, giavon } = req.body;
            // Thêm phiếu nhập
            const receipt = await Receipt.createReceipt();

            // Lấy mã phiếu nhập vừa được thêm vào
            const mapn = receipt.output.MAPN;

            // Thêm chi tiết phiếu nhập
            await Receipt.createReceiptDetails(mapn, masp, soluong, giavon);

            await Product.updateQuantity(masp, soluong);
            
            res.redirect('/me/stored/products');
        } catch (error) {
            console.error('Lỗi khi thêm dữ liệu:', error);
            res.status(500).send('Lỗi khi thêm dữ liệu');
        }
    }

    // [POST] products/change-price
    async changePrice(req, res, next) {
        try {
            const { masp, giaban } = req.body;
            await Product.updatePrice(masp, giaban);
            res.redirect('/me/stored/products');
        } catch (error) {
            console.error('Lỗi khi thêm dữ liệu:', error);
            res.status(500).send('Lỗi khi thêm dữ liệu');
        }
    }

    // [PATCH] products/:MASP/soft-delete
    async updateSoftDelete(req, res, next) {
        try {
            const { MASP } = req.body;
            const newSP = await Product.updateSoftDeleteProducts(MASP);
            // res.status(201).json(newSP);
            res.redirect('back');
        } catch (err) {
            next(err);
        }
    }

    // [PATCH] products/:MASP/restore
    async restore(req, res, next) {
        try {
            console.log(req.body);
            const { MASP } = req.body;
            const newSP = await Product.restoreProducts(MASP);
            // res.status(201).json(newSP);
            res.redirect('back');
        } catch (err) {
            next(err);
        }
    }

    // [PUT] products/:MASP
    async update(req, res, next) {
        try {
            const { MASP, MALOAI, TENSP, HINHANH, MOTA, GIABAN, TON, NSX } = req.body;
            const newSP = await Product.updateProducts(MASP, MALOAI, TENSP, HINHANH, MOTA, GIABAN, TON, NSX);
            // res.status(201).json(newSP);
            res.redirect('/me/stored/products');
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] products/:MASP
    async destroy(req, res, next) {
        try {
            const MASP = req.params.MASP;
            const product = await Product.destroyCategoryByMASP(MASP);
            res.redirect('back');
        } catch (err) {
            next(err);
        }
    }

    // [POST] products/handle-form-delete-actions
    handleFormDeleteActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                const productIds = req.body.productIds;
                for (let i = 0; i < productIds.length; i++) {
                    Product.updateSoftDeleteProducts(productIds[i]);
                }
                break;
            default:
                res.json({ message: 'Action is invalid!' });
        }
        res.redirect('back');
    }

    // [POST] products/handle-form-restore-actions
    handleFormRestoreActions(req, res, next) {
        switch (req.body.action) {
            case 'restore':
                const productIds = req.body.productIds;
                for (let i = 0; i < productIds.length; i++) {
                    Product.restoreProducts(productIds[i]);
                }
                break;
            default:
                res.json({ message: 'Action is invalid!' });
        }
        res.redirect('back');
    }
}

module.exports = new ProductsController();
