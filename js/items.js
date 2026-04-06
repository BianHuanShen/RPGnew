// ===============================
// ITEMS SYSTEM - ACCIONES
// ===============================

function asegurarInventario() {
    const items = [
        "pocion", "espada", "armadura",
        "cristal", "orbe",
        "espadaLegendaria", "armaduraEpica",
        "magia", "orbeUsados"
    ];

    items.forEach(item => {
        jugador.inventario[item] = Number(jugador.inventario[item]) || 0;
    });

    jugador.magia = Number(jugador.magia) || 0;
}

// ===== CURACIÓN =====
function curar() {
    if (!juegoActivo || jugador.vida <= 0) return;
    asegurarInventario();

    if (jugador.inventario.pocion <= 0) {
        mensajeEl.textContent = "❌ No tienes pociones";
        return;
    }

    const curacion = 25;
    const vidaAnterior = jugador.vida;
    jugador.vida = Math.min(jugador.vidaMax, jugador.vida + curacion);
    jugador.inventario.pocion--;

    const curadoReal = jugador.vida - vidaAnterior;
    mensajeEl.textContent = `🧪 Curado +${curadoReal} HP`;

    animarBoton(curarBtn);
    actualizarUI();
}

// ===== EQUIPAR ARMA =====
function equiparArma() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.espada <= 0) {
        mensajeEl.textContent = "❌ No tienes espadas";
        return;
    }

    jugador.ataque += 5;
    jugador.inventario.espada--;
    mensajeEl.textContent = "⚔️ Espada equipada (+5 ataque)";

    animarBoton(equiparArmaBtn);
    actualizarUI();
}

// ===== EQUIPAR ARMADURA =====
function equiparArmadura() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.armadura <= 0) {
        mensajeEl.textContent = "❌ No tienes armaduras";
        return;
    }

    jugador.defensa += 3;
    jugador.inventario.armadura--;
    mensajeEl.textContent = "🛡️ Armadura equipada (+3 defensa)";

    animarBoton(equiparArmaduraBtn);
    actualizarUI();
}

// ===== APRENDER MAGIA =====
function aprenderMagia() {
    if (!juegoActivo || jugador.vida <= 0) return;
    asegurarInventario();

    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = jugador.inventario.orbeUsados * 2;
    const maxMagia = maxMagiaBase + bonusOrbes;

    if (jugador.magia < maxMagia) {
        jugador.magia++;
        jugador.inventario.magia++;
        const magiaRestante = maxMagia - jugador.magia;
        mensajeEl.textContent = `✨ Magia aumentada: ${jugador.magia}/${maxMagia}`;
    } else {
        mensajeEl.textContent = `⚠️ Límite de magia alcanzado (${maxMagia})`;
    }

    actualizarUI();
}

// ===== USAR CRISTAL =====
function usarCristal() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.cristal <= 0) {
        mensajeEl.textContent = "❌ No tienes cristales";
        return;
    }

    jugador.ataque += 15;
    jugador.inventario.cristal--;
    mensajeEl.textContent = "💎 Cristal usado (+15 ataque)";

    animarBoton(usarCristalBtn);
    actualizarUI();
}

// ===== USAR ORBE =====
function usarOrbe() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.orbe <= 0) {
        mensajeEl.textContent = "❌ No tienes orbes";
        return;
    }

    jugador.inventario.orbe--;
    jugador.inventario.orbeUsados++;

    const maxMagiaBase = Math.floor(jugador.nivel / 3) * 2;
    const bonusOrbes = jugador.inventario.orbeUsados * 2;
    const maxMagia = maxMagiaBase + bonusOrbes;

    // Aumentar magia hasta el nuevo límite
    jugador.magia = Math.min(jugador.magia + 2, maxMagia);

    mensajeEl.textContent = "🔮 Orbe usado (+2 magia máxima)";

    animarBoton(usarOrbeBtn);
    actualizarUI();
}

// ===== ESPADA LEGENDARIA =====
function equiparEspadaLegendaria() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.espadaLegendaria <= 0) {
        mensajeEl.textContent = "❌ No tienes espadas legendarias";
        return;
    }

    jugador.ataque += 25;
    jugador.inventario.espadaLegendaria--;
    mensajeEl.textContent = "⚔️ ¡Espada Legendaria equipada! (+25 ataque)";

    animarBoton(equiparEspadaLegendariaBtn);
    actualizarUI();
}

// ===== ARMADURA ÉPICA =====
function equiparArmaduraEpica() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.armaduraEpica <= 0) {
        mensajeEl.textContent = "❌ No tienes armaduras épicas";
        return;
    }

    jugador.defensa += 15;
    jugador.inventario.armaduraEpica--;
    mensajeEl.textContent = "🛡️ ¡Armadura Épica equipada! (+15 defensa)";

    animarBoton(equiparArmaduraEpicaBtn);
    actualizarUI();
}