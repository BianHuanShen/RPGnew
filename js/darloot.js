// ===============================
// LOOT SYSTEM
// ===============================

function darLoot() {
    asegurarInventario();

    const r = Math.random();
    let mensaje = "";

    if (r < 0.5) {
        jugador.inventario.pocion += 2;
        mensaje = "🧪 Pociones x2";
    } else if (r < 0.7) {
        jugador.inventario.espada += 1;
        mensaje = "⚔️ Espada común";
    } else if (r < 0.85) {
        jugador.inventario.armadura += 1;
        mensaje = "🛡️ Armadura común";
    } else if (r < 0.92) {
        jugador.inventario.cristal += 1;
        mensaje = "💎 Cristal Místico";
    } else if (r < 0.96) {
        jugador.inventario.orbe += 1;
        mensaje = "🔮 Orbe de Poder";
    } else if (r < 0.98) {
        jugador.inventario.espadaLegendaria += 1;
        mensaje = "⚔️ ¡ESPADA LEGENDARIA!";
    } else {
        jugador.inventario.armaduraEpica += 1;
        mensaje = "🛡️ ¡ARMADURA ÉPICA!";
    }

    return `🎁 Botín: ${mensaje}`;
}