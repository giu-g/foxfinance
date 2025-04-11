// Variáveis
let currentIndex = 0;
const items = document.querySelectorAll('.carousel-item');

// Função para mostrar o slide atual e esconder os outros
function showSlide(index) {
    // Oculta todos os slides
    items.forEach(item => item.classList.remove('active'));
    
    // Mostra o slide atual
    items[index].classList.add('active');
}

// Função para a troca automática dos slides
function autoSlide() {
    currentIndex = (currentIndex + 1) % items.length;  // Avança para o próximo slide
    showSlide(currentIndex);
}

// Inicializa a exibição do primeiro slide
showSlide(currentIndex);

// Configura a troca automática de slides
setInterval(autoSlide, 4000);

// Obtém os elementos
const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');

// Adiciona evento de clique no ícone do hambúrguer
hamburger.addEventListener('click', () => {
    navbar.classList.toggle('active'); // Alterna a classe 'active' para mostrar/ocultar o menu
    hamburger.classList.toggle('active'); // Alterna o estilo do hambúrguer
});
