// ===== BLOQUEAR/DESBLOQUEAR BOTONES =====
const todosBotones = [
    atacarBtn, curarBtn, equiparArmaBtn, equiparArmaduraBtn,
    aprenderMagiaBtn, usarCristalBtn, usarOrbeBtn,
    equiparEspadaLegendariaBtn, equiparArmaduraEpicaBtn,
    equiparArmaduraLegendariaBtn, equiparCascoBtn, equiparCamisaBtn,
    equiparGuantesBtn, equiparPantalonBtn, equiparBotasBtn,
    equiparCascoEpicoBtn, equiparBotasEpicasBtn
];

function bloquearBotones() {
    todosBotones.forEach(btn => btn && (btn.disabled = true));
}

function desbloquearBotones() {
    todosBotones.forEach(btn => btn && (btn.disabled = false));
}
// ===== EVENT LISTENERS =====
document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // ⚔️ ACCIONES PRINCIPALES
    // =========================
    atacarBtn?.addEventListener("click", atacar);
    curarBtn?.addEventListener("click", curar);
    equiparArmaBtn?.addEventListener("click", equiparArma);
    equiparArmaduraBtn?.addEventListener("click", equiparArmadura);
    aprenderMagiaBtn?.addEventListener("click", aprenderMagia);
    usarCristalBtn?.addEventListener("click", usarCristal);
    usarOrbeBtn?.addEventListener("click", usarOrbe);

    // =========================
    // 🟡 LEGENDARIOS
    // =========================
    equiparEspadaLegendariaBtn?.addEventListener("click", equiparEspadaLegendaria);
    equiparArmaduraLegendariaBtn?.addEventListener("click", equiparArmaduraLegendaria);

    // =========================
    // 🟣 ÉPICOS
    // =========================
    equiparArmaduraEpicaBtn?.addEventListener("click", equiparArmaduraEpica);
    equiparCascoEpicoBtn?.addEventListener("click", equiparCascoEpico);
    equiparBotasEpicasBtn?.addEventListener("click", equiparBotasEpicas);

    // =========================
    // 🟢 EQUIPO BASE
    // =========================
    equiparCascoBtn?.addEventListener("click", equiparCasco);
    equiparCamisaBtn?.addEventListener("click", equiparCamisa);
    equiparGuantesBtn?.addEventListener("click", equiparGuantes);
    equiparPantalonBtn?.addEventListener("click", equiparPantalon);
    equiparBotasBtn?.addEventListener("click", equiparBotas);

    // =========================
    // 🎒 INVENTARIO
    // =========================
    abrirInventarioBtn?.addEventListener("click", () => {
        if (ventanaInventario) ventanaInventario.style.display = "block";
    });

    cerrarInventario?.addEventListener("click", () => {
        if (ventanaInventario) ventanaInventario.style.display = "none";
    });

});
