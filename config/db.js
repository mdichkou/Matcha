const mysql = require("mysql");
const config = require("config");
const db = config.get("con");

const pool = mysql.createPool(db);

const conn = async () => {
  pool.getConnection(err => {
    if (err) console.error(err.stack);
  });
};

conn();

module.exports = pool;
