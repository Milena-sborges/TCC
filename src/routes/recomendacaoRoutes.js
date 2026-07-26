const express = require('express');
const router = express.Router();
const RecomendacaoController = require('../controllers/RecomendacaoController');

// interface principal
router.get('/', (req, res) => {
    res.sendFile('index.html');
});

// validar/transofrmar
router.post('/recomendar', RecomendacaoController.gerarRecomendacao);


//  testes e listagem geral
router.get('/livros', RecomendacaoController.listarLivros);

module.exports = router;