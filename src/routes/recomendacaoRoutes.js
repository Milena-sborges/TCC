const express = require('express');
const router = express.Router();
const RecomendacaoController = require('../controllers/recomendacaoController');
const verificarSessao = require('../middlewares/authMiddleware');

// interface principal 
router.get('/', verificarSessao, (req, res) => {
    res.render('inicio', { logado: true }); 
});
router.get('/recomendacoes', verificarSessao, (req, res) => {
    res.render('recomendacoes', { logado: true });
});
// validar/transformar
router.post('/recomendar', verificarSessao, RecomendacaoController.gerarRecomendacao);

// testes e listagem geral
router.get('/livros', verificarSessao, RecomendacaoController.listarLivros);

module.exports = router;