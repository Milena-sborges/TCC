const express = require('express');
const path = require('path');
const rotasRecomendacao = require('./src/routes/recomendacaoRoutes');
const session = require('express-session');
const rotasUsuario= require('./src/routes/usuarioRoutes');


const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'chave_secreta_emotionbooks', // Senha interna do servidor para proteger os cookies
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // false porque estamos rodando no localhost sem HTTPS
}));


    

app.use(express.static(path.join(__dirname, 'src', 'views', 'public')));
app.use(express.static(path.join(__dirname, 'src', 'views')));


app.use(rotasRecomendacao);
app.use(rotasUsuario);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});