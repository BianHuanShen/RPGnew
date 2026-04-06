// ===============================
// REINICIO SYSTEM
// ===============================

// Crear modal de juego terminado
const modalGameOver = document.createElement("div");
modalGameOver.id = "modalGameOver";
modalGameOver.innerHTML = `
    <p>💀 Has muerto</p>
    <p>Puntaje final: <span id="puntajeFinal">0</span></p>
    <p>¿Deseas volver a jugar?</p>
    <button id="reiniciarBtn">Comenzar de nuevo</button>
`;
document.body.appendChild(modalGameOver);

const reiniciarBtn = document.getElementById("reiniciarBtn");
const puntajeFinalEl = document.getElementById("puntajeFinal");

// Función para reiniciar el juego
function reiniciarJuego() {
    // Reset jugador
    jugador.vida = 100;
    jugador.vidaMax = 100;
    jugador.ataque = 10;
    jugador.defensa = 5;
    jugador.magia = 0;
    jugador.nivel = 1;
    jugador.puntaje = 0;
    jugador.inventario = {
        pocion: 30,
        espada: 1,
        armadura: 1,
        magia: 0,
        cristal: 0,
        orbe: 0,
        orbeUsados: 0,
        espadaLegendaria: 0,
        armaduraEpica: 0
    };

    // Reset nivel
    nivelActual = 1;
    juegoActivo = true;

    // Limpiar enemigos
    enemigos = [];
    gameArea.querySelectorAll(".enemigo").forEach(e => e.remove());

    // Ocultar modal
    modalGameOver.style.display = "none";

    // Reactivar botones
    desbloquearBotones();

    // Regenerar nivel
    generarNivel();
    actualizarUI();

    mensajeEl.textContent = "✨ ¡Nuevo juego iniciado!";
}

// Evento botón reiniciar
if (reiniciarBtn) {
    reiniciarBtn.addEventListener("click", reiniciarJuego);
}

// Observer de vida del jugador
setInterval(() => {
    if (jugador.vida <= 0 && modalGameOver.style.display !== "flex") {
        // Mostrar puntaje final
        if (puntajeFinalEl) puntajeFinalEl.textContent = jugador.puntaje;

        // Mostrar modal
        modalGameOver.style.display = "flex";

        // Bloquear todo
        bloquearBotones();
        juegoActivo = false;
    }
}, 100);