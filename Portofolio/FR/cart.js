document.addEventListener('DOMContentLoaded', () => {
    updateCartIcon();
    
    // Si nous sommes sur la page panier (cart.html), on affiche le contenu
    if (document.getElementById('cart-items-wrapper')) {
        renderCartPage();
    }
});

// Ajouter un item au panier
function addToCart(title, price) {
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];
    
    cart.push({ title: title, price: price });
    localStorage.setItem('myCart', JSON.stringify(cart));
    
    updateCartIcon();
    alert("Service ajouté au panier !");
}

// Mettre à jour l'icône du panier dans le header
function updateCartIcon() {
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];
    const countSpan = document.querySelector('.cart-count');
    const mobileLink = document.querySelector('.mobile-cart-link'); // Pour le menu mobile
    
    if (countSpan) {
        countSpan.innerText = cart.length;
        if (cart.length > 0) {
            countSpan.classList.add('visible');
        } else {
            countSpan.classList.remove('visible');
        }
    }
    
    // Mise à jour du texte dans le menu burger (ex: "Panier (2)")
    if(mobileLink) {
        mobileLink.innerText = `PANIER (${cart.length})`;
    }
}

// Afficher les items sur la page cart.html
function renderCartPage() {
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];
    const wrapper = document.getElementById('cart-items-wrapper');
    const totalEl = document.getElementById('cart-total');
    
    wrapper.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        wrapper.innerHTML = "<tr><td colspan='3' style='text-align:center; padding: 40px;'>Votre panier est vide.</td></tr>";
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            wrapper.innerHTML += `
                <tr>
                    <td>${item.title}</td>
                    <td>${item.price} €</td>
                    <td style="text-align:right;">
                        <button class="remove-btn" onclick="removeItem(${index})">RETIRER</button>
                    </td>
                </tr>
            `;
        });
    }
    
    totalEl.innerText = total + " €";
}

// Supprimer un item du panier
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];
    cart.splice(index, 1); // Retire l'élément à l'index donné
    localStorage.setItem('myCart', JSON.stringify(cart));
    renderCartPage();
    updateCartIcon();
}

// Simulation du paiement
function checkout() {
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];
    if(cart.length === 0) {
        alert("Votre panier est vide !");
        return;
    }
    
    // Ici, tu pourrais rediriger vers Stripe ou autre. Pour l'instant :
    alert("Merci pour votre commande ! (Simulation de paiement validée)");
    
    // Vider le panier
    localStorage.removeItem('myCart');
    
    // Redirection vers l'accueil ou confirmation
    window.location.href = 'index.html';
}