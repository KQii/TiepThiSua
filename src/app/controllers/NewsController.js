class NewsController {
    // [GET] /news
    index(req, res) {
        res.render('news', { name: req.user.TENTK, role: req.user.ROLE});
    }

    // [GET] /news/:slug
    show(req, res) {
        res.send('NEWS DETAIL!', { name: req.user.TENTK, role: req.user.ROLE});
    }
}

module.exports = new NewsController();
