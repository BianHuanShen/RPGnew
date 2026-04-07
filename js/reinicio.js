// ===============================
// REINICIO & GAME LOOP SYSTEM
// ===============================

// ===== CONTROL DE LOOPS =====
let gameLoopActivo = false;
let intervaloAtaque = null;

// ===== LOOP PRINCIPAL =====
function iniciarLoops() {
    if (gameLoopActivo || intervaloAtaque || intervaloGameOver) return;

    gameLoopActivo = true;

    // Loop de movimiento
    moverEnemigos();

    // Ataque automático enemigos
    intervaloAtaque = setInterval(() => {
        if (juegoActivo) ataqueEnemigos();
    }, 1200);

    // Check Game Over
    intervaloGameOver = setInterval(checkGameOver, 300);
}
// ===== Detener LOOP =====
function detenerLoops() {
    gameLoopActivo = false;

    if (intervaloAtaque) {
        clearInterval(intervaloAtaque);
        intervaloAtaque = null;
    }
    if (intervaloGameOver) {
    clearInterval(intervaloGameOver);
    intervaloGameOver = null;
}
}

// ===== MODAL GAME OVER =====
const modalGameOver = document.createElement("div");
modalGameOver.id = "modalGameOver";
modalGameOver.style.display = "none";
modalGameOver.innerHTML = `
    <p>💀 Has muerto</p>
    <p>Puntaje final: <span id="puntajeFinal">0</span></p>
    <p>¿Deseas volver a jugar?</p>
    <button id="reiniciarBtn">Comenzar de nuevo</button>
`;
document.body.appendChild(modalGameOver);

const reiniciarBtn = document.getElementById("reiniciarBtn");
const puntajeFinalEl = document.getElementById("puntajeFinal");

// ===== REINICIAR JUEGO =====
function reiniciarJuego() {
    detenerLoops();

    // RESET JUGADOR
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

    // RESET GLOBAL
    nivelActual = 1;
    juegoActivo = true;
    enemigos = [];

    // LIMPIAR DOM
    gameArea.querySelectorAll(".enemigo").forEach(e => e.remove());

    // RESET POSICIÓN
    jugadorDiv.style.left = "100px";
    jugadorDiv.style.top = "300px";

    // UI
    modalGameOver.style.display = "none";
    desbloquearBotones();
    mensajeEl.textContent = "✨ ¡Nuevo juego iniciado!";

    // NUEVO NIVEL
    generarNivel();
    actualizarUI();

    // REINICIAR LOOPS
    iniciarLoops();
}

// ===== EVENTO BOTÓN =====
reiniciarBtn?.addEventListener("click", reiniciarJuego);

// ===== GAME OVER CONTROL =====
function checkGameOver() {
    if (jugador.vida <= 0 && juegoActivo) {
        juegoActivo = false;

        // Mostrar puntaje final
        if (puntajeFinalEl) puntajeFinalEl.textContent = jugador.puntaje;

        // Mostrar modal
        modalGameOver.style.display = "flex";

        // Bloquear botones
        bloquearBotones();

        // DETENER LOOPS
        detenerLoops();
    }
}

// ⏱️ CHECK GAME OVER
let intervaloGameOver = setInterval(checkGameOver, 300);

// ===== ICONOS DE CLASE =====
function getIconoClase(clase) {
    const iconos = {
        mago: '🧙',
        guerrero: '⚔️',
        arquero: '🏹',
        esqueleto: '💀'
    };
    return iconos[clase] || '?';
}

// ===== INICIO DEL JUEGO =====
iniciarLoops();
