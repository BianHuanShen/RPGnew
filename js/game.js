// ===============================
// MINI RPG PRO - CORE SYSTEM v2.1
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
        mago: 'img/mago1.jpeg',
        guerrero: 'img/guerrero1.jpeg',
        arquero: 'img/enemigo2.jpeg',
        esqueleto: 'img/esqueleto1.jpeg',
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
        // 🟢 Comunes
        pocion: 30,
        espada: 1,
        armadura: 1,
        casco: 0,
        botas: 0,
        pantalon: 0,

        // 🔵 Raros
        cristal: 0,
        orbe: 0,
        arco: 0,
        daga: 0,
        guantes: 0,

        // 🟣 Épicos
        armaduraEpica: 0,
        botasEpicas: 0,
        cascoEpico: 0,

        // 🟡 Legendarios
        espadaLegendaria: 0,
        armaduraLegendaria: 0,

        // Otros
        magia: 0,
        orbeUsados: 0
    }
};

// ===== ESTADO GLOBAL =====
let enemigos = [];
let nivelActual = 1;
let juegoActivo = true;
let enemigosDerrotadosNivel = 0;
let gameLoopActivo = false; // ✅ FIX: Variable faltante declarada

// ===== SONIDOS =====
const sonidoGolpe = new Audio("sonidos/golpe.mp3");
const sonidoCritico = new Audio("sonidos/critico.mp3");
const sonidoLoot = new Audio("sonidos/loot.mp3");

// ===== DOM ELEMENTS =====
let gameArea;
let vidaJugadorFill;
let ataqueJugadorEl;
let defensaJugadorEl;
let magiaJugadorEl;
let nivelJugadorEl;
let puntajeEl;
let listaInventarioEl;
let mensajeEl;
let escenario;
let atacarBtn;
let curarBtn;
let aprenderMagiaBtn;
let equiparArmaBtn;
let equiparArmaduraBtn;
let equiparCascoBtn;
let equiparCamisaBtn;
let equiparBotasBtn;
let equiparPantalonBtn;
let equiparArcoBtn;
let equiparDagaBtn;
let equiparGuantesBtn;
let equiparArmaduraEpicaBtn;
let equiparCascoEpicoBtn;
let equiparBotasEpicasBtn;
let equiparEspadaLegendariaBtn;
let equiparArmaduraLegendariaBtn;
let usarCristalBtn;
let usarOrbeBtn;
let abrirInventarioBtn;
let ventanaInventario;
let cerrarInventario;
let jugadorDiv;

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

// NUEVO: Obtener icono según clase
function getIconoClase(clase) { // ✅ FIX: Función faltante añadida
    const iconos = {
        mago: '🔮',
        guerrero: '⚔️',
        arquero: '🏹',
        esqueleto: '💀'
    };
    return iconos[clase] || '❓';
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
    actualizarUI();
}

// ===============================
// ATAQUE ENEMIGOS (POR TURNO)
// ===============================
function ataqueEnemigosTurno() {
    let dañoTotal = 0;

    enemigos.forEach(e => {
        if (!e || e.vida <= 0) return;

        let daño = e.ataque;

        // IA
        if (e.ia === "agresivo") daño *= 1.2;
        if (e.ia === "defensivo") daño *= 0.7;

        // Clases
        switch (e.claseInfo.clase) {
            case 'mago':
                daño += 3;
                break;

            case 'arquero':
                daño *= 0.6;
                if (Math.random() < 0.3) return;
                break;

            case 'esqueleto':
                daño *= 0.7;
                e.vida = Math.min(e.vidaMax, e.vida + 2);
                break;
        }

        daño -= jugador.defensa;
        if (daño < 1) daño = 1;

        daño = Math.floor(daño);
        dañoTotal += daño;
    });

    if (dañoTotal > 0) {
        jugador.vida -= dañoTotal;
        jugador.vida = Math.max(0, jugador.vida);
    }

    actualizarUI();
}

// ===== ATAQUE ENEMIGOS =====
function ataqueEnemigos() {
    if (!juegoActivo || jugador.vida <= 0) return;

    const jx = jugadorDiv.offsetLeft + jugadorDiv.offsetWidth / 2;
    const jy = jugadorDiv.offsetTop + jugadorDiv.offsetHeight / 2;

    let dañoTotal = 0;

    document.querySelectorAll(".enemigo").forEach((enemigoDiv) => {
        const enemigo = enemigos[enemigoDiv.dataset.index];
        if (!enemigo || enemigo.vida <= 0) return;

        const ex = enemigoDiv.offsetLeft + enemigoDiv.offsetWidth / 2;
        const ey = enemigoDiv.offsetTop + enemigoDiv.offsetHeight / 2;
        const distancia = Math.hypot(jx - ex, jy - ey);

        let rango = 60;
        if (enemigo.claseInfo.clase === 'arquero') rango = 120;
        if (enemigo.claseInfo.clase === 'mago') rango = 100;

        if (distancia > rango) return;

        let daño = enemigo.ataque;

        // Clases
        switch (enemigo.claseInfo.clase) {
            case 'arquero':
                daño *= 0.6;
                if (Math.random() < 0.3) return;
                break;

            case 'mago':
                daño += 3 + Math.floor(jugador.defensa * 0.3);
                break;

            case 'esqueleto':
                daño *= 0.7;
                enemigo.vida = Math.min(enemigo.vidaMax, enemigo.vida + 2);
                break;
        }

        // IA
        if (enemigo.ia === "agresivo") daño *= 1.2;
        if (enemigo.ia === "defensivo") daño *= 0.7;

        daño -= jugador.defensa;
        if (daño < 1) daño = 1;

        dañoTotal += Math.floor(daño);
    });

    if (dañoTotal > 0) {
        jugador.vida -= dañoTotal;
        jugador.vida = Math.max(0, jugador.vida);
        actualizarUI();
    }
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
    if (gameLoopActivo) {
        requestAnimationFrame(moverEnemigos);
    }
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

    // Animación
    enemigoDiv.style.filter = "brightness(2) sepia(1) hue-rotate(-50deg)";
    setTimeout(() => enemigoDiv.style.filter = "", 200);

    mensaje += `<br>Daño: <span style="color:#e74c3c">${daño}</span> HP`;

    if (enemigo.vida <= 0) {
        enemigosDerrotadosNivel++;

        let puntos = enemigo.jefe ? 50 : 10;
        if (enemigo.claseInfo.clase === 'esqueleto') puntos = 15;

        jugador.puntaje += puntos;

        const curacion = enemigo.jefe ? 30 : 10;
        jugador.vida = Math.min(jugador.vidaMax, jugador.vida + curacion);

        mensaje += `<br>✅ ${enemigo.nombre} derrotado (+${puntos} pts, +${curacion} HP)`;

        // 🎁 LOOT CORRECTO
        let lootMsg = darLoot(); // ← SOLO esto

        if (lootMsg) {
            mensaje += `<br>${lootMsg}`;
        }

        if (sonidoLoot) sonidoLoot.play().catch(() => { });

        enemigos.shift();
        enemigoDiv.remove();
        dibujarEnemigos();
    }

    // 👊 Contraataque
    ataqueEnemigosTurno();

    mensajeEl.innerHTML = mensaje;

    actualizarUI();
    revisarEstado();
}

// ===== REVISAR ESTADO MEJORADO (FIX FINAL) =====
function revisarEstado() {
    // 💀 GAME OVER
    if (jugador.vida <= 0) {
        jugador.vida = 0;
        juegoActivo = false;
        gameLoopActivo = false; // ✅ FIX: Detener game loop

        mensajeEl.innerHTML = `
            <span style="color:#e74c3c;font-size:18px">
                💀 HAS SIDO DERROTADO 💀
            </span>
        `;

        bloquearBotones();
        return;
    }

    // ✅ NIVEL COMPLETADO
    if (enemigos.length === 0) {
        const bonusNivel = nivelActual * 5;
        jugador.puntaje += bonusNivel;

        nivelActual++;
        jugador.nivel++;

        jugador.vidaMax += 10;
        jugador.vida = jugador.vidaMax;

        // 📈 Mejora de stats cada 3 niveles
        if (jugador.nivel % 3 === 0) {
            jugador.ataque += 2;
            jugador.defensa += 1;
        }

        // 🎁 Loot final (guardado correctamente)
        let lootFinal = "";
        if (typeof darLoot === "function") {
            lootFinal = darLoot() || "";
        }

        // 📝 Mensaje FINAL (ya no se pisa)
        mensajeEl.innerHTML = `
            <span style="color:#f1c40f;font-size:16px">
                ✨ ¡NIVEL ${jugador.nivel} COMPLETADO! ✨
            </span>
            <br>+${bonusNivel} pts bonus
            <br>❤️ Vida restaurada
            ${lootFinal ? `<br>🎁 ${lootFinal}` : ""}
        `;

        setTimeout(generarNivel, 2000);
    }
}

// ===== ACTUALIZAR UI =====
function actualizarUI() { // ✅ FIX: Función faltante añadida
    // Actualizar barra de vida
    if (vidaJugadorFill) {
        const porcentaje = (jugador.vida / jugador.vidaMax) * 100;
        vidaJugadorFill.style.width = `${Math.max(0, porcentaje)}%`;
    }

    // Actualizar stats
    if (ataqueJugadorEl) ataqueJugadorEl.textContent = jugador.ataque;
    if (defensaJugadorEl) defensaJugadorEl.textContent = jugador.defensa;
    if (magiaJugadorEl) magiaJugadorEl.textContent = jugador.magia;
    if (nivelJugadorEl) nivelJugadorEl.textContent = jugador.nivel;
    if (puntajeEl) puntajeEl.textContent = jugador.puntaje;

    // Actualizar inventario
    if (listaInventarioEl) {
        let html = '';
        for (const [item, cantidad] of Object.entries(jugador.inventario)) {
            if (cantidad > 0) {
                html += `<div class="item-inventario">${item}: ${cantidad}</div>`;
            }
        }
        listaInventarioEl.innerHTML = html || '<div class="item-inventario">Inventario vacío</div>';
    }
}

// ===== DAR LOOT =====
function darLoot() { // ✅ FIX: Función faltante añadida
    const lootTable = [
        { item: 'pocion', chance: 0.4, min: 1, max: 3 },
        { item: 'espada', chance: 0.15, min: 1, max: 1 },
        { item: 'armadura', chance: 0.15, min: 1, max: 1 },
        { item: 'casco', chance: 0.1, min: 1, max: 1 },
        { item: 'botas', chance: 0.1, min: 1, max: 1 },
        { item: 'pantalon', chance: 0.1, min: 1, max: 1 },
        { item: 'cristal', chance: 0.08, min: 1, max: 2 },
        { item: 'orbe', chance: 0.05, min: 1, max: 1 },
        { item: 'arco', chance: 0.05, min: 1, max: 1 },
        { item: 'daga', chance: 0.05, min: 1, max: 1 },
        { item: 'guantes', chance: 0.05, min: 1, max: 1 },
        { item: 'armaduraEpica', chance: 0.02, min: 1, max: 1 },
        { item: 'botasEpicas', chance: 0.02, min: 1, max: 1 },
        { item: 'cascoEpico', chance: 0.02, min: 1, max: 1 },
        { item: 'espadaLegendaria', chance: 0.005, min: 1, max: 1 },
        { item: 'armaduraLegendaria', chance: 0.005, min: 1, max: 1 }
    ];

    let lootMsg = '';
    let itemsConseguidos = [];

    for (const loot of lootTable) {
        if (Math.random() < loot.chance) {
            const cantidad = Math.floor(Math.random() * (loot.max - loot.min + 1)) + loot.min;
            jugador.inventario[loot.item] = (jugador.inventario[loot.item] || 0) + cantidad;
            itemsConseguidos.push(`${cantidad}x ${loot.item}`);
        }
    }

    if (itemsConseguidos.length > 0) {
        lootMsg = `🎁 Obtuviste: ${itemsConseguidos.join(', ')}`;
    }

    return lootMsg;
}

// ===== CURAR =====
function curar() { // ✅ FIX: Función faltante añadida
    if (jugador.inventario.pocion > 0) {
        jugador.inventario.pocion--;
        jugador.vida = Math.min(jugador.vidaMax, jugador.vida + 30);
        mensajeEl.innerHTML = '❤️ Te curaste 30 HP';
        actualizarUI();
    } else {
        mensajeEl.innerHTML = '❌ No tienes pociones';
    }
}

// ===== EQUIPAR ARMA =====
function equiparArma() { // ✅ FIX: Función faltante añadida
    if (jugador.inventario.espada > 0) {
        jugador.inventario.espada--;
        jugador.ataque += 5;
        mensajeEl.innerHTML = '⚔️ Equipaste Espada (+5 ATQ)';
        actualizarUI();
    } else {
        mensajeEl.innerHTML = '❌ No tienes espadas';
    }
}

// ===== EQUIPAR ARMADURA =====
function equiparArmadura() { // ✅ FIX: Función faltante añadida
    if (jugador.inventario.armadura > 0) {
        jugador.inventario.armadura--;
        jugador.defensa += 5;
        mensajeEl.innerHTML = '🛡️ Equipaste Armadura (+5 DEF)';
        actualizarUI();
    } else {
        mensajeEl.innerHTML = '❌ No tienes armaduras';
    }
}

// ===== EQUIPAR CASCO =====
function equiparCasco() { // ✅ FIX: Función faltante añadida
    if (jugador.inventario.casco > 0) {
        jugador.inventario.casco--;
        jugador.defensa += 3;
        mensajeEl.innerHTML = '⛑️ Equipaste Casco (+3 DEF)';
        actualizarUI();
    } else {
        mensajeEl.innerHTML = '❌ No tienes cascos';
    }
}

// ===== EQUIPAR CAMISA =====
function equiparCamisa() { // ✅ FIX: Función faltante añadida
    mensajeEl.innerHTML = '👕 No hay camisas disponibles';
}

// ===== EQUIPAR BOTAS =====
function equiparBotas() { // ✅ FIX: Función faltante añadida
    if (jugador.inventario.botas > 0) {
        jugador.inventario.botas--;
        jugador.defensa += 2;
        mensajeEl.innerHTML = '👢 Equipaste Botas (+2 DEF)';
        actualizarUI();
    } else {
        mensajeEl.innerHTML = '❌ No tienes botas';
    }
}

// ===== EQUIPAR PANTALON =====
function equiparPantalon() { // ✅ FIX: Función faltante añadida
    if (jugador.inventario.pantalon > 0) {
        jugador.inventario.pantalon--;
        jugador.defensa += 2;
        mensajeEl.innerHTML = '👖 Equipaste Pantalón (+2 DEF)';
        actualizarUI();
    } else {
        mensajeEl.innerHTML = '❌ No tienes pantalones';
    }
}

// ===== EQUIPAR ARCO =====
function equiparArco() { // ✅ FIX: Función faltante añadida
    if (jugador.inventario.arco > 0) {
        jugador.inventario.arco--;
        jugador.ataque += 8;
        mensajeEl.innerHTML = '🏹 Equipaste Arco (+8 ATQ)';
        actualizarUI();
    } else {
        mensajeEl.innerHTML = '❌ No tienes arcos';
    }
}

// ===== EQUIPAR DAGA =====
function equiparDaga() { // ✅ FIX: Función faltante añadida
    if (jugador.inventario.daga > 0) {
        jugador.inventario.daga--;
        jugador.ataque += 6;
        mensajeEl.innerHTML = '🗡️ Equipaste Daga (+6 ATQ)';
        actualizarUI();
    } else {
        mensajeEl.innerHTML = '❌ No tienes dagas';
    }
}

// ===== EQUIPAR GUANTES =====
function equiparGuantes() { // ✅ FIX: Función faltante añadida
    if (jugador.inventario.guantes > 0) {
        jugador.inventario.guantes--;
        jugador.ataque += 3;
        jugador.defensa += 1;
        mensajeEl.innerHTML = '🧤 Equipaste Guantes (+3 ATQ, +1 DEF)';
        actualizarUI();
    } else {
        mensajeEl.innerHTML = '❌ No tienes guantes';
    }
}

// ===== EQUIPAR ARMADURA ÉPICA =====
function equiparArmaduraEpica() { // ✅ FIX: Función faltante añadida
    if (jugador.inventario.armaduraEpica > 0) {
        jugador.inventario.armaduraEpica--;
        jugador.defensa += 15;
        jugador.vidaMax += 20;
        jugador.vida = Math.min(jugador.vidaMax, jugador.vida + 20);
        mensajeEl.innerHTML = '✨ Equipaste Armadura Épica (+15 DEF, +20 HP MAX)';
        actualizarUI();
    } else {
        mensajeEl.innerHTML = '❌ No tienes armaduras épicas';
    }
}

// ===== EQUIPAR CASCO ÉPICO =====
function equiparCascoEpico() { // ✅ FIX: Función faltante añadida
    if (jugador.inventario.cascoEpico > 0) {
        jugador.inventario.cascoEpico--;
        jugador.defensa += 10;
        jugador.vidaMax += 10;
        jugador.vida = Math.min(jugador.vidaMax, jugador.vida + 10);
        mensajeEl.innerHTML = '✨ Equipaste Casco Épico (+10 DEF, +10 HP MAX)';
        actualizarUI();
    } else {
        mensajeEl.innerHTML = '❌ No tienes cascos épicos';
    }
}

// ===== EQUIPAR BOTAS ÉPICAS =====
function equiparBotasEpicas() { // ✅ FIX: Función faltante añadida
    if (jugador.inventario.botasEpicas > 0) {
        jugador.inventario.botasEpicas--;
        jugador.defensa += 8;
        jugador.vidaMax += 10;
        jugador.vida = Math.min(jugador.vidaMax, jugador.vida + 10);
        mensajeEl.innerHTML = '✨ Equipaste Botas Épicas (+8 DEF, +10 HP MAX)';
        actualizarUI();
    } else {
        mensajeEl.innerHTML = '❌ No tienes botas épicas';
    }
}

// ===== EQUIPAR ESPADA LEGENDARIA =====
function equiparEspadaLegendaria() { // ✅ FIX: Función faltante añadida
    if (jugador.inventario.espadaLegendaria > 0) {
        jugador.inventario.espadaLegendaria--;
        jugador.ataque += 25;
        jugador.magia += 10;
        mensajeEl.innerHTML = '🌟 Equipaste Espada Legendaria (+25 ATQ, +10 MAG)';
        actualizarUI();
    } else {
        mensajeEl.innerHTML = '❌ No tienes espadas legendarias';
    }
}

// ===== EQUIPAR ARMADURA LEGENDARIA =====
function equiparArmaduraLegendaria() { // ✅ FIX: Función faltante añadida
    if (jugador.inventario.armaduraLegendaria > 0) {
        jugador.inventario.armaduraLegendaria--;
        jugador.defensa += 30;
        jugador.vidaMax += 50;
        jugador.vida = Math.min(jugador.vidaMax, jugador.vida + 50);
        mensajeEl.innerHTML = '🌟 Equipaste Armadura Legendaria (+30 DEF, +50 HP MAX)';
        actualizarUI();
    } else {
        mensajeEl.innerHTML = '❌ No tienes armaduras legendarias';
    }
}

// ===== APRENDER MAGIA =====
function aprenderMagia() { // ✅ FIX: Función faltante añadida
    if (jugador.inventario.magia > 0) {
        jugador.inventario.magia--;
        jugador.magia += 5;
        mensajeEl.innerHTML = '🔮 Aprendiste Magia (+5 MAG)';
        actualizarUI();
    } else {
        mensajeEl.innerHTML = '❌ No tienes pergaminos de magia';
    }
}

// ===== USAR CRISTAL =====
function usarCristal() { // ✅ FIX: Función faltante añadida
    if (jugador.inventario.cristal > 0) {
        jugador.inventario.cristal--;
        jugador.ataque += 3;
        jugador.defensa += 3;
        mensajeEl.innerHTML = '💎 Usaste Cristal (+3 ATQ, +3 DEF)';
        actualizarUI();
    } else {
        mensajeEl.innerHTML = '❌ No tienes cristales';
    }
}

// ===== USAR ORBE =====
function usarOrbe() { // ✅ FIX: Función faltante añadida
    if (jugador.inventario.orbe > 0) {
        jugador.inventario.orbe--;
        jugador.inventario.orbeUsados = (jugador.inventario.orbeUsados || 0) + 1;
        jugador.vidaMax += 15;
        jugador.vida = Math.min(jugador.vidaMax, jugador.vida + 15);
        mensajeEl.innerHTML = '🔮 Usaste Orbe (+15 HP MAX, +15 HP)';
        actualizarUI();
    } else {
        mensajeEl.innerHTML = '❌ No tienes orbes';
    }
}

// ===== BLOQUEAR/DESBLOQUEAR BOTONES =====
const todosBotones = []; // Se llenará en inicialización

function bloquearBotones() {
    todosBotones.forEach(btn => btn && (btn.disabled = true));
}

function desbloquearBotones() {
    todosBotones.forEach(btn => btn && (btn.disabled = false));
}

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", () => {
    // ✅ FIX: Inicializar referencias DOM de forma segura
    gameArea = document.getElementById("gameArea");
    vidaJugadorFill = document.getElementById("vidaJugadorFill");
    ataqueJugadorEl = document.getElementById("ataqueJugador");
    defensaJugadorEl = document.getElementById("defensaJugador");
    magiaJugadorEl = document.getElementById("magiaJugador");
    nivelJugadorEl = document.getElementById("nivelJugador");
    puntajeEl = document.getElementById("puntaje");
    listaInventarioEl = document.getElementById("listaInventario");
    mensajeEl = document.getElementById("mensaje");
    escenario = document.getElementById("escenario");
    atacarBtn = document.getElementById("atacarBtn");
    curarBtn = document.getElementById("curarBtn");
    aprenderMagiaBtn = document.getElementById("aprenderMagiaBtn");
    equiparArmaBtn = document.getElementById("equiparArmaBtn");
    equiparArmaduraBtn = document.getElementById("equiparArmaduraBtn");
    equiparCascoBtn = document.getElementById("equiparCascoBtn");
    equiparCamisaBtn = document.getElementById("equiparCamisaBtn");
    equiparBotasBtn = document.getElementById("equiparBotasBtn");
    equiparPantalonBtn = document.getElementById("equiparPantalonBtn");
    equiparArcoBtn = document.getElementById("equiparArcoBtn");
    equiparDagaBtn = document.getElementById("equiparDagaBtn");
    equiparGuantesBtn = document.getElementById("equiparGuantesBtn");
    equiparArmaduraEpicaBtn = document.getElementById("equiparArmaduraEpicaBtn");
    equiparCascoEpicoBtn = document.getElementById("equiparCascoEpicoBtn");
    equiparBotasEpicasBtn = document.getElementById("equiparBotasEpicasBtn");
    equiparEspadaLegendariaBtn = document.getElementById("equiparEspadaLegendariaBtn");
    equiparArmaduraLegendariaBtn = document.getElementById("equiparArmaduraLegendariaBtn");
    usarCristalBtn = document.getElementById("usarCristalBtn");
    usarOrbeBtn = document.getElementById("usarOrbeBtn");
    abrirInventarioBtn = document.getElementById("abrirInventarioBtn");
    ventanaInventario = document.getElementById("ventanaInventario");
    cerrarInventario = document.getElementById("cerrarInventario");

    // Crear jugador visual
    jugadorDiv = document.createElement("div");
    jugadorDiv.id = "jugador";
    jugadorDiv.style.position = "absolute";
    jugadorDiv.style.left = "100px";
    jugadorDiv.style.top = "300px";
    if (gameArea) gameArea.appendChild(jugadorDiv);

    // Llenar array de botones
    todosBotones.push(
        atacarBtn, curarBtn, equiparArmaBtn, equiparArmaduraBtn,
        aprenderMagiaBtn, usarCristalBtn, usarOrbeBtn,
        equiparEspadaLegendariaBtn, equiparArmaduraEpicaBtn,
        equiparArmaduraLegendariaBtn, equiparCascoBtn, equiparCamisaBtn,
        equiparGuantesBtn, equiparPantalonBtn, equiparBotasBtn,
        equiparCascoEpicoBtn, equiparBotasEpicasBtn, equiparArcoBtn, equiparDagaBtn
    );

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
    // 🔵 RAROS
    // =========================
    equiparArcoBtn?.addEventListener("click", equiparArco);
    equiparDagaBtn?.addEventListener("click", equiparDaga);

    // =========================
    // 🎒 INVENTARIO
    // =========================
    abrirInventarioBtn?.addEventListener("click", () => {
        if (ventanaInventario) ventanaInventario.style.display = "block";
    });

    cerrarInventario?.addEventListener("click", () => {
        if (ventanaInventario) ventanaInventario.style.display = "none";
    });

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
                e.preventDefault();
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

    // Iniciar game loop
    gameLoopActivo = true;
    moverEnemigos();

    // Generar primer nivel
    generarNivel();
});
