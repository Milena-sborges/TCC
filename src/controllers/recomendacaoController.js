const Livro = require('../models/livro');

const gerarRecomendacao = async (req, res) => {
    const { humor, intencao } = req.body;
    
    // 1. Resgata o ID do usuário diretamente da sessão ativa
    const idUsuario = req.session.usuarioLogado?.id;

    if (!humor || !intencao) {
        return res.status(400).json({ error: 'Humor e intenção são obrigatórios.' });
    }

    // Trava de segurança extra
    if (!idUsuario) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        // 2. Passa o idUsuario para o Model fazer busca
        const livrosRecomendados = await Livro.buscarPorContextoEmocional(humor, intencao, idUsuario);
        
        return res.json({
            humorInformado: humor,
            intencaoInformada: intencao,
            recomendacoes: livrosRecomendados
        });
    } catch (error) {
        console.error("Erro no controlador:", error);
        return res.status(500).json({ error: 'Erro ao processar a recomendação.' });
    }
};

const listarLivros = async (req, res) => {
    try {
        const livros = await Livro.listarTodos();
        return res.json(livros);
    } catch (error) {
        console.error("Erro ao listar livros:", error);
        return res.status(500).json({ error: "Erro ao carregar livros do banco." });
    }
};

module.exports = {
    gerarRecomendacao,
    listarLivros
};