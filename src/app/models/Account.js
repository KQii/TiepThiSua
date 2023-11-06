var config = require('../../config/db/index');
const sql = require('mssql');

class Account {
    async getAccounts(reqQuery) {
        try {
            let query = `SELECT * FROM TAIKHOAN`;

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

    async destroyAccountByTENTK(TENTK) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('TENTK', sql.Char, TENTK)
                .query('DELETE FROM TAIKHOAN WHERE TENTK = @TENTK');
            return res.rowsAffected[0];
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    async createAccount(TENTK, MATKHAU) {
        try {
            let pool = await sql.connect(config);
            let res = await pool.request()
                .input('TENTK', sql.Char, TENTK)
                .input('MATKHAU', sql.NVarChar, MATKHAU)
                .query('INSERT INTO TAIKHOAN VALUES (@TENTK, @MATKHAU, 0)');
            return res.rowsAffected[0];
        } catch (err) {
            console.log(' Error :' + err);
        }
    }

    // Hàm lấy người dùng bằng phonenumber
    async getUserByPhonenumber(phonenumber) {
        try {
            let pool = await sql.connect(config);
            let result = await pool
                .request()
                .input("phonenumber", sql.Char, phonenumber)
                .query("SELECT * FROM TAIKHOAN WHERE TENTK = @phonenumber");

            if (result.recordset.length > 0) {
                // Return the user object if found
                return result.recordset[0];
            } else {
                return null; // Return null if no user found with the phonenumber
            }
        } catch (err) {
            console.log("Error: " + err);
            throw err; // Throw the error to be handled in the controller
        }
    }

    // Hàm lấy người dùng bằng id
    async getUserById(id) {
        try {
            let pool = await sql.connect(config);
            let result = await pool
                .request()
                .input("id", sql.Int, id)
                .query("SELECT * FROM TAIKHOAN WHERE Id = @id");

            if (result.recordset.length > 0) {
                // Return the user object if found
                return result.recordset[0];
            } else {
                return null; // Return null if no user found with the id
            }
        } catch (err) {
            console.log("Error: " + err);
            throw err; // Throw the error to be handled in the controller
        }
    }
  
}

module.exports = new Account();