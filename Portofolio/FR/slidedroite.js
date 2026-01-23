document.addEventListener('DOMContentLoaded', () => {
    const bigElem = () => document.querySelector('.image.big');
    const gridElems = () => Array.from(document.querySelectorAll('.grid .image'));
    const placeholders = () => [bigElem(), ...gridElems()];
    let busy = false;

    function rotate(contents, direction) {
        // direction: 'right' means user slides right; content shifts left
        // direction: 'left' means user slides left; content shifts right
        if (busy) return;
        busy = true;
        const places = placeholders();
        if (places.length < 2) {
            busy = false;
            return;
        }
        const current = places.map(p => p.innerHTML);
        const rotated = direction === 'right'
            ? current.slice(1).concat(current.slice(0,1))   // shift left
            : current.slice(-1).concat(current.slice(0,-1)); // shift right

        // Set target opacity immediately per slot
        places.forEach((p, i) => {
            const targetOpacity = (i === 0 ? '1' : '0.6');
            p.style.opacity = targetOpacity;
        });

        // Animate with fixed clones; translate direction varies
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
            });
            const inClone = outClone.cloneNode(true);
            inClone.innerHTML = rotated[i];
            const targetOpacity = (i === 0 ? '1' : '0.6');
            Object.assign(inClone.style, {
                transform: direction === 'right' ? 'translateX(20px)' : 'translateX(-20px)',
                opacity: '0',
            });
            document.body.appendChild(outClone);
            document.body.appendChild(inClone);

            void outClone.offsetWidth;
            setTimeout(() => {
                outClone.style.transform = direction === 'right'
                    ? 'translateX(-20px) scale(0.98)'
                    : 'translateX(20px) scale(0.98)';
                outClone.style.opacity = '0';
                inClone.style.transform = 'translateX(0)';
                inClone.style.opacity = targetOpacity;
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
                const targetOpacity = (i === 0 ? '1' : '0.6');
                p.innerHTML = rotated[i];
                p.classList.remove('big', 'wide');
                if (i === 0) p.classList.add('big');
                else if (i === 1) p.classList.add('wide');
                p.style.transform = '';
                p.style.opacity = targetOpacity;
            });
            setTimeout(() => {
                places.forEach(p => p.style.removeProperty('opacity'));
                busy = false;
            }, 40);
        });
    }

    const rotateContentsRight = () => rotate(placeholders(), 'right');
    const rotateContentsLeft = () => rotate(placeholders(), 'left');

    // Touchpad horizontal swipe AND Mouse vertical scroll support
    let lastWheelTime = 0;
    const WHEEL_THROTTLE_MS = 600;
    const WHEEL_THRESHOLD = 30;
    const mainEl = document.querySelector('.main');
    
    if (mainEl) {
        mainEl.addEventListener('wheel', (e) => {
            // Prevent default vertical scrolling to lock the page
            e.preventDefault();

            const now = Date.now();
            if (now - lastWheelTime < WHEEL_THROTTLE_MS) return;

            // Check for Scroll Down (Y > 0) OR Scroll Right (X > 0)
            if (e.deltaY > WHEEL_THRESHOLD || e.deltaX > WHEEL_THRESHOLD) {
                lastWheelTime = now;
                rotateContentsRight();
            } 
            // Check for Scroll Up (Y < 0) OR Scroll Left (X < 0)
            else if (e.deltaY < -WHEEL_THRESHOLD || e.deltaX < -WHEEL_THRESHOLD) {
                lastWheelTime = now;
                rotateContentsLeft();
            }
        }, {passive: false});
    }

    // Touch swipe support: swipe right -> rotate right, swipe left -> rotate left
    let startX = null;
    const main = document.querySelector('.main');
    if (main) {
        main.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, {passive: true});

        main.addEventListener('touchend', (e) => {
            if (startX === null) return;
            const endX = e.changedTouches[0].clientX;
            const dx = endX - startX;
            if (dx > 50) {
                rotateContentsRight();
            } else if (dx < -50) {
                rotateContentsLeft();
            }
            startX = null;
        });
    }

    // Keyboard arrows
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') rotateContentsRight();
        if (e.key === 'ArrowLeft') rotateContentsLeft();
    });

    // Hover behaviour unchanged
    (function addHoverOpacity() {
        const bigEl = document.querySelector('.image.big');
        if (!bigEl) return;
        const imgs = Array.from(document.querySelectorAll('.image'));
        const bigSpan = bigEl.querySelector('span');
        imgs.forEach(img => {
            img.addEventListener('mouseenter', () => {
                if (img === bigEl) return;
                bigEl.style.transition = 'opacity 0.4s ease-in-out';
                bigEl.style.opacity = '0.6';
                if (bigSpan) {
                    bigSpan.style.transition = 'opacity 160ms ease';
                    bigSpan.style.opacity = '0';
                }
            }, {passive: true});

            img.addEventListener('mouseleave', () => {
                if (img === bigEl) return;
                bigEl.style.opacity = '';
                if (bigSpan) {
                    bigSpan.style.opacity = '';
                }
            }, {passive: true});
        });
    })();
});