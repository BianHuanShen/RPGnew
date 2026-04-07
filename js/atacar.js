// ===== ATAQUE DEL JUGADOR (RPG PRO) =====
function atacar() {
    if (!juegoActivo || jugador.vida <= 0 || enemigos.length === 0) return;

    const enemigo = enemigos[0];
    const enemigoDiv = gameArea.querySelector(`.enemigo[data-index="0"]`);
    if (!enemigoDiv) return;

    // =========================
    // ⚔️ CÁLCULO DE DAÑO (SIN CRÍTICO)
    // =========================
    let daño = jugador.ataque + jugador.magia - enemigo.defensa;

    // Bonus por tipo de enemigo (simple RPG)
    if (enemigo.claseInfo.clase === 'mago') daño *= 1.1;
    if (enemigo.claseInfo.clase === 'guerrero') daño *= 0.9;

    if (daño < 2) daño = 2;
    daño = Math.floor(daño);

    let mensaje = `⚔️ Atacas a ${enemigo.nombre}`;
    mensaje += `<br>Daño: <span style="color:#e74c3c">${daño}</span> HP`;

    // =========================
    // 💥 APLICAR DAÑO
    // =========================
    enemigo.vida -= daño;
    enemigo.vida = Math.max(0, enemigo.vida);

    const fill = enemigoDiv.querySelector(".barra-vida-enemigo-fill");
    if (fill) {
        fill.style.width = `${(enemigo.vida / enemigo.vidaMax) * 100}%`;
    }

    // 🎨 Animación golpe
    enemigoDiv.style.filter = "brightness(2) sepia(1) hue-rotate(-50deg)";
    setTimeout(() => enemigoDiv.style.filter = "", 200);

    // =========================
    // ☠️ ENEMIGO DERROTADO
    // =========================
    if (enemigo.vida <= 0) {
        enemigosDerrotadosNivel++;

        // 🎯 PUNTOS
        let puntos = 10;
        if (enemigo.tipo === "debil") puntos = 8;
        if (enemigo.tipo === "fuerte") puntos = 20;
        if (enemigo.tipo === "boss") puntos = 50;

        jugador.puntaje += puntos;

        // ❤️ CURACIÓN
        let curacion = 10;
        if (enemigo.tipo === "fuerte") curacion = 15;
        if (enemigo.tipo === "boss") curacion = 30;

        jugador.vida = Math.min(jugador.vidaMax, jugador.vida + curacion);

        mensaje += `<br>✅ ${enemigo.nombre} derrotado (+${puntos} pts, +${curacion} HP)`;

        // =========================
        // 🎁 LOOT INTELIGENTE
        // =========================
        let tipoLoot = "normal";

        if (enemigo.tipo === "debil") tipoLoot = "debil";
        else if (enemigo.tipo === "fuerte") tipoLoot = "fuerte";
        else if (enemigo.tipo === "boss") tipoLoot = "boss";

        const lootMsg = darLoot(tipoLoot);

        if (lootMsg) {
            mensaje += `<br>${lootMsg}`;
        }

        if (sonidoLoot) sonidoLoot.play().catch(() => {});

        enemigos.shift();
        enemigoDiv.remove();
        dibujarEnemigos();
    }

    // =========================
    // 👊 CONTRAATAQUE
    // =========================
    ataqueEnemigosTurno();

    mensajeEl.innerHTML = mensaje;

    actualizarUI();
    revisarEstado();
}
