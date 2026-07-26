const express = require('express');
const path = require('path');
const rotasRecomendacao = require('./src/routes/recomendacaoRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'src', 'views', 'public')));
app.use(express.static(path.join(__dirname, 'src', 'views')));


app.use(rotasRecomendacao);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});