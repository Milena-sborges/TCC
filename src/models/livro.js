const db = require('./db');

const buscarPorContextoEmocional = async (humor, intencao, idUsuario) => {
    let tagAlvo = "";

     const mapaRecomendacao = {
        // TRISTEZA: manter = acolher | alterar = alegria/leveza
        'tristeza':   { manter: 'Tristeza',   alterar: 'Felicidade' },

        // FELICIDADE: manter = reforçar | alterar = drama (aprofundar empatia)
        'felicidade': { manter: 'Felicidade', alterar: 'Tristeza' },

        // ANSIEDADE: manter = suspense (canalizar) | alterar = neutro (calmaria)
        'ansiedade':  { manter: 'Ansiedade',  alterar: 'Neutro' },

        // TÉDIO: manter = neutro (não reforçar tédio) | alterar = ansiedade (adrenalina)
        'tedio':      { manter: 'Tédio',     alterar: 'Ansiedade' },

        // NEUTRO: manter = neutro | alterar = qualquer uma das 4 emoções
        // (definido abaixo como sorteio)
        'neutro':     { manter: 'Neutro',     alterar: 'Aleatorio' }
    };
     const humorNorm = humor.toLowerCase().trim();

    tagAlvo = mapaRecomendacao[humorNorm]?.[intencao] || 'Neutro';

    // =============================================
    // NEUTRO + ALTERAR → escolhe uma das 4 emoções aleatoriamente
    // =============================================
    if (tagAlvo === 'Aleatorio') {
        const emocaoAleatoria = ['Felicidade', 'Tristeza', 'Ansiedade', 'Tédio'];
        tagAlvo = emocaoAleatoria[Math.floor(Math.random() * emocaoAleatoria.length)];
    }

    const mapaTags = { "Felicidade": 1, "Tristeza": 2, "Ansiedade": 3, "Tédio": 4, "Neutro": 5 };
    const idTagAlvo = mapaTags[tagAlvo];

    // =============================================
    // HISTÓRICO: registra a EMOÇÃO SENTIDA, não a tag alvo
    // =============================================
    const mapaEmocaoSentida = {
        'tristeza':   2,
        'felicidade': 1,
        'ansiedade':  3,
        'tedio':      4,
        'neutro':     5
    };
    const idEmocaoSentida = mapaEmocaoSentida[humorNorm];

    if (!idTagAlvo) {
        console.error("Tag não encontrada para:", tagAlvo);
        return [];
    }

    try {
        // Registra a emoção sentida no histórico
        if (idUsuario && idEmocaoSentida) {
            await db.execute(
                'INSERT INTO historico (id_usuario, id_tag) VALUES (?, ?)',
                [idUsuario, idEmocaoSentida]
            );
        }

        // Busca livros da tag alvo que o usuário ainda não tem
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
            LIMIT 6
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
                LIMIT 6
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