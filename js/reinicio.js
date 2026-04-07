// ===============================
// REINICIO SYSTEM (OPTIMIZADO)
// ===============================

// ===== CONTROL DE LOOPS =====
let gameLoopActivo = false;
let intervaloAtaque = null;

function iniciarLoops() {
    if (gameLoopActivo) return;

    gameLoopActivo = true;

    // 🔥 IMPORTANTE: NO duplicar requestAnimationFrame
    // moverEnemigos() ya tiene su propio loop interno

    intervaloAtaque = setInterval(() => {
        if (juegoActivo) ataqueEnemigos();
    }, 1200); // ⏱️ más lento (antes 800)
}

function detenerLoops() {
    gameLoopActivo = false;

    if (intervaloAtaque) {
        clearInterval(intervaloAtaque);
        intervaloAtaque = null;
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
    // 🛑 DETENER TODO
    detenerLoops();

    // ===== RESET JUGADOR =====
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

    // ===== RESET GLOBAL =====
    nivelActual = 1;
    juegoActivo = true;
    enemigos = [];

    // ===== LIMPIAR DOM =====
    gameArea.querySelectorAll(".enemigo").forEach(e => e.remove());

    // ===== RESET POSICIÓN =====
    jugadorDiv.style.left = "100px";
    jugadorDiv.style.top = "300px";

    // ===== UI =====
    modalGameOver.style.display = "none";
    desbloquearBotones();

    // ===== NUEVO NIVEL =====
    generarNivel();
    actualizarUI();

    mensajeEl.textContent = "✨ ¡Nuevo juego iniciado!";

    // ▶️ REINICIAR LOOPS
function iniciarLoops() {
    if (gameLoopActivo) return;

    gameLoopActivo = true;

    // ✅ INICIAR MOVIMIENTO
    moverEnemigos();

    intervaloAtaque = setInterval(() => {
        if (juegoActivo) ataqueEnemigos();
    }, 1200);
}

// ===== EVENTO BOTÓN =====
if (reiniciarBtn) {
    reiniciarBtn.addEventListener("click", reiniciarJuego);
}

// ===== GAME OVER CONTROL =====
function checkGameOver() {
    if (jugador.vida <= 0 && juegoActivo) {
        juegoActivo = false;

        // Mostrar puntaje final
        if (puntajeFinalEl) {
            puntajeFinalEl.textContent = jugador.puntaje;
        }

        // Mostrar modal
        modalGameOver.style.display = "flex";

        // Bloquear botones
        bloquearBotones();

        // 🛑 DETENER LOOPS
        detenerLoops();
    }
}

// ⏱️ CHECK optimizado
setInterval(checkGameOver, 300);

// ===== INICIO DEL JUEGO =====
iniciarLoops();
