const express = require('express');
const router = express.Router();
const RecomendacaoController = require('../controllers/recomendacaoController');
const verificarSessao = require('../middlewares/authMiddleware');

// interface principal 
router.get('/', verificarSessao, (req, res) => {
    
    res.sendFile('inicio.html', { root: './src/views' }); 
});

// validar/transformar
router.post('/recomendar', verificarSessao, RecomendacaoController.gerarRecomendacao);

// testes e listagem geral
router.get('/livros', verificarSessao, RecomendacaoController.listarLivros);

module.exports = router;