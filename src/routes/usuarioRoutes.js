const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const verificarSessao = require('../middlewares/authMiddleware');

router.get('/login', usuarioController.carregarLogin);
router.get('/cadastro', usuarioController.carregarCadastro);
router.get('/perfil', usuarioController.carregarPerfil); // (O nosso futuro Dashboard!)
router.get('/sair', usuarioController.realizarLogout);
router.get('/minha-biblioteca', verificarSessao, usuarioController.listarMinhaBiblioteca);
router.get('/biblioteca', verificarSessao, usuarioController.carregarBiblioteca);

router.post('/cadastrar', usuarioController.cadastrarUsuario);
router.post('/login', usuarioController.realizarLogin);
router.post('/marcar-lido',verificarSessao, usuarioController.marcarComoLido);
router.post('/quero-ler', verificarSessao, usuarioController.marcarQueroLer);
router.post('/favoritar', verificarSessao, usuarioController.favoritarLivro);
router.post('/remover-livro', verificarSessao, usuarioController.removerDaBiblioteca);

module.exports = router;