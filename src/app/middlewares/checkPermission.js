module.exports = {
    // Middleware phân quyền user
    checkUserPermission: function (req, res, next) {
        if (req.isAuthenticated()) {
            // User đã đăng nhập, có quyền truy cập
            return next();
        } else {
            // User chưa đăng nhập
            req.flash('error', 'Bạn cần đăng nhập để truy cập trang này');
            return res.redirect('/login');
        }
    },
    checkAdminPermission: function (req, res, next) {
        if (req.isAuthenticated() && req.user.ROLE === true) {
            // User đã đăng nhập và có quyền admin
            return next();
        } else {
            // User không có quyền admin
            req.flash('error', 'Bạn không có quyền truy cập vào trang này');
            return res.redirect('/');
        }
    }
};