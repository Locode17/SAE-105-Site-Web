document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger-menu');
    const body = document.body;
    const links = document.querySelectorAll('.mobile-links a');

    if (burger) {
        burger.addEventListener('click', () => {
            body.classList.toggle('menu-open');
        });
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            body.classList.remove('menu-open');
        });
    });
});