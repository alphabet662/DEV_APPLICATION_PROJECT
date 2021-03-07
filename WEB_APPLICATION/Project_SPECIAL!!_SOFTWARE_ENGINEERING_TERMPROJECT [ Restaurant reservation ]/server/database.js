const mysql = require("mysql");
const dotenv = require('dotenv');
dotenv.config();

function connectDB(){
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DBNAME,
        charset: process.env.DB_CHARSET,
    });
}
module.exports = connectDB();