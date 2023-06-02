var config = require('../../config/db/index');
const sql = require('mssql');

class Order {

    async getOrders() {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request().query(`SELECT * FROM DONHANG JOIN KHACHHANG ON DONHANG.MAKH = KHACHHANG.SDT1`);
            return res.recordset;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async getDetailOrders(MADH) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('MADH', sql.Char, MADH)
                .query(`SELECT CTDONHANG.MASP, TENSP, SOLUONG, GIABAN, THANHTIEN
                FROM CTDONHANG JOIN SANPHAM ON CTDONHANG.MASP = SANPHAM.MASP WHERE MADH = @MADH`);
            return res.recordset;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

}

module.exports = new Order();