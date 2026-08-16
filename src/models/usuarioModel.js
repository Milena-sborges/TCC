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
const atualizarStatusLeitura = async (idUsuario, idLivro, status) => {
    // Verifica se o livro já está na biblioteca do usuário
    const [existe] = await db.execute(
        'SELECT * FROM usuario_livro WHERE id_usuario = ? AND id_livro = ?',
        [idUsuario, idLivro]
    );

    if (existe.length > 0) {
        // Atualiza o status
        const query = `
            UPDATE usuario_livro 
            SET status_leitura = ? 
            WHERE id_usuario = ? AND id_livro = ?
        `;
        const [resultado] = await db.execute(query, [status, idUsuario, idLivro]);
        return resultado;
    } else {
        // Insere novo registro
        const query = `
            INSERT INTO usuario_livro (id_usuario, id_livro, status_leitura, favorito) 
            VALUES (?, ?, ?, 0)
        `;
        const [resultado] = await db.execute(query, [idUsuario, idLivro, status]);
        return resultado;
    }
};

const atualizarFavorito = async (idUsuario, idLivro, isFavorito) => {
    const favoritoValor = isFavorito ? 1 : 0;
    
    // Verifica se o livro já está na biblioteca do usuário
    const [existe] = await db.execute(
        'SELECT * FROM usuario_livro WHERE id_usuario = ? AND id_livro = ?',
        [idUsuario, idLivro]
    );

    if (existe.length > 0) {
        // Atualiza o favorito
        const query = `
            UPDATE usuario_livro 
            SET favorito = ? 
            WHERE id_usuario = ? AND id_livro = ?
        `;
        const [resultado] = await db.execute(query, [favoritoValor, idUsuario, idLivro]);
        return resultado;
    } else {
        // Insere novo registro com status padrão 'Quero ler'
        const query = `
            INSERT INTO usuario_livro (id_usuario, id_livro, status_leitura, favorito) 
            VALUES (?, ?, 'Quero ler', ?)
        `;
        const [resultado] = await db.execute(query, [idUsuario, idLivro, favoritoValor]);
        return resultado;
    }
};

const buscarBibliotecaDoUsuario = async (idUsuario) => {
    const query = `
        SELECT 
            l.id_livro, 
            l.titulo, 
            l.autor, 
            l.genero,
            l.sinopse,
            l.capa_url, 
            l.link_leitura,
            ul.status_leitura, 
            ul.favorito
        FROM livro l
        JOIN usuario_livro ul ON l.id_livro = ul.id_livro
        WHERE ul.id_usuario = ?
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
    atualizarStatusLeitura, 
    atualizarFavorito,
    buscarBibliotecaDoUsuario,
    buscarEstatisticasEmocoes,
    removerLivroBiblioteca
};