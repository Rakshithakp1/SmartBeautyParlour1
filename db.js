
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pprs@123",
    database: "smart_beauty_parlour"
});

db.connect((err) => {
    if (err) {
        console.log("MySQL Connection Failed:", err.message);
    } else {
        console.log("MySQL Database Connected Successfully!");
    }
});

module.exports = db;
