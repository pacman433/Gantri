const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

console.log("Connected to database " + process.env.DB_NAME);

const query = (query, values) => {
    return new Promise((resolve, reject) => {
        pool.execute(query, values, (err, elements) => {
            if(err) {
                console.log("Looking at error " + err);
                return reject(err);
            }
            return resolve(elements);
        })
    })
}

exports.query = query;