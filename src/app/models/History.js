var config = require('../../config/db/index');
const sql = require('mssql');

class History {

    async getPriceHistory(MASP) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('MASP', sql.Char, MASP)
                .query(`
                    SELECT LS.MALS, LS.MASP, SP.TENSP, LS.GIAMOI, LS.NGAYTHAYDOI
                    FROM LICHSU LS
                    JOIN SANPHAM SP ON LS.MASP = SP.MASP 
                    WHERE LS.MASP = @MASP
                `);
            return res.recordset;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

};

module.exports = new History();