// Funções auxiliares para tratamento de imagens
function ensureImageUrl(url) {
    if (!url) return 'imagem/default-avatar.png';
    
    // Se a URL já começar com /imagem/, retorna como está
    if (url.startsWith('/imagem/')) return url;
    
    // Se for uma URL completa, tenta extrair o nome do arquivo
    try {
        const filename = url.split('/').pop().split('?')[0];
        return `/imagem/${filename}`;
    } catch (e) {
        console.error('Erro ao processar URL da imagem:', e);
        return 'imagem/default-avatar.png';
    }
}

function handleImageError(img) {
    console.warn('Erro ao carregar imagem:', img.src);
    img.src = 'imagem/default-avatar.png';
}

// Carregar ranking quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    carregarRanking();
    
    // Recarregar a cada 60 segundos
    setInterval(carregarRanking, 60000);
});