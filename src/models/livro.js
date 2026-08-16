const db = require('./db');

const buscarPorContextoEmocional = async (humor, intencao, idUsuario) => {
    let tagAlvo = "";

    // Motor de Recomendação melhorado
    const mapaRecomendacao = {
        'tristeza': { alterar: 'Felicidade', manter: 'Tristeza' },
        'felicidade': { alterar: 'Felicidade', manter: 'Felicidade' },
        'ansiedade': { alterar: 'Felicidade', manter: 'Ansiedade' },
        'tedio': { alterar: 'Felicidade', manter: 'Tédio' }
    };

    tagAlvo = mapaRecomendacao[humor]?.[intencao] || 'Neutro';

    const mapaTags = { "Felicidade": 1, "Tristeza": 2, "Ansiedade": 3, "Tédio": 4, "Neutro": 5 };
    const idTagAlvo = mapaTags[tagAlvo];

    if (!idTagAlvo) {
        console.error("Tag não encontrada para:", tagAlvo);
        return [];
    }

    try {
        // Registra o comportamento no histórico
        if (idUsuario && idTagAlvo) {
            await db.execute(
                'INSERT INTO historico (id_usuario, id_tag) VALUES (?, ?)',
                [idUsuario, idTagAlvo]
            );
        }

        // Busca livros da tag alvo que o usuário NÃO tem
        const [linhas] = await db.execute(`
            SELECT 
                l.id_livro, 
                l.titulo, 
                l.autor, 
                l.genero, 
                l.sinopse, 
                l.capa_url,
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

        // Se não encontrar livros, busca recomendações genéricas
        if (linhas.length === 0) {
            const [fallback] = await db.execute(`
                SELECT 
                    l.id_livro, 
                    l.titulo, 
                    l.autor, 
                    l.genero, 
                    l.sinopse, 
                    l.capa_url,
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