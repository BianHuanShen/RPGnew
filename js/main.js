// ===============================
// MINI RPG PRO - CORE SYSTEM v2.1
// Sistema fusionado: Código base + Enemigos Mejorados
// ===============================

// ===== CONFIGURACIÓN DE ENEMIGOS (NUEVO) =====
const TIPOS_ENEMIGO = {
    MAGO: { clase: 'mago', color: '#9b59b6', statMod: { ataque: 1.3, defensa: 0.7, velocidad: 0.8 } },
    GUERRERO: { clase: 'guerrero', color: '#e74c3c', statMod: { ataque: 1.2, defensa: 1.3, velocidad: 0.9 } },
    ARQUERO: { clase: 'arquero', color: '#27ae60', statMod: { ataque: 1.4, defensa: 0.6, velocidad: 1.3 } },
    ESQUELETO: { clase: 'esqueleto', color: '#95a5a6', statMod: { ataque: 1.0, defensa: 0.8, velocidad: 1.0 } }
};

// Rutas de imágenes organizadas (10 tipos por clase)
const RUTAS_IMAGENES = {
    enemigos: {
        mago: Array.from({ length: 10 }, (_, i) => `img/mago${i + 1}.jpeg`),
        guerrero: Array.from({ length: 10 }, (_, i) => `img/guerrero${i + 1}.jpeg`),
        arquero: Array.from({ length: 10 }, (_, i) => `img/arquero${i + 1}.jpeg`),
        esqueleto: Array.from({ length: 10 }, (_, i) => `img/esqueleto${i + 1}.jpeg`)
    },
    jefes: {
        mago: Array.from({ length: 10 }, (_, i) => `img/boss_mago${i + 1}.jpeg`),
        guerrero: Array.from({ length: 10 }, (_, i) => `img/boss_guerrero${i + 1}.jpeg`),
        arquero: Array.from({ length: 10 }, (_, i) => `img/boss_arquero${i + 1}.jpeg`),
        esqueleto: Array.from({ length: 10 }, (_, i) => `img/boss_esqueleto${i + 1}.jpeg`)
    },
    fallback: {
        mago: 'img/mago.jpeg',
        guerrero: 'img/enemigo1.jpeg',
        arquero: 'img/enemigo2.jpeg',
        esqueleto: 'img/enemigo3.jpeg',
        boss: 'img/boss.jpeg'
    }
};

// ===== JUGADOR =====
const jugador = {
    vida: 100,
    vidaMax: 100,
    ataque: 10,
    defensa: 5,
    magia: 0,
    nivel: 1,
    puntaje: 0,
    inventario: {
        pocion: 30,
        espada: 1,
        armadura: 1,
        magia: 0,
        cristal: 0,
        orbe: 0,
        orbeUsados: 0,
        espadaLegendaria: 0,
        armaduraEpica: 0
    }
};

// ===== ESTADO GLOBAL =====
let enemigos = [];
let nivelActual = 1;
let juegoActivo = true;
let enemigosDerrotadosNivel = 0;

// ===== SONIDOS =====
const sonidoGolpe = new Audio("sonidos/golpe.mp3");
const sonidoCritico = new Audio("sonidos/critico.mp3");
const sonidoLoot = new Audio("sonidos/loot.mp3");

// ===== DOM ELEMENTS =====
const gameArea = document.getElementById("gameArea");
const vidaJugadorFill = document.getElementById("vidaJugadorFill");
const ataqueJugadorEl = document.getElementById("ataqueJugador");
const defensaJugadorEl = document.getElementById("defensaJugador");
const magiaJugadorEl = document.getElementById("magiaJugador");
const nivelJugadorEl = document.getElementById("nivelJugador");
const puntajeEl = document.getElementById("puntaje");
const listaInventarioEl = document.getElementById("listaInventario");
const mensajeEl = document.getElementById("mensaje");
const escenario = document.getElementById("escenario");

// Botones
const atacarBtn = document.getElementById("atacarBtn");
const curarBtn = document.getElementById("curarBtn");
const equiparArmaBtn = document.getElementById("equiparArmaBtn");
const equiparArmaduraBtn = document.getElementById("equiparArmaduraBtn");
const equiparEspadaLegendariaBtn = document.getElementById("equiparEspadaLegendariaBtn");
const equiparArmaduraEpicaBtn = document.getElementById("equiparArmaduraEpicaBtn");
const usarCristalBtn = document.getElementById("usarCristalBtn");
const usarOrbeBtn = document.getElementById("usarOrbeBtn");
const aprenderMagiaBtn = document.getElementById("aprenderMagiaBtn");
const abrirInventarioBtn = document.getElementById("abrirInventarioBtn");
const ventanaInventario = document.getElementById("ventanaInventario");
const cerrarInventario = document.getElementById("cerrarInventario");

// Crear jugador visual
const jugadorDiv = document.createElement("div");
jugadorDiv.id = "jugador";
jugadorDiv.style.position = "absolute";
jugadorDiv.style.left = "100px";
jugadorDiv.style.top = "300px";
gameArea.appendChild(jugadorDiv);

// ===== FUNCIONES UTILITARIAS =====
function esCritico() {
    return Math.random() < 0.2;
}

// NUEVO: Obtener clase aleatoria
function getClaseAleatoria() {
    const claves = Object.keys(TIPOS_ENEMIGO);
    return TIPOS_ENEMIGO[claves[Math.floor(Math.random() * claves.length)]];
}

// NUEVO: Calcular variante según nivel (1-10)
function getVarianteEnemigo(nivel) {
    return Math.min(Math.ceil(nivel / 2), 10);
}

// NUEVO: Sistema de rutas mejorado
function getRutaEnemigo(enemigo) {
    const clase = enemigo.claseInfo.clase;
    const variante = enemigo.variante; // ✅ FIX

    if (enemigo.jefe) {
        const rutaJefe = RUTAS_IMAGENES.jefes[clase]?.[variante - 1];
        if (rutaJefe) return rutaJefe;
        return RUTAS_IMAGENES.fallback.boss;
    } else {
        const rutaNormal = RUTAS_IMAGENES.enemigos[clase]?.[variante - 1];
        if (rutaNormal) return rutaNormal;
        return RUTAS_IMAGENES.fallback[clase] || RUTAS_IMAGENES.fallback.guerrero;
    }
}
// ===== CREAR ENEMIGO MEJORADO =====
function crearEnemigo(nivel, jefe = false) {
    const claseInfo = getClaseAleatoria();
    const factor = 1 + (nivel * 0.15);
    const variante = getVarianteEnemigo(nivel);

    let vida = 30 + (nivel * 6 * factor) + (variante * 5);
    let ataque = 5 + (nivel * 1.2 * factor);
    let defensa = 2 + (nivel * 0.7 * factor);
    let velocidad = 0.5;

    ataque *= claseInfo.statMod.ataque;
    defensa *= claseInfo.statMod.defensa;
    velocidad *= claseInfo.statMod.velocidad;

    if (jefe) {
        const bossFactor = 2.5 + (nivel * 0.08);
        vida *= bossFactor;
        ataque *= 1.4;
        defensa *= 1.3;
        velocidad *= 0.8;
    }

    return {
        vida: Math.floor(vida),
        vidaMax: Math.floor(vida),
        ataque: Math.floor(ataque),
        defensa: Math.floor(defensa),
        velocidad: velocidad,
        jefe: jefe,
        claseInfo: claseInfo,
        variante: variante,
        nombre: generarNombreEnemigo(claseInfo.clase, variante, jefe),

        // ✅ IA CORREGIDA
        ia: jefe ? 'jefe' : (Math.random() < 0.5 ? 'agresivo' : 'defensivo')
    };
}
// NUEVO: Generador de nombres épicos
function generarNombreEnemigo(clase, variante, jefe) {
    const prefijos = [
        'Oscuro', 'Infernal', 'Celestial', 'Venenoso',
        'Cristal', 'Sombrío', 'Eterno', 'Salvaje',
        'Ancestral', 'Legendario'
    ];

    const prefijo = prefijos[variante - 1] || prefijos[0];
    const titulo = jefe ? '★ JEFE ★' : '';
    const claseCapitalizada = clase.charAt(0).toUpperCase() + clase.slice(1);

    return `${titulo} ${prefijo} ${claseCapitalizada}`;
}
// ===== DIBUJAR ENEMIGOS MEJORADO =====
function dibujarEnemigos() {
    gameArea.querySelectorAll(".enemigo").forEach(e => e.remove());

    enemigos.forEach((e, index) => {
        const div = document.createElement("div");
        div.classList.add("enemigo");
        div.dataset.index = index;
        div.dataset.jefe = e.jefe;
        div.dataset.ia = e.ia;
        div.dataset.clase = e.claseInfo.clase; // NUEVO
        div.title = e.nombre; // NUEVO

        // NUEVO: Posición distribuida en grid
        const offsetX = 200 + (index % 4) * 100;
        const offsetY = 100 + Math.floor(index / 4) * 120 + (Math.random() * 40);

        div.style.position = "absolute";
        div.style.left = `${Math.min(offsetX, gameArea.offsetWidth - 80)}px`;
        div.style.top = `${Math.min(offsetY, gameArea.offsetHeight - 80)}px`;

        const img = getRutaEnemigo(e);
        div.style.backgroundImage = `url('${img}')`;
        div.style.backgroundSize = "contain";
        div.style.backgroundRepeat = "no-repeat";
        div.style.backgroundPosition = "center";
        div.classList.add("animado");

        // NUEVO: Borde de color según clase
        div.style.border = `2px solid ${e.claseInfo.color}`;
        div.style.borderRadius = "8px";

        // Tamaño según tipo
        if (e.jefe) {
            div.style.width = "100px";
            div.style.height = "100px";
            div.classList.add("jefe");
            div.style.boxShadow = `0 0 20px ${e.claseInfo.color}`; // NUEVO
        } else {
            div.style.width = "64px";
            div.style.height = "64px";
        }

        // NUEVO: Indicador de clase (icono)
        const claseIndicador = document.createElement("div");
        claseIndicador.style.cssText = `
            position: absolute;
            top: -5px;
            right: -5px;
            width: 20px;
            height: 20px;
            background: ${e.claseInfo.color};
            border-radius: 50%;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #fff;
        `;
        claseIndicador.textContent = getIconoClase(e.claseInfo.clase);
        div.appendChild(claseIndicador);

        // Barra de vida mejorada
        const barra = document.createElement("div");
        barra.classList.add("barra-vida-enemigo");

        const fill = document.createElement("div");
        fill.classList.add("barra-vida-enemigo-fill");
        if (e.jefe) fill.classList.add("jefe");
        fill.style.width = "100%";
        // NUEVO: Color de barra según clase
        fill.style.background = e.jefe ?
            `linear-gradient(90deg, ${e.claseInfo.color}, #000)` :
            e.claseInfo.color;

        barra.appendChild(fill);
        div.appendChild(barra);

        // NUEVO: Nombre del enemigo
        const nombreTag = document.createElement("div");
        nombreTag.textContent = e.nombre;
        nombreTag.style.cssText = `
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            white-space: nowrap;
            color: #fff;
            text-shadow: 0 0 3px #000;
            background: rgba(0,0,0,0.7);
            padding: 2px 6px;
            border-radius: 4px;
        `;
        div.appendChild(nombreTag);

        gameArea.appendChild(div);
    });
}

// ===== GENERAR NIVEL MEJORADO =====
function generarNivel() {
    enemigos = [];
    enemigosDerrotadosNivel = 0;
    gameArea.querySelectorAll(".enemigo").forEach(e => e.remove());

    const esNivelJefe = (nivelActual % 5 === 0);
    const dificultadBase = 1 + Math.floor(nivelActual / 2);
    const multiplicadorDificultad = 1 + (nivelActual * 0.1);

    let numEnemigos;
    if (esNivelJefe) {
        numEnemigos = 1;
    } else {
        numEnemigos = Math.min(3 + dificultadBase, 8);
    }

    for (let i = 0; i < numEnemigos; i++) {
        // NUEVO: 10% chance de mini-jefe en niveles altos
        const esJefe = esNivelJefe || (Math.random() < 0.1 && nivelActual > 3);
        const enemigo = crearEnemigo(nivelActual, esJefe);

        // Aplicar multiplicador de dificultad
        enemigo.vidaMax = Math.floor(enemigo.vidaMax * multiplicadorDificultad);
        enemigo.vida = enemigo.vidaMax;
        enemigo.ataque = Math.floor(enemigo.ataque * multiplicadorDificultad);
        enemigo.defensa = Math.floor(enemigo.defensa * multiplicadorDificultad);

        enemigos.push(enemigo);
    }

    // NUEVO: Mensaje informativo
    mensajeEl.innerHTML = `⚔️ Nivel ${nivelActual} - ${esNivelJefe ? '<span style="color:#e74c3c">¡JEFE FINAL!</span>' : numEnemigos + ' enemigos'}`;

    dibujarEnemigos();
    if (typeof actualizarUI === 'function') actualizarUI();
}

// ===== ATAQUE DEL JUGADOR MEJORADO =====
function atacar() {
    if (!juegoActivo || jugador.vida <= 0 || enemigos.length === 0) return;

    const enemigo = enemigos[0];
    const enemigoDiv = gameArea.querySelector(`.enemigo[data-index="0"]`);
    if (!enemigoDiv) return;

    let daño = jugador.ataque + jugador.magia - enemigo.defensa;

    if (enemigo.claseInfo.clase === 'mago') daño *= 1.1;
    if (enemigo.claseInfo.clase === 'guerrero') daño *= 0.9;

    let mensaje = `⚔️ Atacas a ${enemigo.nombre}`;

    if (esCritico()) {
        daño *= 2;
        mensaje = `💥 ¡CRÍTICO contra ${enemigo.nombre}!`;
    }

    if (daño < 2) daño = 2;
    daño = Math.floor(daño);

    enemigo.vida -= daño;
    enemigo.vida = Math.max(0, enemigo.vida);

    const fill = enemigoDiv.querySelector(".barra-vida-enemigo-fill");
    if (fill) {
        fill.style.width = `${(enemigo.vida / enemigo.vidaMax) * 100}%`;
    }

    mensaje += `<br>Daño: <span style="color:#e74c3c">${daño}</span> HP`;

    if (enemigo.vida <= 0) {
        enemigos.shift();
        enemigoDiv.remove();
        mensaje += `<br>✅ ${enemigo.nombre} derrotado`;
        dibujarEnemigos();
    }

    mensajeEl.innerHTML = mensaje;

    actualizarUI?.();
    revisarEstado();
}
// NUEVO: Loot temático por clase
function darLootEspecial(clase, esJefe) {
    if (typeof asegurarInventario === 'function') asegurarInventario();

    const bonus = esJefe ? 2 : 1;

    switch (clase) {
        case 'mago':
            jugador.inventario.orbe += 1 * bonus;
            return `${bonus}x Orbe (magia)`;
        case 'guerrero':
            jugador.inventario.espada += 1 * bonus;
            return `${bonus}x Espada mejorada`;
        case 'arquero':
            jugador.inventario.cristal += 1 * bonus;
            return `${bonus}x Cristal (precisión)`;
        case 'esqueleto':
            if (Math.random() < 0.3 || esJefe) {
                jugador.inventario.armaduraEpica += 1;
                return "¡Armadura Épica!";
            }
            jugador.inventario.armadura += 2;
            return "2x Armadura ósea";
        default:
            return null;
    }
}

// ===== ATAQUE ENEMIGOS MEJORADO =====
function ataqueEnemigos() {
    if (!juegoActivo || jugador.vida <= 0) return;

    const jx = jugadorDiv.offsetLeft + jugadorDiv.offsetWidth / 2;
    const jy = jugadorDiv.offsetTop + jugadorDiv.offsetHeight / 2;

    document.querySelectorAll(".enemigo").forEach((enemigoDiv) => {
        const index = enemigoDiv.dataset.index;
        const enemigo = enemigos[index];

        if (!enemigo || enemigo.vida <= 0) return;

        const ex = enemigoDiv.offsetLeft + enemigoDiv.offsetWidth / 2;
        const ey = enemigoDiv.offsetTop + enemigoDiv.offsetHeight / 2;
        const distancia = Math.sqrt((jx - ex) ** 2 + (jy - ey) ** 2);

        let rangoAtaque = 60;
        if (enemigo.claseInfo.clase === 'arquero') rangoAtaque = 120;
        if (enemigo.claseInfo.clase === 'mago') rangoAtaque = 100;

        if (distancia <= rangoAtaque) {
            let daño = enemigo.ataque;

            if (enemigo.claseInfo.clase === 'arquero') {
                daño *= 0.6;
                if (Math.random() < 0.3) return;
            }

            if (enemigo.claseInfo.clase === 'mago') {
                daño += 3;
                daño += Math.floor(jugador.defensa * 0.3);
            }

            if (enemigo.claseInfo.clase === 'esqueleto') {
                daño *= 0.7;
                enemigo.vida = Math.min(enemigo.vidaMax, enemigo.vida + 2);
            }

            if (enemigo.ia === "agresivo") daño *= 1.2;
            if (enemigo.ia === "defensivo") daño *= 0.7;

            daño -= jugador.defensa;
            if (daño < 1) daño = 1;

            jugador.vida -= Math.floor(daño);
            jugador.vida = Math.max(0, jugador.vida);

            actualizarUI?.();
        }
    });
}
// ===== MOVIMIENTO ENEMIGOS MEJORADO =====
function moverEnemigos() {
    if (!juegoActivo || !gameLoopActivo) return;

    const jx = jugadorDiv.offsetLeft + jugadorDiv.offsetWidth / 2;
    const jy = jugadorDiv.offsetTop + jugadorDiv.offsetHeight / 2;

    document.querySelectorAll(".enemigo").forEach((enemigoDiv) => {
        const index = enemigoDiv.dataset.index;
        const enemigo = enemigos[index];

        if (!enemigo || enemigo.vida <= 0) return;

        const ex = enemigoDiv.offsetLeft + enemigoDiv.offsetWidth / 2;
        const ey = enemigoDiv.offsetTop + enemigoDiv.offsetHeight / 2;

        const dx = jx - ex;
        const dy = jy - ey;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        // ✅ FIX división por 0
        if (distancia === 0) return;

        let velocidad = enemigo.velocidad;

        if (enemigo.claseInfo.clase === 'arquero') {
            if (distancia < 80) velocidad *= -1;
        } else if (enemigo.claseInfo.clase === 'mago') {
            velocidad *= 0.6;
        } else if (enemigo.ia === "agresivo") {
            velocidad *= 1.3;
        } else if (enemigo.ia === "defensivo") {
            velocidad *= 0.6;
        }

        const rangoAtaque = enemigo.claseInfo.clase === 'arquero' ? 100 : 60;

        if (distancia > rangoAtaque || (enemigo.claseInfo.clase === 'arquero' && distancia < 60)) {
            const moveX = (dx / distancia) * velocidad;
            const moveY = (dy / distancia) * velocidad;

            const newLeft = enemigoDiv.offsetLeft + moveX;
            const newTop = enemigoDiv.offsetTop + moveY;

            const maxX = gameArea.offsetWidth - enemigoDiv.offsetWidth;
            const maxY = gameArea.offsetHeight - enemigoDiv.offsetHeight;

            enemigoDiv.style.left = Math.max(0, Math.min(newLeft, maxX)) + "px";
            enemigoDiv.style.top = Math.max(0, Math.min(newTop, maxY)) + "px";
        }
    });

    requestAnimationFrame(moverEnemigos);
}
// ===== REVISAR ESTADO MEJORADO =====
function revisarEstado() {
    if (jugador.vida <= 0) {
        jugador.vida = 0;
        juegoActivo = false;
        mensajeEl.innerHTML = "<span style='color:#e74c3c;font-size:18px'>💀 HAS SIDO DERROTADO 💀</span>";
        bloquearBotones();
        return;
    }

    if (enemigos.length === 0) {
        // NUEVO: Bonus de nivel
        const bonusNivel = nivelActual * 5;
        jugador.puntaje += bonusNivel;

        nivelActual++;
        jugador.nivel++;
        jugador.vidaMax += 10;
        jugador.vida = jugador.vidaMax;

        // NUEVO: Stats cada 3 niveles
        if (nivelActual % 3 === 0) {
            jugador.ataque += 2;
            jugador.defensa += 1;
        }

        mensajeEl.innerHTML = `<span style="color:#f1c40f;font-size:16px">✨ ¡NIVEL ${jugador.nivel} COMPLETADO! ✨</span><br>+${bonusNivel} pts bonus, Vida restaurada`;

        setTimeout(generarNivel, 2000);
    }
}

// ===== BLOQUEAR/DESBLOQUEAR BOTONES =====
function bloquearBotones() {
    const botones = [atacarBtn, curarBtn, equiparArmaBtn, equiparArmaduraBtn,
        aprenderMagiaBtn, usarCristalBtn, usarOrbeBtn,
        equiparEspadaLegendariaBtn, equiparArmaduraEpicaBtn];
    botones.forEach(btn => {
        if (btn) btn.disabled = true;
    });
}

function desbloquearBotones() {
    const botones = [atacarBtn, curarBtn, equiparArmaBtn, equiparArmaduraBtn,
        aprenderMagiaBtn];
    botones.forEach(btn => {
        if (btn) btn.disabled = false;
    });
}

// ===== EVENT LISTENERS =====
document.addEventListener("DOMContentLoaded", () => {
    // Botones de acción
    if (atacarBtn) atacarBtn.addEventListener("click", atacar);
    if (curarBtn) curarBtn.addEventListener("click", () => {
        if (typeof curar === 'function') curar();
    });
    if (equiparArmaBtn) equiparArmaBtn.addEventListener("click", () => {
        if (typeof equiparArma === 'function') equiparArma();
    });
    if (equiparArmaduraBtn) equiparArmaduraBtn.addEventListener("click", () => {
        if (typeof equiparArmadura === 'function') equiparArmadura();
    });
    if (aprenderMagiaBtn) aprenderMagiaBtn.addEventListener("click", () => {
        if (typeof aprenderMagia === 'function') aprenderMagia();
    });
    if (usarCristalBtn) usarCristalBtn.addEventListener("click", () => {
        if (typeof usarCristal === 'function') usarCristal();
    });
    if (usarOrbeBtn) usarOrbeBtn.addEventListener("click", () => {
        if (typeof usarOrbe === 'function') usarOrbe();
    });
    if (equiparEspadaLegendariaBtn) equiparEspadaLegendariaBtn.addEventListener("click", () => {
        if (typeof equiparEspadaLegendaria === 'function') equiparEspadaLegendaria();
    });
    if (equiparArmaduraEpicaBtn) equiparArmaduraEpicaBtn.addEventListener("click", () => {
        if (typeof equiparArmaduraEpica === 'function') equiparArmaduraEpica();
    });

    // Inventario
    if (abrirInventarioBtn) {
        abrirInventarioBtn.addEventListener("click", () => {
            if (ventanaInventario) ventanaInventario.style.display = "block";
        });
    }
    if (cerrarInventario) {
        cerrarInventario.addEventListener("click", () => {
            if (ventanaInventario) ventanaInventario.style.display = "none";
        });
    }

    // Movimiento con teclado
    document.addEventListener("keydown", e => {
        if (!juegoActivo) return;

        const step = 20;
        const left = jugadorDiv.offsetLeft;
        const top = jugadorDiv.offsetTop;
        const maxX = gameArea.offsetWidth - jugadorDiv.offsetWidth;
        const maxY = gameArea.offsetHeight - jugadorDiv.offsetHeight;

        switch (e.key) {
            case "ArrowRight":
                jugadorDiv.style.left = Math.min(left + step, maxX) + "px";
                break;
            case "ArrowLeft":
                jugadorDiv.style.left = Math.max(left - step, 0) + "px";
                break;
            case "ArrowUp":
                jugadorDiv.style.top = Math.max(top - step, 0) + "px";
                break;
            case "ArrowDown":
                jugadorDiv.style.top = Math.min(top + step, maxY) + "px";
                break;
            case " ": // NUEVO: Espacio para atacar
                atacar();
                break;
        }
    });
    // Arrastre del jugador
    let dragging = false;
    let offsetX = 0, offsetY = 0;

    function startDrag(e) {
        dragging = true;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const rect = jugadorDiv.getBoundingClientRect();
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;
        jugadorDiv.style.cursor = "grabbing";
        e.preventDefault();
    }

    function onDrag(e) {
        if (!dragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const gameRect = gameArea.getBoundingClientRect();
        let x = clientX - gameRect.left - offsetX;
        let y = clientY - gameRect.top - offsetY;

        const maxX = gameArea.offsetWidth - jugadorDiv.offsetWidth;
        const maxY = gameArea.offsetHeight - jugadorDiv.offsetHeight;

        jugadorDiv.style.left = Math.max(0, Math.min(x, maxX)) + "px";
        jugadorDiv.style.top = Math.max(0, Math.min(y, maxY)) + "px";
    }

    function stopDrag() {
        dragging = false;
        jugadorDiv.style.cursor = "grab";
    }

    jugadorDiv.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
    jugadorDiv.addEventListener("touchstart", startDrag);
    document.addEventListener("touchmove", onDrag);
    document.addEventListener("touchend", stopDrag);
    // Generar primer nivel
    generarNivel();
});
