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
                
                row.innerHTML = `
                    <td>${index + 1}º</td>
                    <td><img src="${equipe.foto_do_lider}" alt="Foto do líder ${equipe.nome_do_lider}" class="leader-photo"></td>
                    <td>${equipe.nome_da_equipe}</td>
                    <td>${equipe.nome_do_lider}</td>
                    <td>${equipe.ponto}</td>
                `;
                
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Erro ao carregar o ranking:', error));
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