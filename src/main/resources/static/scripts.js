// Função para garantir URL correta da imagem
function ensureImageUrl(url) {
    if (!url) return 'imagem/default-avatar.png';
    
    // Se já for uma URL absoluta, retorna como está
    if (url.startsWith('http') || url.startsWith('https')) {
        return url;
    }
    
    // Se começar com barra, remove para evitar dupla barra
    const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
    
    // Se já tiver o prefixo 'imagem/', usa direto, senão adiciona
    if (cleanUrl.startsWith('imagem/')) {
        return cleanUrl;
    }
    
    return `static/imagem/${cleanUrl}`;
}

// Função para lidar com erros de carregamento de imagem
function handleImageError(img) {
    img.src = 'static/imagem/default-avatar.png';
}

// Configuração do Swiper (Carrossel)
let swiper;

document.addEventListener('DOMContentLoaded', function() {
    swiper = new Swiper(".mySwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 3,
        initialSlide: 0,
        loop: true,
        loopedSlides: 3,
        speed: 1500,
        allowTouchMove: true,
        observer: true,
        observeParents: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            waitForTransition: false,
            stopOnLastSlide: false
        },
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        }
    });

    // Força o início do autoplay
    swiper.autoplay.start();

    // Reinicia o autoplay quando a página ficar visível
    document.addEventListener("visibilitychange", function() {
        if (!document.hidden) {
            swiper.autoplay.start();
        }
    });

    // Garante que o autoplay continue rodando
    setInterval(function() {
        if (swiper && !swiper.autoplay.running) {
            swiper.autoplay.start();
        }
    }, 2000);
});

// Função para carregar os dados do ranking
function carregarRanking() {
    fetch('/equipes')
        .then(response => response.json())
        .then(equipes => {
            // Ordenar equipes por pontos (maior para menor)
            equipes.sort((a, b) => b.ponto - a.ponto);
            
            const tableBody = document.getElementById('ranking-table-body');
            tableBody.innerHTML = ''; // Limpar tabela antes de adicionar novos dados
            
            equipes.forEach((equipe, index) => {
                const row = document.createElement('tr');
                
                // Adicionar classe especial para os três primeiros lugares
                if (index < 3) {
                    row.classList.add(`position-${index + 1}`);
                }

                // Formatar a data de atualização
                const dataAtualização = new Date(equipe.data_atualizacao);
                const dataFormatada = dataAtualização.toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                row.innerHTML = `
                    <td class="text-center">
                        <span class="position-medal ${index < 3 ? `position-${index + 1}` : ''}">
                            ${(index + 1).toString().padStart(2, '0')}º
                        </span>
                    </td>
                    <td class="equipe-cell">
                        <div class="d-flex align-items-center">
                            <img src="${ensureImageUrl(equipe.foto_do_lider)}" alt="Foto do líder ${equipe.nome_do_lider}" 
                                class="leader-photo leader-border me-3 rounded-circle" 
                                style="width: 60px; height: 60px; object-fit: cover;"
                                onerror="this.onerror=null; handleImageError(this);" 
                                loading="lazy">
                                <div>
                                <div class="fw-bold">${equipe.nome_da_equipe}</div>
                                <small style="color: var(--inv-amarelo)">Líder: ${equipe.nome_do_lider}</small>
                            </div>
                        </div>
                    </td>
                    <td class="text-center fw-bold">
                        ${equipe.ponto.toLocaleString('pt-BR')}
                        ${index === 0 ? '<i class="bi bi-trophy-fill text-warning ms-2"></i>' : ''}
                    </td>
                    <td class="text-center">
                        <img src="${equipe.tribo || 'imagem/default-avatar.png'}" 
                             alt="Foto da tribo" 
                             class="leader-photo tribe-photo"
                             onerror="this.src='imagem/default-avatar.png'"
                             style="width: 60px; height: 60px; object-fit: cover;">
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Erro ao carregar o ranking:', error));
}

// Função para compartilhar o ranking como imagem
async function compartilharRanking() {
    const button = document.querySelector('button[onclick="compartilharRanking()"]');
    const originalText = button.innerHTML;
    
    try {
        // Atualizar o botão para mostrar progresso
        button.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Gerando imagem...';
        button.disabled = true;

        // Criar um container temporário para a captura
        const tempContainer = document.createElement('div');
        tempContainer.style.backgroundColor = '#1A1A1A';
        tempContainer.style.padding = '30px';
        tempContainer.style.width = '1000px';
        
        // Clonar o conteúdo do ranking
        const rankingContent = document.querySelector('.ranking-container').cloneNode(true);

        // Preparar as imagens para captura
        const images = rankingContent.getElementsByTagName('img');
        const imageArray = Array.from(images);
        
        // Converter URLs e adicionar crossOrigin
        for (const img of imageArray) {
            img.dataset.originalSrc = img.src;
            const currentSrc = img.src;
            
            // Verificar se a URL já é absoluta
            if (currentSrc.startsWith('http') || currentSrc.startsWith('https')) {
                img.crossOrigin = 'anonymous';
                continue; // Manter a URL absoluta
            }
            
            // Para URLs relativas, construir a URL absoluta
            let filename;
            if (currentSrc.includes('imagem/')) {
                filename = currentSrc.split('imagem/')[1].split('?')[0];
            } else {
                filename = currentSrc.split('/').pop().split('?')[0];
            }
            
            // Determinar a URL base do servidor
            const baseUrl = window.location.origin;
            
            img.crossOrigin = 'anonymous';
            img.src = `${baseUrl}/imagem/${filename}`;
        }

        tempContainer.appendChild(rankingContent);
        document.body.appendChild(tempContainer);

        // Aguardar carregamento das imagens
        await new Promise(resolve => setTimeout(resolve, 500));

        // Capturar a imagem
        const canvas = await html2canvas(tempContainer, {
            backgroundColor: '#1A1A1A',
            scale: 2.5,
            useCORS: true,
            allowTaint: false,
            logging: true,
            imageTimeout: 0
        });

        // Limpar e restaurar
        document.body.removeChild(tempContainer);
        
        // Criar e acionar download
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'ranking-rally-das-equipes.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error('Erro ao gerar imagem:', error);
        alert('Erro ao gerar a imagem do ranking.');
    } finally {
        // Restaurar o botão
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

// Configuração do Swiper para o cronograma
var scheduleSwiper = new Swiper(".scheduleSwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

// Carregar o ranking quando a página carregar
document.addEventListener('DOMContentLoaded', carregarRanking);