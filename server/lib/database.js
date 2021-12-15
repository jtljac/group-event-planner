'use strict';
const mysql = require('mysql2');

const con = mysql.createConnection({
    host: "localhost",
    user: "christmas",
    password: "christmasPassword",
    database: "christmas"
});


exports.query = async (query, params = []) => {
    const [rows, fields] = await con.promise().query(query, params);
    return rows;
}

exports.conn = con;