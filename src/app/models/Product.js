var config = require('../../config/db/index');
const sql = require('mssql');

const PAGE_SIZE = 5;

class Product {
    async getdata() {
        try {
            let pool = await sql.connect(config);
            console.log('sql server connected...');
        } catch (err) {
            console.log(' mathus-error :' + err);
        }
    }

    async getAllProducts() {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request().query('SELECT * FROM SANPHAM');
            return res.recordset;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async getAllProductsWithPrice() {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request().query(`
            SELECT
                SANPHAM.MASP,
                SANPHAM.TENSP,
                SANPHAM.GIABAN,
                CTPHIEUNHAP.GIAVON
            FROM
                SANPHAM
            LEFT JOIN (
                SELECT
                    MASP,
                    MAX(ID) AS LATEST_ID
                FROM
                    CTPHIEUNHAP
                GROUP BY
                    MASP
            ) LATEST_CTPHIEUNHAP ON SANPHAM.MASP = LATEST_CTPHIEUNHAP.MASP
            LEFT JOIN CTPHIEUNHAP ON LATEST_CTPHIEUNHAP.LATEST_ID = CTPHIEUNHAP.ID
            `);
            return res.recordset;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async getAllRemainProducts(reqQuery) {
        let query = `
            SELECT * FROM SANPHAM WHERE DAXOA = 0
        `;

        if (reqQuery.hasOwnProperty('_sort')) {
            query += ` ORDER BY ${reqQuery.column} ${reqQuery.type}`;
        }

        try {
            let pool = await sql.connect(config);
            let res = await pool.request().query(query);
            return res.recordset;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async getAllDeletedProducts(reqQuery) {

        let query = `
            SELECT * FROM SANPHAM WHERE DAXOA = 1
        `;

        if (reqQuery.hasOwnProperty('_sort')) {
            query += ` ORDER BY ${reqQuery.column} ${reqQuery.type}`;
        }

        try {
            let pool = await sql.connect(config);
            let res = await pool.request().query(query);
            return res.recordset;
        } catch (err) {
            console.log('Error :' + err);
        }
    }

    async getProductsByMASP(MASP) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('MASP', sql.Char, MASP)
                .query('SELECT * FROM SANPHAM JOIN LOAISP ON SANPHAM.MALOAI = LOAISP.MALOAI WHERE MASP = @MASP');
            return res.recordset;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async destroyProductsByMASP(MASP) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('MASP', sql.Char, MASP)
                .query('DELETE FROM SANPHAM WHERE MASP = @MASP');
            return res.rowsAffected[0];
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async getAllProductsByMALOAI(MALOAI) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('MALOAI', sql.Int, MALOAI)
                .query('SELECT * FROM SANPHAM WHERE MALOAI = @MALOAI');
            return res.recordset;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async createProducts(MASP, MALOAI, TENSP, HINHANH, MOTA, NSX) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('MASP', sql.Char, MASP)
                .input('MALOAI', sql.Int, MALOAI)
                .input('TENSP', sql.NVarChar, TENSP)
                .input('HINHANH', sql.NVarChar, HINHANH)
                .input('MOTA', sql.NVarChar, MOTA)
                .input('NSX', sql.NVarChar, NSX)
                .query('INSERT INTO SANPHAM (MASP, MALOAI, TENSP, HINHANH, MOTA, GIABAN, TON, NSX) VALUES (@MASP, @MALOAI, @TENSP, @HINHANH, @MOTA, 0, 0, @NSX)');
            return res.rowsAffected[0] > 0;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async updateQuantity(maspArr, tonArr) {
        try {
            let pool = await sql.connect(config);
            for (let i = 0; i < maspArr.length; i++) {
                let request = pool.request();
                request.input('masp', sql.Char, maspArr[i]);
                request.input('ton', sql.Int, tonArr[i]);
                await request.query(`UPDATE SANPHAM SET TON = TON + @ton WHERE MASP = @masp`);
            }
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async updatePrice(maspArr, giabanArr) {
        try {
            let pool = await sql.connect(config);
            for (let i = 0; i < maspArr.length; i++) {
                let request = pool.request();
                request.input('masp', sql.Char, maspArr[i]);
                request.input('giaban', sql.Int, giabanArr[i]);
                await request.query(`

                IF EXISTS (SELECT 1 FROM SANPHAM WHERE MASP = @masp AND GIABAN <> @giaban)
                BEGIN
                    UPDATE SANPHAM SET GIABAN = @giaban WHERE MASP = @masp;
                    INSERT INTO LICHSU (MASP, GIAMOI, NGAYTHAYDOI)
                    VALUES (@masp, @giaban, GETDATE());
                END

                `);
            }
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async updateProducts(MASP, MALOAI, TENSP, HINHANH, MOTA, GIABAN, TON, NSX) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('MASP', sql.Char, MASP)
                .input('MALOAI', sql.Int, MALOAI)
                .input('TENSP', sql.NVarChar, TENSP)
                .input('HINHANH', sql.NVarChar, HINHANH)
                .input('MOTA', sql.NVarChar, MOTA)
                .input('GIABAN', sql.Money, GIABAN)
                .input('TON', sql.Int, TON)
                .input('NSX', sql.NVarChar, NSX)
                .query('UPDATE SANPHAM SET MALOAI = @MALOAI, TENSP = @TENSP, HINHANH = @HINHANH, MOTA = @MOTA, GIABAN = @GIABAN, TON = @TON, NSX = @NSX WHERE MASP = @MASP');
            return res.rowsAffected[0] > 0;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async updateSoftDeleteProducts(MASP) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('MASP', sql.Char, MASP)
                .query('UPDATE SANPHAM SET DAXOA = 1 WHERE MASP = @MASP');
            return res.rowsAffected[0] > 0;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async restoreProducts(MASP) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('MASP', sql.Char, MASP)
                .query('UPDATE SANPHAM SET DAXOA = 0 WHERE MASP = @MASP');
            return res.rowsAffected[0] > 0;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }
}

module.exports = new Product();
