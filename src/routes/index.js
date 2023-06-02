const newsRouter = require('./news');
const siteRouter = require('./site');
const productsRouter = require('./products');
const categoryRouter = require('./category');
const accountRouter = require('./account');
const meRouter = require('./me');

function route(app) {
    app.use('/news', newsRouter);

    app.use('/products', productsRouter);

    app.use('/me', meRouter);

    app.use('/category', categoryRouter);

    app.use('/account/', accountRouter)

    app.use('/', siteRouter);
}

module.exports = route;
