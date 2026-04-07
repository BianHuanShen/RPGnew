// ===============================
// UI SYSTEM - ACTUALIZACIONES PRO
// ===============================

function actualizarUI() {
    if (!vidaJugadorFill || !ataqueJugadorEl || !mensajeEl) return;

    // ===== VIDA =====
    const porcentajeVida = Math.max(0, (jugador.vida / jugador.vidaMax) * 100);
    vidaJugadorFill.style.width = `${porcentajeVida}%`;

    if (porcentajeVida > 60) {
        vidaJugadorFill.style.background = "linear-gradient(90deg, #2ecc71, #27ae60)";
    } else if (porcentajeVida > 30) {
        vidaJugadorFill.style.background = "linear-gradient(90deg, #f1c40f, #f39c12)";
    } else {
        vidaJugadorFill.style.background = "linear-gradient(90deg, #e74c3c, #c0392b)";
    }

    // ===== STATS =====
    ataqueJugadorEl.textContent = Math.floor(jugador.ataque);
    defensaJugadorEl.textContent = Math.floor(jugador.defensa);
    magiaJugadorEl.textContent = jugador.magia;
    nivelJugadorEl.textContent = jugador.nivel;
    puntajeEl.textContent = jugador.puntaje;

    // ===== MAGIA =====
    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = (jugador.inventario.orbeUsados || 0) * 2;
    const maxMagia = maxMagiaBase + bonusOrbes;

    // ===== INVENTARIO UI =====
    if (listaInventarioEl) {
        listaInventarioEl.innerHTML = `
            <li>🟢 <b>Comunes</b></li>
            <li>🧪 Pociones: ${jugador.inventario.pocion}</li>
            <li>⚔️ Espadas: ${jugador.inventario.espada}</li>
            <li>🛡️ Armaduras: ${jugador.inventario.armadura}</li>
            <li>⛑️ Cascos: ${jugador.inventario.casco}</li>
            <li>👢 Botas: ${jugador.inventario.botas}</li>
            <li>👖 Pantalones: ${jugador.inventario.pantalon}</li>

            <li>🔵 <b>Raros</b></li>
            <li>💎 Cristales: ${jugador.inventario.cristal}</li>
            <li>🔮 Orbes: ${jugador.inventario.orbe}</li>
            <li>🏹 Arcos: ${jugador.inventario.arco}</li>
            <li>🗡️ Dagas: ${jugador.inventario.daga}</li>
            <li>🧤 Guantes: ${jugador.inventario.guantes}</li>

            <li>🟣 <b>Épicos</b></li>
            <li>🛡️ Armaduras Épicas: ${jugador.inventario.armaduraEpica}</li>
            <li>👢 Botas Épicas: ${jugador.inventario.botasEpicas}</li>
            <li>⛑️ Cascos Épicos: ${jugador.inventario.cascoEpico}</li>

            <li>🟡 <b>Legendarios</b></li>
            <li>⚔️ Espadas Legendarias: ${jugador.inventario.espadaLegendaria}</li>
            <li>🛡️ Armaduras Legendarias: ${jugador.inventario.armaduraLegendaria}</li>

            <li>✨ Magia: ${jugador.magia} / ${maxMagia} ${bonusOrbes > 0 ? `(+${bonusOrbes} Orbes)` : ""}</li>
        `;
    }

    // ===== CONTROL DE BOTONES =====

    const toggle = (btn, condition) => {
        if (btn) btn.style.display = condition ? "block" : "none";
    };

    // Consumibles
    toggle(curarBtn, jugador.inventario.pocion > 0);
    toggle(usarCristalBtn, jugador.inventario.cristal > 0);
    toggle(usarOrbeBtn, jugador.inventario.orbe > 0);

    // Comunes
    toggle(equiparArmaBtn, jugador.inventario.espada > 0);
    toggle(equiparArmaduraBtn, jugador.inventario.armadura > 0);
    toggle(equiparCascoBtn, jugador.inventario.casco > 0);
    toggle(equiparBotasBtn, jugador.inventario.botas > 0);
    toggle(equiparPantalonBtn, jugador.inventario.pantalon > 0);

    // Raros
    toggle(equiparArcoBtn, jugador.inventario.arco > 0);
    toggle(equiparDagaBtn, jugador.inventario.daga > 0);
    toggle(equiparGuantesBtn, jugador.inventario.guantes > 0);

    // Épicos
    toggle(equiparArmaduraEpicaBtn, jugador.inventario.armaduraEpica > 0);
    toggle(equiparBotasEpicasBtn, jugador.inventario.botasEpicas > 0);
    toggle(equiparCascoEpicoBtn, jugador.inventario.cascoEpico > 0);

    // Legendarios
    toggle(equiparEspadaLegendariaBtn, jugador.inventario.espadaLegendaria > 0);
    toggle(equiparArmaduraLegendariaBtn, jugador.inventario.armaduraLegendaria > 0);

    // ===== BARRAS TIPO MMORPG =====
    actualizarBarraMMORPG(porcentajeVida, maxMagia);
}

// ===============================
// BARRAS MMORPG
// ===============================
function actualizarBarraMMORPG(porcentajeVida, maxMagia) {
    const vidaBarra = document.getElementById("vidaBarra");
    const magiaBarra = document.getElementById("magiaBarra");

    if (vidaBarra) {
        vidaBarra.style.width = `${porcentajeVida}%`;
    }

    if (magiaBarra) {
        const porcentajeMagia = maxMagia > 0 ? (jugador.magia / maxMagia) * 100 : 0;
        magiaBarra.style.width = `${porcentajeMagia}%`;
    }
}

// ===============================
// ANIMACIÓN BOTONES
// ===============================
function animarBoton(btn) {
    if (!btn) return;
    btn.classList.add("usar-item-anim");
    setTimeout(() => btn.classList.remove("usar-item-anim"), 300);
}

// ===============================
// CSS DINÁMICO
// ===============================
const style = document.createElement("style");
style.textContent = `
    .usar-item-anim {
        animation: pulse 0.3s ease;
    }
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); box-shadow: 0 0 20px currentColor; }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
