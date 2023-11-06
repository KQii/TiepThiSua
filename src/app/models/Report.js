var config = require('../../config/db/index');
const sql = require('mssql');

class Report {
    async getReport(startDate, endDate) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('StartDate', sql.DateTime, startDate)
                .input('EndDate', sql.DateTime, endDate)
                .query(`
                    SELECT * FROM BAOCAO WHERE NGAYBATDAU >= @StartDate AND NGAYKETTHUC <= @EndDate
                `);
            return res.recordset;
        } catch (err) {
            console.log('Lỗi: ' + err);
            throw err;
        }
    }

    async createReport(startDate, endDate) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('StartDate', sql.DateTime, startDate)
                .input('EndDate', sql.DateTime, endDate)
                .query(`
                INSERT INTO BAOCAO (NGAYBATDAU, NGAYKETTHUC, DOANHTHU, TONGVON, LOINHUAN)
                VALUES (@StartDate, @EndDate, 0, 0, 0);
                
                UPDATE BAOCAO
                SET DOANHTHU = (
                    SELECT SUM(TONGTIEN)
                    FROM DONHANG
                    WHERE TRANGTHAI = 1
                        AND NGAYDH >= BAOCAO.NGAYBATDAU
                        AND NGAYDH <= BAOCAO.NGAYKETTHUC
                );

                UPDATE BAOCAO
                SET TONGVON = (
                    SELECT SUM(cdh.SOLUONG * cpn.GIAVON) AS TongGiaVon
                    FROM CTDONHANG cdh
                    INNER JOIN CTPHIEUNHAP cpn ON cdh.MASP = cpn.MASP
                    INNER JOIN PHIEUNHAP pn ON cpn.MAPN = pn.MAPN
                    INNER JOIN DONHANG dh ON cdh.MADH = dh.MADH
                    WHERE dh.TRANGTHAI = 'True'
                        AND dh.NGAYDH >= BAOCAO.NGAYBATDAU AND dh.NGAYDH <= BAOCAO.NGAYKETTHUC
                        AND pn.THOIGIAN <= dh.NGAYDH
                        AND pn.THOIGIAN = (
                            SELECT MAX(pn2.THOIGIAN)
                            FROM PHIEUNHAP pn2
                            JOIN CTPHIEUNHAP cpn2 ON cpn2.MAPN = pn2.MAPN
                            WHERE cpn2.MASP = cdh.MASP AND pn2.THOIGIAN <= dh.NGAYDH
                        )
                );

                UPDATE BAOCAO
                SET LOINHUAN = BAOCAO.DOANHTHU - BAOCAO.TONGVON
                `);
        } catch (err) {
            console.log('Lỗi: ' + err);
            throw err;
        }
    }

    async getSoldProduct(startDate, endDate) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('StartDate', sql.DateTime, startDate)
                .input('EndDate', sql.DateTime, endDate)
                .query(`
                SELECT sp.MASP, sp.TENSP, SUM(ctdh.SOLUONG) AS TOTAL_SOLD
                FROM sanpham sp
                JOIN ctdonhang ctdh ON sp.MASP = ctdh.MASP
                JOIN donhang dh ON ctdh.MADH = dh.MADH
                WHERE dh.NGAYDH BETWEEN @StartDate AND @EndDate
                AND DH.TRANGTHAI = 1
                GROUP BY sp.MASP, sp.TENSP
                `);
            return res.recordset;
        } catch (err) {
            console.log('Lỗi: ' + err);
            throw err;
        }
    }

    async getMostSoldProduct(startDate, endDate) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('StartDate', sql.DateTime, startDate)
                .input('EndDate', sql.DateTime, endDate)
                .query(`
                SELECT TOP 3 sp.MASP, sp.TENSP, SUM(ctdh.SOLUONG) AS TOTAL_SOLD
                FROM sanpham sp
                JOIN ctdonhang ctdh ON sp.MASP = ctdh.MASP
                JOIN donhang dh ON ctdh.MADH = dh.MADH
                WHERE dh.NGAYDH BETWEEN @StartDate AND @EndDate
                AND DH.TRANGTHAI = 1
                GROUP BY sp.MASP, sp.TENSP
                ORDER BY SUM(ctdh.SOLUONG) DESC
                `);
            return res.recordset;
        } catch (err) {
            console.log('Lỗi: ' + err);
            throw err;
        }
    }

    async getTotalOrder(startDate, endDate) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('StartDate', sql.DateTime, startDate)
                .input('EndDate', sql.DateTime, endDate)
                .query(`
                SELECT COUNT(MADH) AS TOTAL_ORDER FROM DONHANG 
                WHERE NGAYDH BETWEEN @StartDate AND @EndDate AND TRANGTHAI = 1 
                `);
            return res.recordset;
        } catch (err) {
            console.log('Lỗi: ' + err);
            throw err;
        }
    }

    async getCustomer(startDate, endDate) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('StartDate', sql.DateTime, startDate)
                .input('EndDate', sql.DateTime, endDate)
                .query(`
                SELECT KH.*, KC.KHACHHANG_COUNT
                FROM KHACHHANG KH JOIN
                (SELECT MAKH, COUNT(MAKH) as KHACHHANG_COUNT
                FROM DONHANG
                WHERE NGAYDH BETWEEN @StartDate AND @EndDate
                GROUP BY MAKH) as KC
                ON KH.SDT1 = KC.MAKH
                ORDER BY KHACHHANG_COUNT DESC   
                `);
            return res.recordset;
        } catch (err) {
            console.log('Lỗi: ' + err);
            throw err;
        }
    }

    async getReceiptsReport(startDate, endDate, masp) {
        try {
            let query = `
            select pn.THOIGIAN, ctpn.MASP, sp.TENSP, ctpn.SOLUONG, ctpn.GIAVON, sp.GIABAN
            from CTPHIEUNHAP ctpn
            join PHIEUNHAP pn on ctpn.MAPN = pn.MAPN
            join SANPHAM sp on ctpn.MASP = sp.MASP
            where pn.THOIGIAN between @StartDate and @EndDate
            `

            if (masp != 0) {
                query += ` and ctpn.MASP = @MASP`
            }

            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('StartDate', sql.DateTime, startDate)
                .input('EndDate', sql.DateTime, endDate)
                .input('MASP', sql.Char, masp)
                .query(query);
            return res.recordset;
        } catch (err) {
            console.log('Lỗi: ' + err);
            throw err;
        }
    }

    async getOutputReport(startDate, endDate, masp) {
        try {
            let query = `
            select dh.NGAYDH, ctdh.MASP, sp.TENSP, ctdh.SOLUONG, sp.GIABAN, ctdh.THANHTIEN
            from CTDONHANG ctdh
            join DONHANG dh on ctdh.MADH = dh.MADH
            join SANPHAM sp on ctdh.MASP = sp.MASP
            where dh.NGAYDH between @StartDate and @EndDate
            `

            if (masp != 0) {
                query += ` and ctdh.MASP = @MASP`
            }

            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('StartDate', sql.DateTime, startDate)
                .input('EndDate', sql.DateTime, endDate)
                .input('MASP', sql.Char, masp)
                .query(query);
            return res.recordset;
        } catch (err) {
            console.log('Lỗi: ' + err);
            throw err;
        }
    }
}

module.exports = new Report();