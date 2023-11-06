var config = require('../../config/db/index');
const sql = require('mssql');

class Receipt {
    async createReceipt() {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request().query(`INSERT INTO PHIEUNHAP (THOIGIAN) OUTPUT inserted.MAPN VALUES (GETDATE())`);
            return { output: res.recordset[0] };
        } catch (err) {
            console.log('Lỗi: ' + err);
            throw err;
        }
    }

    async createReceiptDetails(mapn, maspArr, soluongArr, giavonArr) {
        try {
            let pool = await sql.connect(config);

            for (let i = 0; i < maspArr.length; i++) {
                let request = pool.request();
                request.input('mapn', sql.Int, mapn);
                request.input('masp', sql.Char, maspArr[i]);
                request.input('soluong', sql.Int, soluongArr[i]);
                request.input('giavon', sql.Money, giavonArr[i]);
                await request.query(`INSERT INTO CTPHIEUNHAP (MAPN, MASP, SOLUONG, GIAVON) VALUES (@mapn, @masp, @soluong, @giavon)`);
            }
        } catch (err) {
            console.log('Lỗi: ' + err);
        }
    }

    async getReceipts(reqQuery) {
        try {
            let query = `SELECT * FROM PHIEUNHAP`;

            if (reqQuery.hasOwnProperty('_sort')) {
                query += ` ORDER BY ${reqQuery.column} ${reqQuery.type}`;
            }

            let pool = await sql.connect(config);
            let res = await pool.request().query(query);
            return res.recordset;
        } catch (err) {
            console.log('Lỗi: ' + err);
            throw err;
        }
    }

    async getDetailReceipts(mapn, reqQuery) {
        try {
            let query = `
            SELECT CT.ID, CT.MASP, CT.SOLUONG, CT.GIAVON, SP.TENSP
            FROM CTPHIEUNHAP CT
            JOIN SANPHAM SP ON CT.MASP = SP.MASP
            WHERE MAPN = @MAPN
            `;

            if (reqQuery.hasOwnProperty('_sort')) {
                query += ` ORDER BY ${reqQuery.column} ${reqQuery.type}`;
            }

            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('MAPN', sql.Int, mapn)
                .query(query);
            return res.recordset;
        } catch (err) {
            console.log('Lỗi: ' + err);
            throw err;
        }
    }
}

module.exports = new Receipt();