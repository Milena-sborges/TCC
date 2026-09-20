/* =====================================================
   COMPONENTS — Navbar + Rodapé compartilhados
   Uso em qualquer página:
     <div id="navbar-container"></div>
     <div id="footer-container"></div>
     <script src="/js/components.js" defer></script>
===================================================== */

// ============== NAVBAR LOGADO ==============
const navbarLogado = `
    <nav class="navbar">
        <div class="logo">
            <a href="/" class="logo-link">
                <h2>📚 EmotionBooks</h2>
            </a>
        </div>
        <div class="nav-links">
            <a href="/">🏠 Início</a>
            <a href="/recomendacoes.html">✨ Recomendar</a>
            <a href="/biblioteca">📖 Biblioteca</a>
            <a href="/perfil">👤 Perfil</a>
            <a href="/sobre">Sobre</a>
            <a href="/ajuda">Ajuda</a>
            <a href="/contato">Contato</a>
            <a href="/sair" onclick="confirmarSair(event)">Sair</a>
        </div>
    </nav>
`;

// ============== NAVBAR DESLOGADO ==============
const navbarDeslogado = `
    <nav class="navbar">
        <div class="logo">
            <a href="/" class="logo-link">
                <h2>📚 EmotionBooks</h2>
            </a>
        </div>
        <div class="nav-links">
            <a href="/">🏠 Início</a>
            <a href="/sobre">Sobre</a>
            <a href="/ajuda">Ajuda</a>
            <a href="/contato">Contato</a>
            <a href="/login" class="btn-nav-login">Entrar</a>
        </div>
    </nav>
`;

// ============== RODAPÉ (igual nos dois) ==============
const rodapeHTML = `
    <footer class="site-footer">
        <p class="footer-copy">
            ©️ 2026 EmotionBooks. Todos os direitos reservados.
        </p>
        <p class="footer-links">
            <a href="/sobre">Sobre nós</a>
            <span>·</span>
            <a href="/ajuda">Ajuda</a>
            <span>·</span>
            <a href="/contato">Contato</a>
        </p>
    </footer>
`;

// ============== LÓGICA ==============
async function montarComponentes() {
    const navContainer = document.getElementById('navbar-container');
    const footContainer = document.getElementById('footer-container');

    if (navContainer) {
        try {
            const r = await fetch('/minha-biblioteca');
            // 401 = deslogado, qualquer outra coisa = logado
            if (r.status === 401) {
                navContainer.innerHTML = navbarDeslogado;
            } else {
                navContainer.innerHTML = navbarLogado;
            }
        } catch (e) {
            // Se der erro de rede, mostra a deslogada (mais seguro)
            navContainer.innerHTML = navbarDeslogado;
        }
    }

    if (footContainer) {
        footContainer.innerHTML = rodapeHTML;
    }
}

// Espera o DOM carregar e monta
document.addEventListener('DOMContentLoaded', montarComponentes);