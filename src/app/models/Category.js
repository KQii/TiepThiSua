var config = require('../../config/db/index');
const sql = require('mssql');

class Category {

    async getCategories() {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request().query('SELECT * FROM LOAISP');
            return res.recordset;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async getCategoriesByMALOAI(MALOAI) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('MALOAI', sql.Char, MALOAI)
                .query('SELECT * FROM LOAISP WHERE MALOAI = @MALOAI');
            return res.recordset;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async destroyCategoryByMALOAI(MALOAI) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('MALOAI', sql.Int, MALOAI)
                .query('DELETE FROM LOAISP WHERE MALOAI = @MALOAI');
            return res.rowsAffected[0];
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async createCategory(TENLOAI) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('TENLOAI', sql.NVarChar, TENLOAI)
                .query(`
                INSERT INTO LOAISP (TENLOAI) VALUES (@TENLOAI)
                `);
            return res.rowsAffected[0] > 0;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async updateCategory(MALOAI, TENLOAI) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('MALOAI', sql.Int, MALOAI)
                .input('TENLOAI', sql.NVarChar, TENLOAI)
                .query('UPDATE LOAISP SET TENLOAI = @TENLOAI WHERE MALOAI = @MALOAI');
            return res.rowsAffected[0] > 0;
        } catch (err) {
            console.log(' Error :' + err);
        }
    }
    
}

module.exports = new Category();