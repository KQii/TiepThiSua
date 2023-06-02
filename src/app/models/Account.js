var config = require('../../config/db/index');
const sql = require('mssql');

class Account {
    async getAccounts() {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request().query('SELECT * FROM TAIKHOAN');
            return res.recordset;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async destroyAccountByTENTK(TENTK) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('TENTK', sql.Char, TENTK)
                .query('DELETE FROM TAIKHOAN WHERE TENTK = @TENTK');
            return res.rowsAffected[0];
        } catch (err) {
            console.log(' Error :' + err);
        }
    }
}

module.exports = new Account();