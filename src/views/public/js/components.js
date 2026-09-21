/* =====================================================
   COMPONENTS — Navbar + Rodapé compartilhados
   Com cache para carregamento instantâneo
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
            <a href="/">Início</a>
           
            <a href="/biblioteca">Biblioteca</a>
            <a href="/perfil">Perfil</a>
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
                <h2📚 EmotionBooks</h2>
            </a>
        </div>
        <div class="nav-links">
            <a href="/">Início</a>
            <a href="/sobre">Sobre</a>
            <a href="/ajuda">Ajuda</a>
            <a href="/contato">Contato</a>
            <a href="/login" class="btn-nav-login">Entrar</a>
        </div>
    </nav>
`;

// ============== RODAPÉ ==============
const rodapeHTML = `
    <footer class="site-footer">
        <p class="footer-copy">
            © 2026 EmotionBooks. Todos os direitos reservados.
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

    // ---- NAVBAR ----
    if (navContainer) {
        // 1. Tenta ler do cache PRIMEIRO (instantâneo)
        const cache = sessionStorage.getItem('eb_navbar_logado');

        if (cache === 'true') {
            navContainer.innerHTML = navbarLogado;
        } else if (cache === 'false') {
            navContainer.innerHTML = navbarDeslogado;
        } else {
            // 2. Não tem cache → mostra um placeholder bege até decidir
            navContainer.innerHTML = `
                <nav class="navbar navbar-placeholder">
                    <div class="logo">
                        <a href="/" class="logo-link">
                            <h2>EmotionBooks</h2>
                        </a>
                    </div>
                </nav>
            `;
        }

        // 3. Em background, verifica o status real e atualiza se preciso
        fetch('/minha-biblioteca')
            .then(r => {
                const logado = r.status !== 401;
                sessionStorage.setItem('eb_navbar_logado', logado ? 'true' : 'false');

                // Só re-renderiza se o cache estava errado/vazio
                const esperado = logado ? navbarLogado : navbarDeslogado;
                if (navContainer.innerHTML !== esperado) {
                    navContainer.innerHTML = esperado;
                }
            })
            .catch(() => {
                // Se falhar, assume deslogado e guarda
                sessionStorage.setItem('eb_navbar_logado', 'false');
                navContainer.innerHTML = navbarDeslogado;
            });
    }

    // ---- RODAPÉ ----
    if (footContainer) {
        footContainer.innerHTML = rodapeHTML;
    }
}

// Limpa o cache quando o usuário sai (pro "Sair" funcionar de verdade)
window.addEventListener('beforeunload', (e) => {
    // Se estiver indo pra /sair, limpa o cache
    if (window.location.pathname === '/sair' || document.activeElement?.href?.includes('/sair')) {
        sessionStorage.removeItem('eb_navbar_logado');
    }
});

// Espera o DOM carregar e monta
document.addEventListener('DOMContentLoaded', montarComponentes);