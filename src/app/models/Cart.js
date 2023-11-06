var config = require('../../config/db/index');
const sql = require('mssql');

class Cart {
    async getCartByTENTK(TENTK) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('TENTK', sql.Char, TENTK)
                .query(`
                    SELECT GIOHANG.*, SANPHAM.TENSP, SANPHAM.GIABAN, SANPHAM.TON FROM GIOHANG
                    JOIN SANPHAM ON GIOHANG.MASP = SANPHAM.MASP
                    WHERE TENTK = @TENTK AND TRANGTHAI = 0
                `);
            return res.recordset;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async add(MASP, SOLUONG, TENTK) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('MASP', sql.Char, MASP)
                .input('SOLUONG', sql.Int, SOLUONG)
                .input('TENTK', sql.Char, TENTK)
                .query(`
                    INSERT INTO GIOHANG
                    VALUES (@MASP, @SOLUONG, 0, @TENTK, 0)

                    UPDATE GIOHANG
                    SET THANHTIEN = GIOHANG.SOLUONG * SANPHAM.GIABAN
                    FROM GIOHANG JOIN SANPHAM
                    ON GIOHANG.MASP = SANPHAM.MASP
                `);
            return res.recordset;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async deleteCart(ID) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('ID', sql.Int, ID)
                .query(`
                    DELETE FROM GIOHANG
                    WHERE ID = @ID
                `);
            return res.recordset;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async updateCart(cartIDArr, soluongArr) {
        try {
            let pool = await sql.connect(config);
            for (let i = 0; i < cartIDArr.length; i++) {
                let request = pool.request();
                request.input('id', sql.Char, cartIDArr[i]);
                request.input('soluong', sql.Int, soluongArr[i]);
                await request.query(`
                    UPDATE GIOHANG
                    SET SOLUONG = @soluong, THANHTIEN = @soluong * SANPHAM.GIABAN
                    FROM GIOHANG JOIN SANPHAM
                    ON GIOHANG.MASP = SANPHAM.MASP
                    WHERE ID = @id
                `);
            }
        } catch (err) {
            console.log(' Error :' + err);
        }
    }
}

module.exports = new Cart();