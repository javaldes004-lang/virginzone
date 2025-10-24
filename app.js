// ======================= app.js =======================
// Lógica original del formulario
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formPedido');

    if (!form) return;

    const outNombre = document.getElementById('outNombre');
    const outLista = document.getElementById('outLista');
    const outTotal = document.getElementById('outTotal');
    const btnConfirmar = document.getElementById('btnConfirmar');
    const confirmNombre = document.getElementById('confirmNombre');
    const toastBtn = document.getElementById('btnToast');
    const toastEl = document.getElementById('toastAviso');

    if (toastBtn && toastEl) {
        const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
        toastBtn.addEventListener('click', () => toast.show());
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombreCliente').value.trim();
        const selModelo = document.getElementById('selModelo');
        const selTalla = document.getElementById('selTalla');
        const selColor = document.getElementById('selColor');
        const cantidad = Number(document.getElementById('inpCantidad').value || 0);

        if (!nombre || !selModelo.value || !selTalla.value || !selColor.value || cantidad < 1) {
            alert('Completa nombre, modelo, talla, color y cantidad (mínimo 1).');
            return;
        }

        const optModelo = selModelo.options[selModelo.selectedIndex];
        const precioModelo = getPrecioFromDataset(optModelo);
        let total = precioModelo * cantidad;

        const chkNombreNumero = document.getElementById('chkNombreNumero');
        const chkParcheLiga = document.getElementById('chkParcheLiga');
        const extrasSeleccionados = [];

        if (chkNombreNumero.checked) {
            total += getPrecioFromDataset(chkNombreNumero) * cantidad;
            extrasSeleccionados.push('Nombre y número');
        }
        if (chkParcheLiga.checked) {
            total += getPrecioFromDataset(chkParcheLiga) * cantidad;
            extrasSeleccionados.push('Parche de liga');
        }

        const inpNombre = document.getElementById('inpNombre').value.trim();
        const inpNumero = document.getElementById('inpNumero').value.trim();
        const selEnvio = document.getElementById('selEnvio');
        const optEnvio = selEnvio.options[selEnvio.selectedIndex];
        const costoEnvio = getPrecioFromDataset(optEnvio);
        total += costoEnvio;

        const txtInstr = document.getElementById('txtInstrucciones').value.trim();

        outNombre.textContent = nombre;
        outLista.innerHTML = `
            <li><strong>Modelo:</strong> ${selModelo.value} — ${toMXN(precioModelo)} c/u × ${cantidad}</li>
            <li><strong>Talla:</strong> ${selTalla.value}</li>
            <li><strong>Color:</strong> ${selColor.value}</li>
            <li><strong>Extras:</strong> ${extrasSeleccionados.length ? extrasSeleccionados.join(', ') : 'Ninguno'}</li>
            ${inpNombre || inpNumero ? `<li><strong>Personalización:</strong> ${inpNombre ? 'Nombre: ' + inpNombre : ''} ${inpNumero ? ' | Número: ' + inpNumero : ''}</li>` : ''}
            <li><strong>Envío:</strong> ${selEnvio.value} — ${toMXN(costoEnvio)}</li>
            ${txtInstr ? `<li><strong>Instrucciones:</strong> ${txtInstr}</li>` : ''}
        `;
        outTotal.textContent = toMXN(total);

        btnConfirmar.disabled = false;
        confirmNombre.textContent = nombre;
    });

    form.addEventListener('reset', () => {
        setTimeout(() => {
            outNombre.textContent = '—';
            outLista.innerHTML = '<li class="text-muted">Aún no has generado tu pedido.</li>';
            outTotal.textContent = '$0';
            btnConfirmar.disabled = true;
        }, 0);
    });

    /** Utilidad: formatea a moneda MXN */
    function toMXN(num) {
        return Number(num || 0).toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
        });
    }

    /** Utilidad: toma precio desde data-precio (en selects/checks) */
    function getPrecioFromDataset(el) {
        const raw = el?.dataset?.precio;
        return raw ? Number(raw) : 0;
    }
});
// ===================== /app.js ======================


// ===== INICIO: NUEVO EFECTO DE LUZ EN EL FONDO =====
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    // Guardamos el color de fondo original definido en el CSS
    const originalBgColor = getComputedStyle(body).getPropertyValue('background-color');

    // Escuchamos el movimiento del ratón en todo el documento
    document.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Comprobamos si el cursor está directamente sobre el BODY
        // y no sobre otro elemento como una tarjeta, un botón, etc.
        if (e.target === document.body) {
            // Si está sobre el fondo, creamos un gradiente radial (el "spotlight")
            // que nace desde la posición del cursor.
            body.style.background = `radial-gradient(circle at ${posX}px ${posY}px, var(--color-azul-neon), ${originalBgColor} 400px)`;
        } else {
            // Si el cursor está sobre cualquier otro elemento,
            // restauramos el color de fondo original.
            body.style.background = originalBgColor;
        }
    });

    // Adicional: Si el ratón sale por completo de la ventana, también restauramos el fondo.
    document.addEventListener('mouseleave', () => {
        body.style.background = originalBgColor;
    });
});
// ===== FIN: NUEVO EFECTO DE LUZ EN EL FONDO =====


// ===== INICIO: LÓGICA PARA TESTIMONIOS DINÁMICOS =====
document.addEventListener('DOMContentLoaded', () => {

    // 1. Define tus testimonios aquí. Puedes añadir o quitar los que quieras.
    const testimonials = [{
        quote: "¡Increíble! La mejor laptop que he tenido. El rendimiento es una locura y el diseño es espectacular. Totalmente recomendada.",
        author: "Mariana G.",
        source: "Compradora Verificada"
    },
    {
        quote: "El servicio al cliente fue de primera. Me ayudaron a elegir la tarjeta gráfica perfecta para mis necesidades y el envío fue rapidísimo.",
        author: "Carlos Mendoza",
        source: "Gamer Entusiasta"
    },
    {
        quote: "Precios muy competitivos y productos 100% originales. Compré un monitor y llegó en perfectas condiciones. Volveré a comprar sin duda.",
        author: "Sofía R.",
        source: "Cliente Frecuente"
    }
    ];

    // 2. Seleccionamos el contenedor donde irán los testimonios
    const testimonialsContainer = document.getElementById('testimonials-inner');

    // Si el contenedor no existe, no hacemos nada.
    if (!testimonialsContainer) return;

    // 3. Creamos el HTML para cada testimonio y lo añadimos al contenedor
    let testimonialsHTML = '';
    testimonials.forEach((testimonial, index) => {
        // La clase 'active' es necesaria solo para el primer elemento del carrusel
        const activeClass = index === 0 ? 'active' : '';

        testimonialsHTML += `
            <div class="carousel-item ${activeClass}">
                <figure class="blockquote">
                    <p>"${testimonial.quote}"</p>
                    <figcaption class="blockquote-footer">
                        ${testimonial.author} <cite title="Source Title">(${testimonial.source})</cite>
                    </figcaption>
                </figure>
            </div>
        `;
    });

    // 4. Inyectamos el HTML generado en el carrusel
    testimonialsContainer.innerHTML = testimonialsHTML;
});
// ===== FIN: LÓGICA PARA TESTIMONIOS DINÁMICOS =====


// ===== INICIO: LÓGICA DEL CARRITO DE COMPRAS INTERACTIVO =====
document.addEventListener('DOMContentLoaded', () => {

    let cart = [];
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartCounter = document.getElementById('cart-counter');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    function toMXN(num) {
        return Number(num || 0).toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN'
        });
    }

    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }

        renderCart();
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        renderCart();
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center text-muted">Tu carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.quantity} x ${toMXN(item.price)}</div>
                    </div>
                    <div class="cart-item-actions">
                        <strong>${toMXN(item.quantity * item.price)}</strong>
                        <button class="btn btn-sm btn-outline-danger remove-from-cart-btn" data-id="${item.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }

        updateCartTotal();
        updateCartCounter();
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = toMXN(total);
    }

    function updateCartCounter() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCounter.textContent = totalItems;
    }

    function handleCheckout() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío. ¡Añade algunos productos!');
            return;
        }

        const modalInstance = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        modalInstance.hide();

        alert('¡Gracias por tu compra! Tu pedido ficticio ha sido procesado con éxito.');

        cart = [];
        renderCart();
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            const name = e.currentTarget.dataset.name;
            const price = parseFloat(e.currentTarget.dataset.price);

            addToCart(id, name, price);
        });
    });

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.closest('.remove-from-cart-btn')) {
            const id = e.target.closest('.remove-from-cart-btn').dataset.id;
            removeFromCart(id);
        }
    });

    checkoutBtn.addEventListener('click', handleCheckout);

});
// ===== FIN: LÓGICA DEL CARRITO DE COMPRAS INTERACTIVO =====