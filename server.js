const express = require('express');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const rotasRecomendacao = require('./src/routes/recomendacaoRoutes');
const rotasUsuario = require('./src/routes/usuarioRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// =============================================
// SESSÃO PERSISTENTE NO TiDB
// (usa os MESMOS nomes de env do seu db.js)
// =============================================

const sessionStore = new MySQLStore({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    user:     process.env.DB_USERNAME,      // ⬅️ igual ao db.js
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,      // ⬅️ igual ao db.js
    ssl: {                                   // ⬅️ TiDB Cloud EXIGE SSL
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    },
    createDatabaseTable: true,
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 1000 * 60 * 60 * 24 * 7
});

app.use(session({
    key: 'connect.sid',
    secret: process.env.SESSION_SECRET || 'chave_secreta_emotionbooks_dev',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,           // ⬅️ deixa FALSE pra funcionar no localhost e no Render free
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