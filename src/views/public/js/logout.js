/* =====================================================
   CONFIRMAÇÃO DE SAIR — compartilhada entre páginas
===================================================== */
async function confirmarSair(event) {
    event.preventDefault();

    const r = await Swal.fire({
        title: 'Sair da conta?',
        text: 'Você será desconectado do EmotionBooks.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim, sair',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#8b7355',
        cancelButtonColor: '#b0a89e',
        reverseButtons: true
    });

    if (r.isConfirmed) {
        sessionStorage.removeItem('eb_navbar_logado');
        window.location.href = '/sair';
    }
}