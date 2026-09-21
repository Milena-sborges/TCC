const express = require('express');
const router = express.Router();
const RecomendacaoController = require('../controllers/recomendacaoController');
const verificarSessao = require('../middlewares/authMiddleware');

// Rota da página de recomendações (frontend)
router.get('/recomendacoes', verificarSessao, (req, res) => {
    res.render('recomendacoes', { logado: true });
});

// API para o motor
router.post('/recomendar', verificarSessao, RecomendacaoController.gerarRecomendacao);

// Listagem geral
router.get('/livros', verificarSessao, RecomendacaoController.listarLivros);

module.exports = router;