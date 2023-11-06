var config = require('../../config/db/index');
const sql = require('mssql');

class Customer {

    async createCustomer(sdt, ho, ten, ngaysinh, gioitinh, email, diachi) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('sdt', sql.Char, sdt)
                .input('ten', sql.NVarChar, ten)
                .input('ho', sql.NVarChar, ho)
                .input('ngaysinh', sql.Date, ngaysinh)
                .input('gioitinh', sql.NVarChar, gioitinh)
                .input('email', sql.NVarChar, email)
                .input('diachi', sql.NVarChar, diachi)
                .query('INSERT INTO KHACHHANG(SDT1, HO, TEN, DIACHI, EMAIL1, GIOITINH, NGAYSINH) VALUES(@sdt, @ho, @ten, @diachi, @email, @gioitinh, @ngaysinh)');
            return res.recordset;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async getCustomers(reqQuery) {
        try {
            let query = `SELECT * FROM KHACHHANG`;

            if (reqQuery.hasOwnProperty('_sort')) {
                query += ` ORDER BY ${reqQuery.column} ${reqQuery.type}`;
            }

            let pool = await sql.connect(config);
            let res = await pool.request().query(query);
            return res.recordset;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async isExistCustomerWithPhonenumber(phonenumber) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('phonenumber', sql.Char, phonenumber)
                .query('SELECT * FROM KHACHHANG WHERE SDT1 = @phonenumber');
            return res.rowsAffected[0] > 0;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }
}

module.exports = new Customer();