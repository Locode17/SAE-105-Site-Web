document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger-menu');
    const body = document.body;
    const links = document.querySelectorAll('.mobile-links a');

    if (burger) {
        burger.addEventListener('click', () => {
            // Active/Désactive la classe 'menu-open' sur le body
            body.classList.toggle('menu-open');
        });
    }

    // Fermer le menu automatiquement quand on clique sur un lien
    links.forEach(link => {
        link.addEventListener('click', () => {
            body.classList.remove('menu-open');
        });
    });
});