const Category = require('../models/Category');
const Product = require('../models/Product');

class CategoriesController {

    // [GET] /category/:MALOAI/edit
    async edit(req, res, next) {
        try {
            const MALOAI = req.params.MALOAI;
            const category = await Category.getCategoriesByMALOAI(MALOAI);
            res.render('category/edit', { category, name: req.user.TENTK, role: req.user.ROLE });
        } catch (err) {
            next(err);
        }
    }

    // [GET] /category/:MALOAI
    async getByMALOAI(req, res, next) {
        try {
            const MALOAI = req.params.MALOAI;
            const product = await Product.getAllProductsByMALOAI(MALOAI);
            res.render('products/show', { product, name: req.user.TENTK, role: req.user.ROLE });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /category/create
    async create(req, res, next) {
        try {
            res.render('category/create', { name: req.user.TENTK, role: req.user.ROLE });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /category/store
    async store(req, res, next) {
        console.log(req.body);
        try {
            const { TENLOAI } = req.body;
            const newSP = await Category.createCategory(TENLOAI);
            // res.status(201).json(newSP);
            res.redirect('/me/stored/categories');
        } catch (err) {
            next(err);
        }
    }

    // [POST] /category/handle-form-delete-actions
    handleFormDeleteActions(req, res, next) {
        console.log(req.body);
        switch (req.body.action) {
            case 'delete':
                const categoryIds = req.body.categoryIds;
                for (let i = 0; i < categoryIds.length; i++) {
                    Category.destroyCategoryByMALOAI(categoryIds[i]);
                }
                break;
            default:
                res.json({ message: 'Action is invalid!' });
        }
        res.redirect('back');
    }

    // [PUT] /category/:MALOAI
    async update(req, res, next) {
        console.log(req.body);
        try {
            const { MALOAI, TENLOAI } = req.body;
            const newSP = await Category.updateCategory(MALOAI, TENLOAI);
            res.redirect('/me/stored/categories');
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /category/:MALOAI
    async destroy(req, res, next) {
        try {
            const MALOAI = req.params.MALOAI;
            const newSP = await Category.destroyCategoryByMALOAI(MALOAI);
            res.redirect('back');
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CategoriesController();
