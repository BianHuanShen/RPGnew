// ===============================
// UI SYSTEM - ACTUALIZACIÓN AVANZADA
// ===============================

function actualizarUI() {
    if (!jugador) return; // Protege si jugador no existe

    // ===== VIDA =====
    const porcentajeVida = Math.max(0, (jugador.vida / jugador.vidaMax) * 100);
    if (vidaJugadorFill) {
        vidaJugadorFill.style.width = `${porcentajeVida}%`;

        // Color de barra según vida
        vidaJugadorFill.style.background = porcentajeVida > 60
            ? "linear-gradient(90deg, #2ecc71, #27ae60)"
            : porcentajeVida > 30
                ? "linear-gradient(90deg, #f1c40f, #f39c12)"
                : "linear-gradient(90deg, #e74c3c, #c0392b)";
    }

    // ===== STATS =====
    if (ataqueJugadorEl) ataqueJugadorEl.textContent = Math.floor(jugador.ataque);
    if (defensaJugadorEl) defensaJugadorEl.textContent = Math.floor(jugador.defensa);
    if (magiaJugadorEl) magiaJugadorEl.textContent = jugador.magia;
    if (nivelJugadorEl) nivelJugadorEl.textContent = jugador.nivel;
    if (puntajeEl) puntajeEl.textContent = jugador.puntaje;

    // ===== MAGIA =====
    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = (jugador.inventario.orbeUsados || 0) * 2;
    const maxMagia = maxMagiaBase + bonusOrbes;

    // ===== INVENTARIO COMPLETO =====
    if (listaInventarioEl) {
        listaInventarioEl.innerHTML = `
            <li>🧪 Pociones: ${jugador.inventario.pocion || 0}</li>

            <li><b>🟢 Comunes</b></li>
            <li>⚔️ Espadas: ${jugador.inventario.espada || 0}</li>
            <li>🛡️ Armaduras: ${jugador.inventario.armadura || 0}</li>
            <li>⛑️ Cascos: ${jugador.inventario.casco || 0}</li>
            <li>👢 Botas: ${jugador.inventario.botas || 0}</li>
            <li>👖 Pantalones: ${jugador.inventario.pantalon || 0}</li>

            <li><b>🔵 Raros</b></li>
            <li>💎 Cristales: ${jugador.inventario.cristal || 0}</li>
            <li>🔮 Orbes: ${jugador.inventario.orbe || 0}</li>
            <li>🏹 Arcos: ${jugador.inventario.arco || 0}</li>
            <li>🗡️ Dagas: ${jugador.inventario.daga || 0}</li>
            <li>🧤 Guantes: ${jugador.inventario.guantes || 0}</li>

            <li><b>🟣 Épicos</b></li>
            <li>🛡️ Armadura Épica: ${jugador.inventario.armaduraEpica || 0}</li>
            <li>👢 Botas Épicas: ${jugador.inventario.botasEpicas || 0}</li>
            <li>⛑️ Casco Épico: ${jugador.inventario.cascoEpico || 0}</li>

            <li><b>🟡 Legendarios</b></li>
            <li>⚔️ Espada Legendaria: ${jugador.inventario.espadaLegendaria || 0}</li>
            <li>🛡️ Armadura Legendaria: ${jugador.inventario.armaduraLegendaria || 0}</li>

            <li><b>✨ Magia:</b> ${jugador.magia} / ${maxMagia} ${bonusOrbes > 0 ? `(+${bonusOrbes} bonus)` : ""}</li>
        `;
    }

    // ===== BOTONES DINÁMICOS =====
    const botonesMap = [
        [curarBtn, jugador.inventario.pocion > 0],
        [usarCristalBtn, jugador.inventario.cristal > 0],
        [usarOrbeBtn, jugador.inventario.orbe > 0],
        [equiparArmaBtn, jugador.inventario.espada > 0],
        [equiparArmaduraBtn, jugador.inventario.armadura > 0],
        [equiparCascoBtn, jugador.inventario.casco > 0],
        [equiparBotasBtn, jugador.inventario.botas > 0],
        [equiparPantalonBtn, jugador.inventario.pantalon > 0],
        [equiparArcoBtn, jugador.inventario.arco > 0],
        [equiparDagaBtn, jugador.inventario.daga > 0],
        [equiparGuantesBtn, jugador.inventario.guantes > 0],
        [equiparArmaduraEpicaBtn, jugador.inventario.armaduraEpica > 0],
        [equiparBotasEpicasBtn, jugador.inventario.botasEpicas > 0],
        [equiparCascoEpicoBtn, jugador.inventario.cascoEpico > 0],
        [equiparEspadaLegendariaBtn, jugador.inventario.espadaLegendaria > 0],
        [equiparArmaduraLegendariaBtn, jugador.inventario.armaduraLegendaria > 0],
        [abrirInventarioBtn, true] // siempre visible
    ];
    botonesMap.forEach(([btn, cond]) => { if (btn) btn.style.display = cond ? "block" : "none"; });

    // ===== BARRAS VISUALES =====
    actualizarBarraMagia(maxMagia);
    actualizarBarraVida(porcentajeVida);
}

// ===============================
// BARRA DE VIDA
// ===============================
function actualizarBarraVida(porcentajeVida) {
    const vidaBarra = document.getElementById("vidaBarra");
    if (vidaBarra) vidaBarra.style.width = `${porcentajeVida}%`;
}

// ===============================
// BARRA DE MAGIA
// ===============================
function actualizarBarraMagia(maxMagia) {
    let barraMagia = document.getElementById("barraMagia");
    if (!barraMagia) {
        barraMagia = document.createElement("div");
        barraMagia.id = "barraMagia";
        barraMagia.style.cssText = "width:200px;height:20px;background:#444;border:2px solid #000;border-radius:5px;position:relative;margin-top:10px;";
        const fillBase = document.createElement("div");
        fillBase.id = "barraMagiaFillBase";
        fillBase.style.cssText = "height:100%;width:0%;background:#00f;border-radius:3px;position:absolute;left:0;top:0;";
        const fillBonus = document.createElement("div");
        fillBonus.id = "barraMagiaFillBonus";
        fillBonus.style.cssText = "height:100%;width:0%;background:#0ff;border-radius:3px;position:absolute;left:0;top:0;";
        barraMagia.appendChild(fillBase);
        barraMagia.appendChild(fillBonus);
        document.getElementById("gameArea")?.appendChild(barraMagia);
    }

    const fillBase = document.getElementById("barraMagiaFillBase");
    const fillBonus = document.getElementById("barraMagiaFillBonus");

    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = (jugador.inventario.orbeUsados || 0) * 2;
    const magiaBase = Math.min(jugador.magia, maxMagiaBase);
    const magiaBonus = Math.max(0, jugador.magia - maxMagiaBase);

    if (fillBase) fillBase.style.width = maxMagia > 0 ? (magiaBase / maxMagia) * 100 + "%" : "0%";
    if (fillBonus) fillBonus.style.width = maxMagia > 0 ? (magiaBonus / maxMagia) * 100 + "%" : "0%";
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
(function() {
    const style = document.createElement("style");
    style.textContent = `
        .usar-item-anim { animation: pulse 0.3s ease; }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); box-shadow: 0 0 20px currentColor; }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
})();
