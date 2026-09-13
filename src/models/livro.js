const db = require('./db');

const buscarPorContextoEmocional = async (humor, intencao, idUsuario) => {
    let tagAlvo = "";

    const mapaRecomendacao = {
        'tristeza':   { alterar: 'Felicidade', manter: 'Tristeza' },
        'felicidade': { alterar: 'Felicidade', manter: 'Felicidade' },
        'ansiedade':  { alterar: 'Felicidade', manter: 'Ansiedade' },
        'tedio':      { alterar: 'Felicidade', manter: 'Tédio' }
    };

    tagAlvo = mapaRecomendacao[humor]?.[intencao] || 'Neutro';

    const mapaTags = { "Felicidade": 1, "Tristeza": 2, "Ansiedade": 3, "Tédio": 4, "Neutro": 5 };
    const idTagAlvo = mapaTags[tagAlvo];

    // ⬇️ NOVO: mapeia a EMOÇÃO SENTIDA (o que o usuário escolheu) para a tag do histórico
    const mapaEmocaoSentida = {
        'tristeza':   2,
        'felicidade': 1,
        'ansiedade':  3,
        'tedio':      4,
        'neutro':     5
    };
    const idEmocaoSentida = mapaEmocaoSentida[humor.toLowerCase()];

    if (!idTagAlvo) {
        console.error("Tag não encontrada para:", tagAlvo);
        return [];
    }

    try {
        // ⬇️ CORRIGIDO: registra a EMOÇÃO SENTIDA, não a tag alvo
        if (idUsuario && idEmocaoSentida) {
            await db.execute(
                'INSERT INTO historico (id_usuario, id_tag) VALUES (?, ?)',
                [idUsuario, idEmocaoSentida]
            );
        }

        // Busca livros da tag alvo (recomendação continua igual)
        const [linhas] = await db.execute(`
            SELECT 
                l.id_livro, l.titulo, l.autor, l.genero,
                l.sinopse, l.capa_url,
                l.link_leitura AS link_externo
            FROM livro l
            JOIN livro_tag lt ON l.id_livro = lt.id_livro
            JOIN tag_emocional t ON lt.id_tag = t.id_tag
            WHERE t.id_tag = ?
            AND l.id_livro NOT IN (
                SELECT id_livro FROM usuario_livro WHERE id_usuario = ?
            )
            ORDER BY RAND()
            LIMIT 3
        `, [idTagAlvo, idUsuario]);

        if (linhas.length === 0) {
            const [fallback] = await db.execute(`
                SELECT 
                    l.id_livro, l.titulo, l.autor, l.genero,
                    l.sinopse, l.capa_url,
                    l.link_leitura AS link_externo
                FROM livro l
                WHERE l.id_livro NOT IN (
                    SELECT id_livro FROM usuario_livro WHERE id_usuario = ?
                )
                ORDER BY RAND()
                LIMIT 3
            `, [idUsuario]);
            return fallback;
        }

        return linhas;

    } catch (error) {
        console.error("Erro ao buscar livros no banco:", error);
        throw error;
    }
};

const listarTodos = async () => {
    try {
        const [linhas] = await db.execute('SELECT * FROM livro');
        return linhas;
    } catch (error) {
        console.error("Erro ao listar todos os livros:", error);
        throw error;
    }
};

module.exports = {
    buscarPorContextoEmocional,
    listarTodos
};