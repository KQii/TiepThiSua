var config = require('../../config/db/index');
const sql = require('mssql');

class Customer {

    async getCustomers() {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request().query('SELECT * FROM KHACHHANG');
            return res.recordset;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

}

module.exports = new Customer();