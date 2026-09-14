const express = require('express');
const path = require('path');
const session = require('express-session');
const mysql = require('mysql2');                         
const MySQLStore = require('express-mysql-session')(session);

require('dotenv').config();

const rotasRecomendacao = require('./src/routes/recomendacaoRoutes');
const rotasUsuario = require('./src/routes/usuarioRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================
// POOL EXCLUSIVO PARA SESSÕES (com SSL do TiDB)
// =============================================

const sessionPool = mysql.createPool({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port:     process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
});

const sessionStore = new MySQLStore({
    createDatabaseTable: true,
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 1000 * 60 * 60 * 24 * 7
}, sessionPool);   // ⬅️ passa o pool pronto

// =============================================
// SESSÃO
// =============================================

app.use(session({
    key: 'connect.sid',
    secret: process.env.SESSION_SECRET || 'chave_secreta_emotionbooks_dev',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

// =============================================
// MIDDLEWARES E ROTAS
// =============================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'src', 'views', 'public')));
app.use(express.static(path.join(__dirname, 'src', 'views')));

app.use(rotasRecomendacao);
app.use(rotasUsuario);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});