document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONDITION DE SÉCURITÉ ---
    // Si on n'est pas sur la page d'accueil (pas de .gallery-track), on arrête le script ici.
    // Cela permet de retrouver le scroll vertical normal sur les autres pages.
    const track = document.querySelector('.gallery-track');
    if (!track) return; 

    // Sélectionne toutes les images de la galerie
    const placeholders = () => Array.from(document.querySelectorAll('.gallery-track .image'));
    const progressBar = document.querySelector('.progress-bar');
    
    let busy = false;
    let currentIndex = 0; 

    // Initialisation de la barre de progression au chargement
    updateProgress();

    function updateProgress() {
        const items = placeholders();
        const total = items.length;
        const percentage = ((currentIndex + 1) / total) * 100;
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
    }

    function rotate(direction) {
        if (busy) return;
        busy = true;

        const places = placeholders();
        if (places.length < 2) {
            busy = false;
            return;
        }

        // --- Mise à jour index barre de progression ---
        if (direction === 'right') {
            currentIndex++;
            if (currentIndex >= places.length) currentIndex = 0;
        } else {
            currentIndex--;
            if (currentIndex < 0) currentIndex = places.length - 1;
        }
        updateProgress();

        // --- Logique de rotation SANS CLONES (transform uniquement, timers) ---
        const current = places.map(p => p.innerHTML);
        const rotated = direction === 'right'
            ? current.slice(1).concat(current.slice(0,1))
            : current.slice(-1).concat(current.slice(0,-1));

        const DURATION_MS = 20;
        const EASING = 'cubic-bezier(.2,.8,.2,1)';
        const OFFSET = 10;

        // Phase 1: décaler légèrement
        places.forEach(p => {
            p.style.transition = `transform ${DURATION_MS}ms ${EASING}`;
            p.style.willChange = 'transform';
            p.style.transform = direction === 'right' ? `translate3d(-${OFFSET}px,0,0)` : `translate3d(${OFFSET}px,0,0)`;
        });

        // Après le décalage, swap le contenu
        setTimeout(() => {
            places.forEach((p, i) => {
                p.innerHTML = rotated[i];
            });

            // Phase 2: revenir à 0
            places.forEach(p => {
                p.style.transform = 'translate3d(0,0,0)';
            });

            // Fin: nettoyer, débloquer
            setTimeout(() => {
                places.forEach(p => {
                    p.style.transition = '';
                    p.style.willChange = '';
                });
                busy = false;
            }, DURATION_MS);
        }, DURATION_MS);
    }

    const rotateContentsRight = () => rotate('right');
    const rotateContentsLeft = () => rotate('left');

    // --- Gestion du Scroll et Swipe ---
    let lastWheelTime = 0;
    const WHEEL_THROTTLE_MS = 100;
    const WHEEL_THRESHOLD = 30;
    const mainEl = document.querySelector('.main');
    
    if (mainEl) {
        mainEl.addEventListener('wheel', (e) => {
            // IMPORTANT : On preventDefault SEULEMENT si on est sur la home
            // (La condition au début du fichier gère ça, mais par sécurité :)
            e.preventDefault();
            
            const now = Date.now();
            if (now - lastWheelTime < WHEEL_THROTTLE_MS) return;

            if (e.deltaY > WHEEL_THRESHOLD || e.deltaX > WHEEL_THRESHOLD) {
                lastWheelTime = now;
                rotateContentsRight();
            } 
            else if (e.deltaY < -WHEEL_THRESHOLD || e.deltaX < -WHEEL_THRESHOLD) {
                lastWheelTime = now;
                rotateContentsLeft();
            }
        }, {passive: false});
    }

    // Touch swipe support
    let startX = null;
    if (mainEl) {
        mainEl.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, {passive: true});

        mainEl.addEventListener('touchend', (e) => {
            if (startX === null) return;
            const endX = e.changedTouches[0].clientX;
            const dx = endX - startX;
            if (dx > 50) rotateContentsRight(); 
            else if (dx < -50) rotateContentsLeft();
            startX = null;
        });
    }

    // Clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') rotateContentsRight();
        if (e.key === 'ArrowLeft') rotateContentsLeft();
    });
});