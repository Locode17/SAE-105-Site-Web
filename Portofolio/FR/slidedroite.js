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

        // --- Logique de rotation ---
        const current = places.map(p => p.innerHTML);
        const rotated = direction === 'right'
            ? current.slice(1).concat(current.slice(0,1))
            : current.slice(-1).concat(current.slice(0,-1));

        places.forEach(p => p.style.opacity = '0.6');

        const animations = [];
        places.forEach((p, i) => {
            const rect = p.getBoundingClientRect();
            
            const outClone = p.cloneNode(true);
            Object.assign(outClone.style, {
                position: 'fixed',
                left: rect.left + 'px',
                top: rect.top + 'px',
                width: rect.width + 'px',
                height: rect.height + 'px',
                margin: '0',
                transition: 'transform 520ms cubic-bezier(.2,.8,.2,1), opacity 420ms ease',
                zIndex: 9999,
                pointerEvents: 'none',
                willChange: 'transform, opacity',
                opacity: '0.6' 
            });

            const inClone = outClone.cloneNode(true);
            inClone.innerHTML = rotated[i];
            
            Object.assign(inClone.style, {
                transform: direction === 'right' ? 'translateX(40px)' : 'translateX(-40px)',
                opacity: '0',
            });

            document.body.appendChild(outClone);
            document.body.appendChild(inClone);

            void outClone.offsetWidth;

            setTimeout(() => {
                outClone.style.transform = direction === 'right'
                    ? 'translateX(-40px) scale(0.95)'
                    : 'translateX(40px) scale(0.95)';
                outClone.style.opacity = '0';

                inClone.style.transform = 'translateX(0)';
                inClone.style.opacity = '0.6'; 
            }, 20);

            animations.push(new Promise(res => {
                let removed = 0;
                const clean = () => {
                    removed += 1;
                    if (removed === 2) {
                        outClone.remove();
                        inClone.remove();
                        res();
                    }
                };
                outClone.addEventListener('transitionend', clean, {once: true});
                inClone.addEventListener('transitionend', clean, {once: true});
            }));
        });

        Promise.all(animations).then(() => {
            const places = placeholders();
            places.forEach((p, i) => {
                p.innerHTML = rotated[i];
                p.style.opacity = ''; 
                p.style.removeProperty('opacity');
            });
            busy = false;
        });
    }

    const rotateContentsRight = () => rotate('right');
    const rotateContentsLeft = () => rotate('left');

    // --- Gestion du Scroll et Swipe ---
    let lastWheelTime = 0;
    const WHEEL_THROTTLE_MS = 600;
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