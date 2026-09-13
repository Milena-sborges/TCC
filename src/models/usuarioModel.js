const db = require('./db'); 

const buscarUsuarioPorEmail = async (email) => {
    const query = 'SELECT * FROM Usuario WHERE email = ?';
    const [usuarios] = await db.execute(query, [email]);
    return usuarios[0]; 
};


const buscarUsuarioPorId = async (idUsuario) => {
    const query = 'SELECT id_usuario, nome, email FROM Usuario WHERE id_usuario = ?';
    const [usuarios] = await db.execute(query, [idUsuario]);
    return usuarios[0];
};

const criarUsuario = async (nome, email, senhaCriptografada) => {
    const query = 'INSERT INTO Usuario (nome, email, senha) VALUES (?, ?, ?)';
    const [resultado] = await db.execute(query, [nome, email, senhaCriptografada]);
    return resultado;
};

// verificação se já existe antes de inserir
const alternarStatusLeitura = async (idUsuario, idLivro, status) => {
    const [existe] = await db.execute(
        'SELECT * FROM usuario_livro WHERE id_usuario = ? AND id_livro = ?',
        [idUsuario, idLivro]
    );

    // ==== DESMARCAR O MESMO STATUS ====
    if (existe.length > 0 && existe[0].status_leitura === status) {

        // Se é Lido COM favorito → perde favorito e volta pra "Quero ler"
        if (status === 'Lido' && existe[0].favorito === 1) {
            await db.execute(
                "UPDATE usuario_livro SET status_leitura = 'Quero ler', favorito = 0 WHERE id_usuario = ? AND id_livro = ?",
                [idUsuario, idLivro]
            );
            return { acao: 'removido_com_favorito' };
        }

        // Se é Lido SEM favorito → volta pra "Quero ler"
        if (status === 'Lido') {
            await db.execute(
                "UPDATE usuario_livro SET status_leitura = 'Quero ler' WHERE id_usuario = ? AND id_livro = ?",
                [idUsuario, idLivro]
            );
            return { acao: 'voltou_para_quero_ler' };
        }

        // Se é "Quero ler" → aí sim deleta de vez
        await db.execute(
            'DELETE FROM usuario_livro WHERE id_usuario = ? AND id_livro = ?',
            [idUsuario, idLivro]
        );
        return { acao: 'removido' };
    }

    // ==== TROCAR / ADICIONAR ====
    if (existe.length > 0) {
        const perdeFavorito = status === 'Quero ler' && existe[0].favorito === 1;

        await db.execute(
            'UPDATE usuario_livro SET status_leitura = ?, favorito = ? WHERE id_usuario = ? AND id_livro = ?',
            [status, perdeFavorito ? 0 : existe[0].favorito, idUsuario, idLivro]
        );
        return { acao: 'atualizado', perdeuFavorito: perdeFavorito };
    }

    // Não existia → insere
    await db.execute(
        'INSERT INTO usuario_livro (id_usuario, id_livro, status_leitura, favorito) VALUES (?, ?, ?, 0)',
        [idUsuario, idLivro, status]
    );
    return { acao: 'adicionado' };
};
const atualizarFavorito = async (idUsuario, idLivro, isFavorito) => {
    const favoritoValor = isFavorito ? 1 : 0;

    const [existe] = await db.execute(
        'SELECT * FROM usuario_livro WHERE id_usuario = ? AND id_livro = ?',
        [idUsuario, idLivro]
    );

    // ==== DESFAVORITAR ====
    if (!isFavorito) {
        if (existe.length > 0) {
            await db.execute(
                'UPDATE usuario_livro SET favorito = 0 WHERE id_usuario = ? AND id_livro = ?',
                [idUsuario, idLivro]
            );
            // Se não tem status → apaga linha fantasma
            await db.execute(
                'DELETE FROM usuario_livro WHERE id_usuario = ? AND id_livro = ? AND favorito = 0 AND status_leitura IS NULL',
                [idUsuario, idLivro]
            );
        }
        return { acao: 'desfavoritado' };
    }

    // ==== FAVORITAR — regra: precisa estar Lido ====
    if (existe.length === 0) {
        // Não existia: cria já com Lido (veio do "favoritar e marcar como lido")
        await db.execute(
            'INSERT INTO usuario_livro (id_usuario, id_livro, status_leitura, favorito) VALUES (?, ?, \'Lido\', 1)',
            [idUsuario, idLivro]
        );
        return { acao: 'favoritado_com_lido' };
    }

    // Já existia: força status Lido e marca favorito
    await db.execute(
        'UPDATE usuario_livro SET favorito = 1, status_leitura = \'Lido\' WHERE id_usuario = ? AND id_livro = ?',
        [idUsuario, idLivro]
    );
    return { acao: 'favoritado' };
};

const buscarBibliotecaDoUsuario = async (idUsuario) => {
    const query = `
        SELECT 
            l.id_livro, l.titulo, l.autor, l.genero,
            l.sinopse, l.capa_url, l.link_leitura,
            ul.status_leitura, ul.favorito
        FROM livro l
        JOIN usuario_livro ul ON l.id_livro = ul.id_livro
        WHERE ul.id_usuario = ?
          AND ul.status_leitura IS NOT NULL
        ORDER BY ul.favorito DESC, l.titulo ASC
    `;
    const [livros] = await db.execute(query, [idUsuario]);
    return livros;
};

// Busca as estatísticas de emoções do usuário
const buscarEstatisticasEmocoes = async (idUsuario) => {
    // 1. Conta o total de emoções buscadas
    const [totalResult] = await db.execute('SELECT COUNT(*) as total FROM historico WHERE id_usuario = ?', [idUsuario]);
    
    // 2. Descobre qual emoção ele mais pesquisou (A Campeã)
    const [frequenteResult] = await db.execute(`
        SELECT t.nome 
        FROM historico h
        JOIN tag_emocional t ON h.id_tag = t.id_tag
        WHERE h.id_usuario = ?
        GROUP BY t.id_tag, t.nome
        ORDER BY COUNT(*) DESC
        LIMIT 1
    `, [idUsuario]);

    // 3. NOVO: Puxa as 3 últimas emoções pesquisadas
    // Usamos id_historico DESC para pegar os mais recentes
    const [ultimasResult] = await db.execute(`
        SELECT t.nome 
        FROM historico h
        JOIN tag_emocional t ON h.id_tag = t.id_tag
        WHERE h.id_usuario = ?
        ORDER BY h.id_historico DESC
        LIMIT 3
    `, [idUsuario]);

    // Transforma o resultado do banco em uma lista simples (Array)
    const ultimasEmocoes = ultimasResult.map(linha => linha.nome);

    return {
        total: totalResult[0].total,
        maisFrequente: frequenteResult.length > 0 ? frequenteResult[0].nome : "Nenhuma",
        ultimas: ultimasEmocoes // Manda a lista nova para o controller
    };
};

const removerLivroBiblioteca = async (idUsuario, idLivro) => {
    const query = 'DELETE FROM usuario_livro WHERE id_usuario = ? AND id_livro = ?';
    const [resultado] = await db.execute(query, [idUsuario, idLivro]);
    return resultado;
};

module.exports = {
    buscarUsuarioPorEmail,
    buscarUsuarioPorId,
    criarUsuario,
    alternarStatusLeitura,
    atualizarFavorito,
    buscarBibliotecaDoUsuario,
    buscarEstatisticasEmocoes,
    removerLivroBiblioteca
};