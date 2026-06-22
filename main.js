// =========================================
//  CONFIGURACIÓN DE WHATSAPP Y MENSAJES
// =========================================
const numeroWhatsApp = "19295576337";

// Diccionario dinámico: Relaciona el nombre del producto con su mensaje prediseñado
const mensajesProductos = {
    "DRY-X": "¡Hola! 👋 Vi en su página web el producto para lavado sin agua *DRY-X* 💧🚫. Me parece increíble y estoy muy interesado en adquirirlo. ¿Podrían brindarme información de precio y disponibilidad? 🚘✨",
    
    "IRON X": "¡Hola! 👋 Vi su limpiador de rines *IRON X* 🛞💥 en la web. Quiero eliminar el polvo de frenos y la contaminación de mis rines. ¿Me pueden dar detalles para hacer la compra? 🏎️",
    
    "PLASTIC X PRO": "¡Hola! 👋 Estoy buscando restaurar los plásticos de mi auto y me llamó la atención su producto *PLASTIC X PRO* 🛡️🖤. Me gustaría saber el precio y cómo es el proceso de compra. 🚙✨",

    "PLASTIC X EXPRESS": "¡Hola! 👋 Estoy buscando restaurar los plásticos de mi auto y me llamó la atención su producto *PLASTIC X EXPRESS* 🛡️🖤. Me gustaría saber el precio y cómo es el proceso de compra. 🚙✨",
    
    "GLASS X": "¡Hola! 👋 Me interesa mucho su limpiador de vidrios *GLASS X* 🪟✨ que vi en su sitio web. Quiero una visión clara y sin manchas para mi vehículo. ¿Tienen disponibilidad? 🚘",
    
    "INNER X": "¡Hola! 👋 Vi su limpiador de interiores *INNER X* 💺🧼 en la web y me encantaría usarlo para mantener impecable la cabina de mi auto. ¿Podrían darme más información? 🚗✨",
    
    "SPOT X": "¡Hola! 👋 Tengo problemas con marcas de agua en la pintura/vidrios y vi que su producto *SPOT X* 💧🔍 es ideal para removerlas. Estoy interesado en comprarlo, ¿me dan detalles? 🚘",
    
    "HYDRO X": "¡Hola! 👋 Me llamó la atención su cera en spray *HYDRO X* 💦🛡️. Busco darle brillo y protección rápida a mi auto después de lavarlo. ¿Me indican precio y disponibilidad? 🏎️✨",
    
    "WASH X": "¡Hola! 👋 Estoy interesado en el *WASH X* 🧽🫧 que ofrecen en su web. Busco lavar y proteger mi auto en un solo paso con acabado premium. ¿Me podrían dar información de compra? 🚙✨"
};


// =========================================
//  LÓGICA DE VENTANAS MODALES (POP-UPS)
// =========================================
function abrirModal(rutaImagen, nombreProducto) {
    const modal = document.getElementById('ventanaModal');
    const imagenAmpliada = document.getElementById('imagenAmpliada');
    const btnWhatsapp = document.getElementById('btnWhatsappModal');
    const textoBtn = document.getElementById('textoBtnWhatsapp');

    // Mostrar modal
    modal.style.display = "flex";
    imagenAmpliada.src = rutaImagen;
    document.body.style.overflow = "hidden"; 

    // ---- LÓGICA DINÁMICA DEL BOTÓN ----
    if (nombreProducto && mensajesProductos[nombreProducto]) {
        // 1. Cambiamos el texto del botón
        textoBtn.textContent = `Pedir ${nombreProducto}`;
        
        // 2. Codificamos el mensaje para que sea una URL válida para WhatsApp
        const mensajeCodificado = encodeURIComponent(mensajesProductos[nombreProducto]);
        
        // 3. Reemplazamos el enlace del botón
        btnWhatsapp.href = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensajeCodificado}`;
    } else {
        // Fallback: Por si en el futuro agregas un producto y olvidas ponerle mensaje
        textoBtn.textContent = "Pedir por WhatsApp";
        const msjGenerico = encodeURIComponent("¡Hola! 👋 Estoy interesado en sus productos premium de cuidado automotriz AM30 que vi en la web. ¿Me brindan asesoría? 🚘✨");
        btnWhatsapp.href = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${msjGenerico}`;
    }

    pausarAutoPlay(); // Pausa el carrusel si abren un modal
}

function cerrarModal() {
    document.getElementById('ventanaModal').style.display = "none";
    document.body.style.overflow = "auto";
    iniciarAutoPlay(); // Reanuda el carrusel al cerrar el modal
}

function cerrarModalFuera(evento) {
    if (evento.target.id === 'ventanaModal') cerrarModal();
}

// =========================================
//  LÓGICA DEL CARRUSEL INFINITO AUTOMÁTICO
// =========================================
const pista = document.getElementById('pistaCarrusel');
let presionado = false;
let inicioX;
let scrollIzquierdo;
let autoPlayInterval;

// Clonar elementos para crear el bucle visual
const tarjetas = Array.from(pista.children);
tarjetas.forEach(tarjeta => pista.appendChild(tarjeta.cloneNode(true)));
tarjetas.forEach(tarjeta => pista.appendChild(tarjeta.cloneNode(true)));

// Eventos para arrastre con el mouse (Drag)
pista.addEventListener('mousedown', (e) => {
    presionado = true;
    pista.classList.add('activa');
    inicioX = e.pageX - pista.offsetLeft;
    scrollIzquierdo = pista.scrollLeft;
    pausarAutoPlay();
});

pista.addEventListener('mouseleave', () => {
    presionado = false;
    iniciarAutoPlay();
});

pista.addEventListener('mouseup', () => {
    presionado = false;
    iniciarAutoPlay();
});

pista.addEventListener('mousemove', (e) => {
    if (!presionado) return;
    e.preventDefault();
    const x = e.pageX - pista.offsetLeft;
    const recorrido = (x - inicioX) * 2;
    pista.scrollLeft = scrollIzquierdo - recorrido;
});

// Eventos para pantallas táctiles (Soporte Móvil)
pista.addEventListener('touchstart', () => pausarAutoPlay(), {passive: true});
pista.addEventListener('touchend', () => iniciarAutoPlay(), {passive: true});

// Pausar también si solo pasan el cursor por encima (Hover amigable)
pista.addEventListener('mouseenter', () => pausarAutoPlay());

// Bucle invisible suave corrigiendo saltos de scroll
pista.addEventListener('scroll', () => {
    const gap = 30; // El espacio entre tarjetas definido en tu CSS
    const anchoTarjeta = tarjetas[0].offsetWidth;
    const anchoTotalOriginal = (anchoTarjeta + gap) * tarjetas.length;
    
    if (pista.scrollLeft >= anchoTotalOriginal * 2) {
        pista.style.scrollBehavior = 'auto'; 
        pista.scrollLeft = anchoTotalOriginal; 
        void pista.offsetWidth; 
        pista.style.scrollBehavior = 'smooth'; 
    } 
    else if (pista.scrollLeft <= 0) {
        pista.style.scrollBehavior = 'auto';
        pista.scrollLeft = anchoTotalOriginal;
        void pista.offsetWidth;
        pista.style.scrollBehavior = 'smooth';
    }
});

// Posicionamiento inicial en el bloque del centro al cargar la página
window.onload = () => {
    const gap = 30;
    const anchoInicial = (tarjetas[0].offsetWidth + gap) * tarjetas.length;
    pista.style.scrollBehavior = 'auto';
    pista.scrollLeft = anchoInicial;
    void pista.offsetWidth;
    pista.style.scrollBehavior = 'smooth';
    iniciarAutoPlay(); // Arranca el automatismo
};

// Función para mover con flechas manuales
function moverCarrusel(direccion) {
    pausarAutoPlay(); // Detiene momentáneamente el autoplay
    const gap = 30;
    const anchoTarjeta = tarjetas[0].clientWidth + gap;
    pista.scrollBy({ left: anchoTarjeta * direccion, behavior: 'smooth' });
    iniciarAutoPlay(); // Lo vuelve a activar tras el movimiento
}

// Funciones de control de Autoplay
function iniciarAutoPlay() {
    // Limpiamos cualquier intervalo previo para evitar duplicaciones de velocidad
    clearInterval(autoPlayInterval); 
    autoPlayInterval = setInterval(() => {
        const gap = 30;
        const anchoTarjeta = tarjetas[0].clientWidth + gap;
        // Se desplaza automáticamente hacia la derecha el ancho de una tarjeta
        pista.scrollBy({ left: anchoTarjeta, behavior: 'smooth' });
    }, 2500); // 2500ms = Se mueve cada 2.5 segundos.
}

function pausarAutoPlay() {
    clearInterval(autoPlayInterval);
}