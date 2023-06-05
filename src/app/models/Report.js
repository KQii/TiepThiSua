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
}

module.exports = new Report();