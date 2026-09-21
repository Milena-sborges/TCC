
async function confirmarSair(event) {
    event.preventDefault();

    const r = await Swal.fire({
        title: 'Sair da conta?',
        text: 'Você será desconectado do EmotionBooks.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim, sair',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#8a6a47',
        cancelButtonColor: '#b0a89e',
        reverseButtons: true
    });

    if (r.isConfirmed) {
        window.location.href = '/sair';
    }
}