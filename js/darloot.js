// ===============================
// LOOT SYSTEM PRO
// ===============================

function darLoot() {
    asegurarInventario();

    const r = Math.random();
    let mensaje = "";

    // 🟢 COMUNES (50%)
    if (r < 0.5) {
        const comunes = [
            { key: "pocion", txt: "🧪 Pociones x2", cantidad: 2 },
            { key: "espada", txt: "⚔️ Espada común", cantidad: 1 },
            { key: "armadura", txt: "🛡️ Armadura común", cantidad: 1 },
            { key: "casco", txt: "⛑️ Casco", cantidad: 1 },
            { key: "botas", txt: "👢 Botas", cantidad: 1 },
            { key: "pantalon", txt: "👖 Pantalón", cantidad: 1 }
        ];

        const item = comunes[Math.floor(Math.random() * comunes.length)];
        jugador.inventario[item.key] = (jugador.inventario[item.key] || 0) + item.cantidad;
        mensaje = item.txt;
    }

    // 🔵 RAROS (25%)
    else if (r < 0.75) {
        const raros = [
            { key: "cristal", txt: "💎 Cristal Místico" },
            { key: "orbe", txt: "🔮 Orbe de Poder" },
            { key: "arco", txt: "🏹 Arco reforzado" },
            { key: "daga", txt: "🗡️ Daga veloz" },
            { key: "guantes", txt: "🧤 Guantes de combate" }
        ];

        const item = raros[Math.floor(Math.random() * raros.length)];
        jugador.inventario[item.key] = (jugador.inventario[item.key] || 0) + 1;
        mensaje = item.txt;
    }

    // 🟣 ÉPICOS (15%)
    else if (r < 0.90) {
        const epicos = [
            { key: "armaduraEpica", txt: "🛡️ Armadura Épica" },
            { key: "botasEpicas", txt: "👢 Botas Épicas" },
            { key: "cascoEpico", txt: "⛑️ Casco Épico" }
        ];

        const item = epicos[Math.floor(Math.random() * epicos.length)];
        jugador.inventario[item.key] = (jugador.inventario[item.key] || 0) + 1;
        mensaje = `✨ ${item.txt}`;
    }

    // 🟡 LEGENDARIOS (10%)
    else {
        const legendarios = [
            { key: "espadaLegendaria", txt: "⚔️ ESPADA LEGENDARIA" },
            { key: "armaduraLegendaria", txt: "🛡️ ARMADURA LEGENDARIA" }
        ];

        const item = legendarios[Math.floor(Math.random() * legendarios.length)];
        jugador.inventario[item.key] = (jugador.inventario[item.key] || 0) + 1;
        mensaje = `🔥 ${item.txt}`;
    }

    return `🎁 Botín: ${mensaje}`;
}
