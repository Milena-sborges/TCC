
const Livro = require('../models/livro');

const gerarRecomendacao = async (req, res) => {
    const { humor, intencao } = req.body;

    if (!humor || !intencao) {
        return res.status(400).json({ error: 'Humor e intenção são obrigatórios.' });
    }

    try {
        const livrosRecomendados = await Livro.buscarPorContextoEmocional(humor, intencao);

        
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