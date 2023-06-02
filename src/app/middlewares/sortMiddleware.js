module.exports = function sortMiddleware(req, res, next) {
    res.locals._sort = {
        enabled: false,
        type: 'default',
        page: req.query.page,
    };

    // When URL has query '_sort'
    if (req.query.hasOwnProperty('_sort')) {
        res.locals._sort.enabled = true;
        res.locals._sort.column = req.query.column;
        res.locals._sort.type = req.query.type;
        res.locals._sort.page = req.query.page;
    };
    if (typeof req.query.page === 'string') {
        const parsedPage = parseInt(req.query.page);
        if (!isNaN(parsedPage)) {
            res.locals._sort.page = parsedPage;
        }
    }
    next();
};