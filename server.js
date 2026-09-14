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
// CONFIGURAÇÃO DE SESSÃO PERSISTENTE (MySQL)
// =============================================

const sessionStore = new MySQLStore({
    host:     process.env.DB_HOST     || 'localhost',
    port:     process.env.DB_PORT     || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'biblioteca_emocional_bd',
    createDatabaseTable: true,   // cria a tabela "sessions" sozinho na primeira execução
    clearExpired: true,
    checkExpirationInterval: 900000,  // limpa sessões expiradas a cada 15 min
    expiration: 1000 * 60 * 60 * 24 * 7  // 7 dias
});

app.use(session({
    key: 'connect.sid',
    secret: process.env.SESSION_SECRET || 'chave_secreta_emotionbooks_dev',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProduction,      // true no Render (HTTPS), false no localhost
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7  // 7 dias
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