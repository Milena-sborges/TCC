const verificarSessao = (req, res, next) => {
    if (req.session && req.session.usuarioLogado) {
        return next(); // Tem o crachá, pode passar!
    }
    return res.redirect('/login'); // Não tem, vai pro login.
};

module.exports = verificarSessao;