var config = require('../../config/db/index');
const sql = require('mssql');

class Order {

    async getOrders(reqQuery) {
        try {
            let query = `SELECT * FROM DONHANG JOIN KHACHHANG ON DONHANG.MAKH = KHACHHANG.SDT1`;

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

    async getDetailOrdersByCustomer(MADH) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('MADH', sql.Int, MADH)
                .query(`
                    SELECT SP.TENSP, CTDH.SOLUONG, SP.GIABAN, CTDH.THANHTIEN, DH.TONGTIEN, DH.MADH, DH.NGAYDH, KH.HO, KH.TEN, KH.DIACHI, KH.SDT1
                    FROM CTDONHANG CTDH
                    JOIN DONHANG DH ON CTDH.MADH = DH.MADH
                    JOIN KHACHHANG KH ON DH.MAKH = KH.SDT1
                    JOIN SANPHAM SP ON CTDH.MASP = SP.MASP
                    WHERE CTDH.MADH = @MADH
                `)
            return res.recordset;   
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async getOrdersByCustomer(MAKH) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('MAKH', sql.Char, MAKH)
                .query(`SELECT * FROM DONHANG WHERE MAKH = @MAKH`);
            return res.recordset;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async createOrder(cartIDArr, productIDArr, soluongArr, TENTK) {
        try {
            var query =
                `
            INSERT INTO DONHANG (MAKH, NGAYDH, TRANGTHAI, TONGTIEN)
            VALUES (@TENTK, GETDATE(), 0, 0)    
            `

            for (let i = 0; i < cartIDArr.length; i++) {
                query += 
                `
                IF '${soluongArr[i]}' <= (SELECT TON FROM SANPHAM WHERE MASP = '${productIDArr[i]}')
                BEGIN
                    INSERT INTO CTDONHANG (MADH, MASP, SOLUONG)
                    VALUES ((SELECT TOP 1 MADH FROM DONHANG ORDER BY MADH DESC), '${productIDArr[i]}', '${soluongArr[i]}')

                    UPDATE CTDONHANG
                    SET THANHTIEN = SANPHAM.GIABAN * CTDONHANG.SOLUONG
                    FROM CTDONHANG JOIN SANPHAM
                    ON CTDONHANG.MASP = SANPHAM.MASP
                    WHERE CTDONHANG.MADH = (SELECT TOP 1 MADH FROM DONHANG ORDER BY MADH DESC)

                    UPDATE SANPHAM 
                    SET TON = TON - '${soluongArr[i]}'
                    WHERE MASP = '${productIDArr[i]}'
                END
                `
            }

            query += `
                DECLARE @COUNT INT
                SET @COUNT = (SELECT COUNT(MADH)
                            FROM CTDONHANG
                            WHERE MADH = (SELECT TOP 1 MADH FROM DONHANG ORDER BY MADH DESC))

                IF @COUNT = 0
                BEGIN
                    UPDATE GIOHANG
                    SET TRANGTHAI = 1
                    WHERE TENTK = @TENTK
                    DELETE FROM DONHANG WHERE MADH = (SELECT TOP 1 MADH FROM DONHANG ORDER BY MADH DESC)
                END
                ELSE
                BEGIN
                    UPDATE DONHANG
                    SET TONGTIEN = (
                        SELECT SUM(THANHTIEN)
                        FROM CTDONHANG
                        WHERE CTDONHANG.MADH = DONHANG.MADH
                    )
        
                    UPDATE GIOHANG
                    SET TRANGTHAI = 1
                    WHERE TENTK = @TENTK
                END
            `

            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('TENTK', sql.Char, TENTK)
                .query(query);
            return res.recordset;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

}

module.exports = new Order();

