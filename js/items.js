// ===============================
// ITEMS SYSTEM - ACCIONES
// ===============================
function asegurarInventario() {
    const items = [
        // 🟢 COMUNES (base del juego)
        "pocion",
        "espada",
        "armadura",
        "casco",
        "camisa",
        "botas",
        "pantalon",

        // 🔵 RAROS (mejoras híbridas)
        "cristal",
        "orbe",
        "daga",
        "guantes",

        // 🟣 ÉPICOS (stats altos)
        "armaduraEpica",
        "botasEpicas",
        "cascoEpico",

        // 🟡 LEGENDARIOS (top tier)
        "espadaLegendaria",
        "armaduraLegendaria",

        // ✨ SISTEMAS
        "magia",
        "orbeUsados"
    ];

    items.forEach(item => {
        jugador.inventario[item] = Number(jugador.inventario[item]) || 0;
    });

    // Asegurar magia como número
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
function escalarStat(base) {
    return Math.floor(base + (jugador.nivel * 0.5));
}
// ===== EQUIPAR ARMA =====
function equiparArma() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.espada <= 0) {
        mensajeEl.textContent = "❌ No tienes espadas";
        return;
    }

    const atk = escalarStat(4);
    jugador.ataque += atk;
    jugador.inventario.espada--;

    mensajeEl.textContent = `⚔️ Espada equipada (+${atk} ataque)`;

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

    const def = escalarStat(3);
    const hp = escalarStat(5);

    jugador.defensa += def;
    jugador.vidaMax += hp;
    jugador.inventario.armadura--;

    mensajeEl.textContent = `🛡️ Armadura equipada (+${def} defensa, +${hp} vida)`; 

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
function equiparDaga() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.daga <= 0) {
        mensajeEl.textContent = "❌ No tienes dagas";
        return;
    }

    const atk = escalarStat(5);

    jugador.ataque += atk;
    jugador.inventario.daga--;

    mensajeEl.textContent = `🗡️ Daga (+${atk} ataque)`;

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

    const atk = escalarStat(20);
    const crit = 20;

    jugador.ataque += atk;
    jugador.inventario.espadaLegendaria--;

    mensajeEl.textContent = `⚔️ LEGENDARIA (+${atk} ataque, +${crit}% crítico)`; 

    animarBoton(equiparEspadaLegendariaBtn);
    actualizarUI();
}
function equiparArmaduraLegendaria() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.armaduraLegendaria <= 0) {
        mensajeEl.textContent = "❌ No tienes armaduras legendarias";
        return;
    }

    const def = escalarStat(20);
    const hp = escalarStat(25);

    jugador.defensa += def;
    jugador.vidaMax += hp;
    jugador.inventario.armaduraLegendaria--;

    mensajeEl.textContent = `🛡️ LEGENDARIA (+${def} defensa, +${hp} vida)`;

    actualizarUI();
}
// ===============================
// ropa
// ===============================
function equiparCasco() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.casco <= 0) {
        mensajeEl.textContent = "❌ No tienes cascos";
        return;
    }

    const def = escalarStat(3);
    const hp = escalarStat(2);

    jugador.defensa += def;
    jugador.vidaMax += hp;
    jugador.inventario.casco--;

    mensajeEl.textContent = `⛑️ Casco (+${def} defensa, +${hp} vida)`;

    actualizarUI();
}
function equiparCamisa() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.camisa <= 0) {
        mensajeEl.textContent = "❌ No tienes camisas";
        return;
    }

    const def = escalarStat(4);
    const hp = escalarStat(6);

    jugador.defensa += def;
    jugador.vidaMax += hp;
    jugador.inventario.camisa--;

    mensajeEl.textContent = `👕 Camisa equipada (+${def} defensa, +${hp} vida)`;

    actualizarUI();
}
function equiparGuantes() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.guantes <= 0) {
        mensajeEl.textContent = "❌ No tienes guantes";
        return;
    }

    const atk = escalarStat(3);
    const magia = 1;

    jugador.ataque += atk;
    jugador.magia += magia;
    jugador.inventario.guantes--;

    mensajeEl.textContent = `🧤 Guantes (+${atk} ataque, +${magia} magia)`;

    actualizarUI();
}
function equiparPantalon() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.pantalon <= 0) {
        mensajeEl.textContent = "❌ No tienes pantalones";
        return;
    }

    const hp = escalarStat(10);

    jugador.vidaMax += hp;
    jugador.inventario.pantalon--;

    mensajeEl.textContent = `👖 Pantalón (+${hp} vida)`;

    actualizarUI();
}
function equiparBotas() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.botas <= 0) {
        mensajeEl.textContent = "❌ No tienes botas";
        return;
    }

    const def = escalarStat(2);
    const hp = escalarStat(3);

    jugador.defensa += def;
    jugador.vidaMax += hp;
    jugador.inventario.botas--;

    mensajeEl.textContent = `👢 Botas (+${def} defensa, +${hp} vida)`;

    actualizarUI();
}
function equiparCascoEpico() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.cascoEpico <= 0) {
        mensajeEl.textContent = "❌ No tienes cascos épicos";
        return;
    }

    const def = escalarStat(7);
    const hp = escalarStat(5);

    jugador.defensa += def;
    jugador.vidaMax += hp;
    jugador.inventario.cascoEpico--;

    mensajeEl.textContent = `⛑️ Casco épico (+${def} defensa, +${hp} vida)`;

    actualizarUI();
}
function equiparBotasEpicas() {
    if (!juegoActivo) return;
    asegurarInventario();

    if (jugador.inventario.botasEpicas <= 0) {
        mensajeEl.textContent = "❌ No tienes botas épicas";
        return;
    }

    const def = escalarStat(6);
    const hp = escalarStat(6);

    jugador.defensa += def;
    jugador.vidaMax += hp;
    jugador.inventario.botasEpicas--;

    mensajeEl.textContent = `👢 Botas épicas (+${def} defensa, +${hp} vida)`;

    actualizarUI();
}
