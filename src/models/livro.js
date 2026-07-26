const db = require('./db');

const buscarPorContextoEmocional = async (humor, intencao) => {
    let tagAlvo = "";

    // Mapeamento das emoções para bater com as tags do MySQL
    if (humor === "felicidade") {
        tagAlvo = "Felicidade";
    } else if (humor === "tristeza") {
        tagAlvo = "Tristeza";
    } else if (humor === "ansiedade") {
        tagAlvo = "Ansiedade";
    } else if (humor === "tedio") {
        tagAlvo = "Tédio";
    } else {
        tagAlvo = "Neutro";
    }

    try {
        // Query corrigida: usa t.nome e l.link_leitura idênticos ao script .sql
        const [linhas] = await db.execute(`
            SELECT 
                l.id_livro, 
                l.titulo, 
                l.autor, 
                l.genero, 
                l.sinopse, 
                l.ano_publicacao,
                l.capa_url,
                l.link_leitura, 
                t.nome AS tag
            FROM Livro l
            JOIN Livro_Tag lt ON l.id_livro = lt.id_livro
            JOIN Tag_Emocional t ON lt.id_tag = t.id_tag
            WHERE t.nome LIKE ?
        `, [`%${tagAlvo}%`]);

        return linhas;
    } catch (error) {
        console.error("Erro ao buscar livros no banco:", error);
        throw error;
    }
};

const listarTodos = async () => {
    try {
        const [linhas] = await db.execute('SELECT * FROM Livro');
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