// ===============================
// LOOT SYSTEM PRO (RPG AVANZADO)
// ===============================
function darLoot(tipoEnemigo = "normal") {
    asegurarInventario();

    const nivel = jugador.nivel;
    let pool = [];
    let mensaje = "";

    // =========================
    // 🧩 POOLS DE LOOT
    // =========================

    const comunes = [
        { key: "pocion", txt: "🧪 Pociones x2", cantidad: 2 },
        { key: "espada", txt: "⚔️ Espada común", cantidad: 1 },
        { key: "armadura", txt: "🛡️ Armadura común", cantidad: 1 },
        { key: "casco", txt: "⛑️ Casco", cantidad: 1 },
        { key: "camisa", txt: "👕 Camisa", cantidad: 1 },
        { key: "botas", txt: "👢 Botas", cantidad: 1 },
        { key: "pantalon", txt: "👖 Pantalón", cantidad: 1 }
    ];

    const raros = [
        { key: "cristal", txt: "💎 Cristal Místico", cantidad: 1 },
        { key: "orbe", txt: "🔮 Orbe de Poder", cantidad: 1 },
        { key: "daga", txt: "🗡️ Daga", cantidad: 1 },
        { key: "guantes", txt: "🧤 Guantes", cantidad: 1 }
    ];

    const epicos = [
        { key: "armaduraEpica", txt: "🛡️ Armadura Épica", cantidad: 1 },
        { key: "botasEpicas", txt: "👢 Botas Épicas", cantidad: 1 },
        { key: "cascoEpico", txt: "⛑️ Casco Épico", cantidad: 1 }
    ];

    const legendarios = [
        { key: "espadaLegendaria", txt: "⚔️ ESPADA LEGENDARIA", cantidad: 1 },
        { key: "armaduraLegendaria", txt: "🛡️ ARMADURA LEGENDARIA", cantidad: 1 }
    ];

    // =========================
    // 🎯 HASTA NIVEL 20 (LINEAL)
    // =========================
    if (nivel <= 20) {

        if (nivel <= 5) pool = comunes;
        else if (nivel <= 10) pool = raros;
        else if (nivel <= 15) pool = epicos;
        else pool = legendarios;

    }

    // =========================
    // 🔥 NIVEL 20+ (DINÁMICO)
    // =========================
    else {

        if (tipoEnemigo === "debil") {
            // Mayormente común
            const r = Math.random();
            if (r < 0.7) pool = comunes;
            else pool = raros;
        }

        else if (tipoEnemigo === "normal") {
            // Balanceado
            const r = Math.random();
            if (r < 0.4) pool = comunes;
            else if (r < 0.75) pool = raros;
            else pool = epicos;
        }

        else if (tipoEnemigo === "fuerte") {
            // Buen loot
            const r = Math.random();
            if (r < 0.3) pool = raros;
            else if (r < 0.8) pool = epicos;
            else pool = legendarios;
        }

        else if (tipoEnemigo === "boss") {
            // 🔥 SIEMPRE buen loot
            const r = Math.random();

            if (r < 0.7) {
                pool = epicos;
            } else {
                pool = legendarios;
            }

            // BONUS EXTRA PARA BOSS
            const bonus = Math.random();
            if (bonus < 0.5) {
                jugador.inventario.pocion += 2;
            }
        }
    }

    // =========================
    // 🎲 ELEGIR ITEM
    // =========================
    const item = pool[Math.floor(Math.random() * pool.length)];

    jugador.inventario[item.key] = (jugador.inventario[item.key] || 0) + item.cantidad;

    // =========================
    // ✨ MENSAJE BONITO
    // =========================
    if (pool === comunes) mensaje = item.txt;
    else if (pool === raros) mensaje = `🔹 ${item.txt}`;
    else if (pool === epicos) mensaje = `✨ ${item.txt}`;
    else mensaje = `🔥 ${item.txt}`;

    return `🎁 Botín: ${mensaje}`;
}
