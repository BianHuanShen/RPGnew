// ===============================
// RENDER SYSTEM - ESCENARIO
// ===============================

(function () {
    console.log("🎨 Render System cargado");

    const escenario = document.getElementById("escenario");
    if (!escenario) {
        console.warn("⚠️ No existe #escenario en el HTML");
        return;
    }

    // Configuración
    const rutasEscenarios = ["img/escenario1.jpeg", "img/escenario2.jpeg", "img/escenario3.jpeg", "img/escenario4.jpeg", "img/escenario5.jpeg", "img/escenario6.jpeg", "img/escenario7.jpeg", "img/escenario8.jpeg", "img/escenario9.jpeg", "img/escenario10.jpeg"];
    const personajeRuta = "img/jugador.jpeg";

    // Cambiar fondo según nivel
    function cambiarEscenario() {
        if (typeof nivelActual === "undefined") return;

        const index = (nivelActual - 1) % rutasEscenarios.length;
        const rutaFinal = rutasEscenarios[index] || rutasEscenarios[0];

        const img = new Image();
        img.src = rutaFinal;

        img.onload = () => {
            escenario.style.backgroundImage = `url('${rutaFinal}')`;
            escenario.style.backgroundSize = "cover";
            escenario.style.backgroundPosition = "center";
            console.log("✅ Escenario cargado:", rutaFinal);
        };

        img.onerror = () => {
            console.error("❌ Error cargando escenario:", rutaFinal);
            // Fallback a color sólido
            escenario.style.background = "linear-gradient(135deg, #1a1a2e, #16213e)";
        };
    }

    // ===============================
    // 🧍 PERSONAJE
    // ===============================
    function aplicarPersonaje() {
        const jugador = document.getElementById("jugador");

        if (!jugador) return;

        const img = new Image();
        img.src = personajeRuta;

        img.onload = () => {
            jugador.style.backgroundImage = `url('${personajeRuta}')`;
            jugador.style.backgroundSize = "contain";
            jugador.style.backgroundRepeat = "no-repeat";
            jugador.style.backgroundPosition = "center";
            jugador.style.backgroundColor = "transparent";
        };

        img.onerror = () => {
            console.error("❌ Error personaje:", personajeRuta);
        };
    }

    // Interceptar generarNivel para cambiar escenario
    const originalGenerarNivel = window.generarNivel;
    window.generarNivel = function () {
        if (originalGenerarNivel) originalGenerarNivel();
        cambiarEscenario();
        setTimeout(aplicarPersonaje, 50);
    };

    // Inicializar al cargar
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            cambiarEscenario();
            aplicarPersonaje();
        }, 100);
    });

})();