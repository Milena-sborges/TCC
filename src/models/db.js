const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Lê o certificado CA do TiDB (Let's Encrypt)
const caCert = fs.readFileSync(
    path.join(__dirname, '..', 'certs', 'isrgrootx1.pem')
);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
        ca: caCert
    }
});

module.exports = pool;