const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuarioModel');

// =============================================
// PÁGINAS
// =============================================

const carregarPerfil = (req, res) => {
    res.sendFile('perfil.html', { root: './src/views' });
};

const carregarLogin = (req, res) => {
    const erro = req.query.erro;
    const cadastro = req.query.cadastro;
    res.sendFile('login.html', { root: './src/views' });
};

const carregarCadastro = (req, res) => {
    res.sendFile('cadastro.html', { root: './src/views' });
};

const carregarBiblioteca = (req, res) => {
    res.sendFile('biblioteca.html', { root: './src/views' });
};

// =============================================
// AUTENTICAÇÃO
// =============================================

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).send("Todos os campos são obrigatórios.");
    }

    try {
        // Verifica se o e-mail já existe
        const usuarioExistente = await usuarioModel.buscarUsuarioPorEmail(email);
        if (usuarioExistente) {
            return res.status(400).send("Este e-mail já está cadastrado.");
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);
        await usuarioModel.criarUsuario(nome, email, senhaCriptografada);

        console.log(`Usuário ${nome} cadastrado com sucesso!`);
        res.redirect('/login?cadastro=sucesso');

    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        res.status(500).send("Erro interno no servidor ao tentar cadastrar.");
    }
};

const realizarLogin = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).send("E-mail e senha são obrigatórios.");
    }

    try {
        const usuario = await usuarioModel.buscarUsuarioPorEmail(email);

        if (!usuario) {
            return res.redirect('/login?erro=credenciais');
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.redirect('/login?erro=credenciais');
        }

        req.session.usuarioLogado = {
            id: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email
        };

        console.log(`Usuário ${usuario.nome} fez login com sucesso!`);
        res.redirect('/');

    } catch (error) {
        console.error("Erro ao realizar login:", error);
        res.status(500).send("Erro interno no servidor.");
    }
};

const realizarLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Erro ao destruir sessão:", err);
            return res.status(500).send("Erro ao tentar sair.");
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
};

// =============================================
// AÇÕES DA BIBLIOTECA
// =============================================

const marcarComoLido = async (req, res) => {
    const { id_livro } = req.body;
    const id_usuario = req.session.usuarioLogado?.id;

    if (!id_livro || !id_usuario) {
        return res.status(400).json({ erro: "Dados inválidos." });
    }

    try {
        await usuarioModel.atualizarStatusLeitura(id_usuario, id_livro, 'Lido');
        res.status(200).json({ sucesso: true, mensagem: "Marcado como lido!" });
    } catch (error) {
        console.error("Erro ao salvar:", error);
        res.status(500).json({ erro: "Erro ao salvar no banco." });
    }
};

const marcarQueroLer = async (req, res) => {
    const { id_livro } = req.body;
    const id_usuario = req.session.usuarioLogado?.id;

    if (!id_livro || !id_usuario) {
        return res.status(400).json({ erro: "Dados inválidos." });
    }

    try {
        await usuarioModel.atualizarStatusLeitura(id_usuario, id_livro, 'Quero ler');
        res.status(200).json({ sucesso: true, mensagem: "Adicionado aos Quero Ler!" });
    } catch (error) {
        console.error("Erro ao salvar:", error);
        res.status(500).json({ erro: "Erro ao salvar no banco." });
    }
};

const favoritarLivro = async (req, res) => {
    const { id_livro, favorito } = req.body;
    const id_usuario = req.session.usuarioLogado?.id;

    if (!id_livro || id_usuario === undefined) {
        return res.status(400).json({ erro: "Dados inválidos." });
    }

    try {
        await usuarioModel.atualizarFavorito(id_usuario, id_livro, favorito);
        res.status(200).json({ sucesso: true, mensagem: "Favorito atualizado!" });
    } catch (error) {
        console.error("Erro ao favoritar:", error);
        res.status(500).json({ erro: "Erro ao favoritar no banco." });
    }
};

const removerDaBiblioteca = async (req, res) => {
    const { id_livro } = req.body;
    const id_usuario = req.session.usuarioLogado?.id;

    if (!id_livro || !id_usuario) {
        return res.status(400).json({ erro: "Dados inválidos para remoção." });
    }

    try {
        await usuarioModel.removerLivroBiblioteca(id_usuario, id_livro);
        res.status(200).json({ sucesso: true, mensagem: "Livro removido da sua biblioteca." });
    } catch (error) {
        console.error("Erro ao remover livro:", error);
        res.status(500).json({ erro: "Erro interno ao tentar remover." });
    }
};

// =============================================
// DADOS
// =============================================

const listarMinhaBiblioteca = async (req, res) => {
    const id_usuario = req.session.usuarioLogado?.id;
    
    if (!id_usuario) {
        return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    try {
        const meusLivros = await usuarioModel.buscarBibliotecaDoUsuario(id_usuario);
        const estatisticas = await usuarioModel.buscarEstatisticasEmocoes(id_usuario);
        
        res.status(200).json({ 
            usuario: req.session.usuarioLogado, 
            livros: meusLivros,
            emocoes: estatisticas
        });
    } catch (error) {
        console.error("Erro ao buscar a biblioteca:", error);
        res.status(500).json({ erro: "Erro interno ao carregar o perfil." });
    }
};

module.exports = {
    carregarPerfil,
    carregarLogin,
    carregarCadastro,
    carregarBiblioteca,
    cadastrarUsuario,
    realizarLogin,
    realizarLogout,
    marcarComoLido,
    marcarQueroLer,
    favoritarLivro,
    removerDaBiblioteca,
    listarMinhaBiblioteca
};