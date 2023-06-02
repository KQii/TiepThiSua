const Account = require('../models/Account');

class AccountsController {
    // [DELETE] /account/:MALOAI
    async destroy(req, res, next) {
        try {
            const TENTK = req.params.TENTK;
            const newSP = await Account.destroyAccountByTENTK(TENTK);
            res.redirect('back');
        } catch (err) {
            next(err);
        }
    }

    // [POST] /account/handle-form-delete-actions
    handleFormDeleteActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                const accountIds = req.body.accountIds;
                for (let i = 0; i < accountIds.length; i++) {
                    Account.destroyAccountByTENTK(accountIds[i]);
                }
                break;
            default:
                res.json({ message: 'Action is invalid!' });
        }
        res.redirect('back');
    }
}

module.exports = new AccountsController();
