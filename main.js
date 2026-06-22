// =========================================
//   CONFIGURACIÓN DE WHATSAPP Y MENSAJES
// =========================================
const numeroWhatsApp = "19295576337";

const mensajesProductos = {
    "DRY-X": "¡Hola! 👋 Vi en su página web el producto para lavado sin agua *DRY-X* 💧🚫. Me parece increíble y estoy muy interesado en adquirirlo. ¿Podrían brindarme información de precio y disponibilidad? 🚘✨",
    
    "IRON X": "¡Hola! 👋 Vi su limpiador de rines *IRON X* 🛞💥 en la web. Quiero eliminar el polvo de frenos y la contaminación de mis rines. ¿Me pueden dar detalles para hacer la compra? 🏎️",
    
    "PLASTIC X PRO": "¡Hola! 👋 Estoy buscando restaurar los plásticos de mi auto y me llamó la atención su producto *PLASTIC X PRO* 🛡️🖤. Me gustaría saber el precio y cómo es el proceso de compra. 🚙✨",

    "PLASTIC X EXPRESS": "¡Hola! 👋 Estoy buscando restaurar los plásticos de mi auto de forma rápida y me llamó la atención su producto *PLASTIC X EXPRESS* 🛡️🖤. Me gustaría saber el precio. 🚙✨",
    
    "GLASS X": "¡Hola! 👋 Me interesa mucho su limpiador de vidrios *GLASS X* 🪟✨ que vi en su sitio web. Quiero una visión clara y sin manchas para mi vehículo. ¿Tienen disponibilidad? 🚘",
    
    "INNER X": "¡Hola! 👋 Vi su limpiador de interiores *INNER X* 💺🧼 en la web y me encantaría usarlo para mantener impecable la cabina de mi auto. ¿Podrían darme más información? 🚗✨",
    
    "SPOT X": "¡Hola! 👋 Tengo problemas con marcas de agua en la pintura/vidrios y vi que su producto *SPOT X* 💧🔍 es ideal para removerlas. Estoy interesado en comprarlo, ¿me dan detalles? 🚘",
    
    "HYDRO X": "¡Hola! 👋 Me llamó la atención su cera en spray *HYDRO X* 💦🛡️. Busco darle brillo y protección rápida a mi auto después de lavarlo. ¿Me indican precio y disponibilidad? 🏎️✨",
    
    "WASH X": "¡Hola! 👋 Estoy interesado en el *WASH X* 🧽🫧 que ofrecen en su web. Busco lavar y proteger mi auto en un solo paso con acabado premium. ¿Me podrían dar información de compra? 🚙✨"
};

// =========================================
//   LÓGICA DE VENTANAS MODALES
// =========================================
function abrirModal(rutaImagen, nombreProducto) {
    const modal = document.getElementById('ventanaModal');
    const imagenAmpliada = document.getElementById('imagenAmpliada');
    const btnWhatsapp = document.getElementById('btnWhatsappModal');
    const textoBtn = document.getElementById('textoBtnWhatsapp');

    pausarAutoPlay();

    modal.style.display = "flex";
    imagenAmpliada.src = rutaImagen;
    document.body.style.overflow = "hidden";

    if (nombreProducto && mensajesProductos[nombreProducto]) {
        textoBtn.textContent = `Pedir ${nombreProducto}`;
        const mensajeCodificado = encodeURIComponent(mensajesProductos[nombreProducto]);
        btnWhatsapp.href = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensajeCodificado}`;
    } else {
        textoBtn.textContent = "Pedir por WhatsApp";
        const msjGenerico = encodeURIComponent("¡Hola! 👋 Estoy interesado en sus productos premium de cuidado automotriz AM30 que vi en la web. ¿Me brindan asesoría? 🚘✨");
        btnWhatsapp.href = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${msjGenerico}`;
    }
}

function cerrarModal() {
    document.getElementById('ventanaModal').style.display = "none";
    document.body.style.overflow = "auto";
    iniciarAutoPlay();
}

function cerrarModalFuera(evento) {
    if (evento.target.id === 'ventanaModal') cerrarModal();
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        const modal = document.getElementById('ventanaModal');
        if (modal.style.display === "flex") {
            cerrarModal();
        }
    }
});

// ===============================
//   LÓGICA DEL CARRUSEL INFINITO
// ===============================
const pista = document.getElementById('pistaCarrusel');
let presionado = false;
let inicioX;
let scrollIzquierdo;
let autoPlayInterval;
let bloqueoBotones = false;

const tarjetas = Array.from(pista.children);
tarjetas.forEach(tarjeta => pista.appendChild(tarjeta.cloneNode(true)));
tarjetas.forEach(tarjeta => pista.appendChild(tarjeta.cloneNode(true)));

function obtenerMedidas() {
    if (tarjetas.length === 0) return { anchoTarjeta: 0, gap: 0, anchoTotalOriginal: 0 };
    const anchoTarjeta = tarjetas[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(pista).gap) || 0;
    const anchoTotalOriginal = (anchoTarjeta + gap) * tarjetas.length;
    return { anchoTarjeta, gap, anchoTotalOriginal };
}

pista.addEventListener('mousedown', (e) => {
    presionado = true;
    pista.style.cursor = 'grabbing';
    inicioX = e.pageX - pista.offsetLeft;
    scrollIzquierdo = pista.scrollLeft;
    pausarAutoPlay();
});

pista.addEventListener('mouseleave', () => {
    if (!presionado) return;
    presionado = false;
    pista.style.cursor = 'grab';
    iniciarAutoPlay();
});

pista.addEventListener('mouseup', () => {
    presionado = false;
    pista.style.cursor = 'grab';
    iniciarAutoPlay();
});

pista.addEventListener('mousemove', (e) => {
    if (!presionado) return;
    e.preventDefault();
    const x = e.pageX - pista.offsetLeft;
    const recorrido = (x - inicioX) * 1.5;
    pista.scrollLeft = scrollIzquierdo - recorrido;
});

pista.addEventListener('touchstart', () => pausarAutoPlay(), {passive: true});
pista.addEventListener('touchend', () => iniciarAutoPlay(), {passive: true});
pista.addEventListener('mouseenter', () => pausarAutoPlay());
pista.addEventListener('mouseleave', () => iniciarAutoPlay());

pista.addEventListener('scroll', () => {
    const { anchoTotalOriginal } = obtenerMedidas();
    if (anchoTotalOriginal === 0) return;

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

window.addEventListener('load', () => {
    const { anchoTotalOriginal } = obtenerMedidas();
    pista.style.scrollBehavior = 'auto';
    pista.scrollLeft = anchoTotalOriginal;
    void pista.offsetWidth;
    pista.style.scrollBehavior = 'smooth';
    iniciarAutoPlay();
});

function moverCarrusel(direccion) {
    if (bloqueoBotones) return;
    bloqueoBotones = true;

    pausarAutoPlay(); 
    
    const { anchoTarjeta, gap } = obtenerMedidas();
    const desplazamiento = anchoTarjeta + gap;
    
    pista.scrollBy({ left: desplazamiento * direccion, behavior: 'smooth' });
    
    setTimeout(() => {
        bloqueoBotones = false;
        iniciarAutoPlay();
    }, 350);
}

function iniciarAutoPlay() {
    clearInterval(autoPlayInterval); 
    autoPlayInterval = setInterval(() => {
        const { anchoTarjeta, gap } = obtenerMedidas();
        if (anchoTarjeta === 0) return;
        pista.scrollBy({ left: anchoTarjeta + gap, behavior: 'smooth' });
    }, 3500);
}

function pausarAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
}