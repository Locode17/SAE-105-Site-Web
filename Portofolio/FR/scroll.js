document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('bouton-fleche');

    if (btn) {
        btn.addEventListener('click', function() {
            // Au lieu d'aller à un point fixe, on descend de 70% de la hauteur de l'écran actuel.
            // Cela permet de cliquer plusieurs fois pour continuer à descendre.
            const scrollAmount = window.innerHeight * 0.7; 

            window.scrollBy({
                top: scrollAmount,
                behavior: "smooth"
            });
        });
    }
});