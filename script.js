
function configurarModo() {
    const boton = document.getElementById("modoBtn");

    function aplicarModo(modo) {
        document.body.classList.toggle(
            "modo-oscuro",
            modo === "oscuro"
        );

        if (boton) {
            boton.textContent =
                modo === "oscuro" ? " Claro" : " Oscuro";
        }
    }

    let modoGuardado = "claro";

    try {
        modoGuardado = localStorage.getItem("modo") || "claro";
    } catch (error) {
        console.warn("No se pudo guardar la preferencia del tema.");
    }

    aplicarModo(modoGuardado);

    if (boton && !boton.dataset.modoConfigurado) {
        boton.dataset.modoConfigurado = "si";

        boton.addEventListener("click", function () {
            const nuevoModo =
                document.body.classList.contains("modo-oscuro")
                    ? "claro"
                    : "oscuro";

            aplicarModo(nuevoModo);

            try {
                localStorage.setItem("modo", nuevoModo);
            } catch (error) {
                console.warn("No se pudo guardar el tema.");
            }
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", configurarModo);
} else {
    configurarModo();
}

const formularioContacto = document.getElementById("formContacto");

if (formularioContacto) {
    formularioContacto.addEventListener("submit", async function (e) {
        e.preventDefault();

        const boton = document.getElementById("enviarContacto");
        const estado = document.getElementById("estadoFormulario");

        boton.disabled = true;
        estado.textContent = "Enviando mensaje...";

        try {
            const respuesta = await fetch("/api/contacto", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: document.getElementById("nombre").value,
                    correo: document.getElementById("correo").value,
                    motivo: document.getElementById("motivo").value,
                    mensaje: document.getElementById("mensajeContacto").value
                })
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(resultado.mensaje || "No se pudo enviar.");
            }

            estado.textContent = resultado.mensaje;
            formularioContacto.reset();
        } catch (error) {
            estado.textContent = error.message ||
                "No se pudo conectar con el servidor.";
        } finally {
            boton.disabled = false;
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // 1. MODO OSCURO Y CLARO
    // =========================
    const modoBtn = document.getElementById("modoBtn");

    function aplicarModo(modo) {
        document.body.classList.toggle(
            "modo-oscuro",
            modo === "oscuro"
        );

        if (modoBtn) {
            modoBtn.textContent =
                modo === "oscuro" ? "☀️ Claro" : "🌙 Oscuro";
        }
    }

    let modoGuardado = "claro";

    try {
        modoGuardado = localStorage.getItem("modo") || "claro";
    } catch (error) {
        console.warn("No se pudo recuperar el tema guardado.");
    }

    aplicarModo(modoGuardado);

    if (modoBtn) {
        modoBtn.addEventListener("click", function () {
            const nuevoModo =
                document.body.classList.contains("modo-oscuro")
                    ? "claro"
                    : "oscuro";

            aplicarModo(nuevoModo);

            try {
                localStorage.setItem("modo", nuevoModo);
            } catch (error) {
                console.warn("No se pudo guardar el tema.");
            }
        });
    }


    // =========================
    // 2. ANIMACIONES DE ENTRADA
    // =========================
    const elementos = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visible");
                    observador.unobserve(entrada.target);
                }
            });
        }, {
            threshold: 0.1
        });

        elementos.forEach(function (elemento) {
            observador.observe(elemento);
        });
    } else {
        elementos.forEach(function (elemento) {
            elemento.classList.add("visible");
        });
    }


    // =========================
    // 3. FORMULARIO DE CONTACTO
    // =========================
    const formulario = document.getElementById("formContacto");

    if (formulario) {
        formulario.addEventListener("submit", async function (evento) {
            evento.preventDefault();

            const boton = document.getElementById("enviarContacto");
            const estado = document.getElementById("estadoFormulario");

            const nombre = document.getElementById("nombre").value.trim();
            const correo = document.getElementById("correo").value.trim();
            const motivo = document.getElementById("motivo").value;
            const mensaje = document.getElementById("mensajeContacto").value.trim();

            if (!nombre || !correo || !motivo || !mensaje) {
                estado.textContent = "Completa todos los campos.";
                return;
            }

            boton.disabled = true;
            estado.textContent = "Enviando mensaje...";

            try {
                const respuesta = await fetch("/api/contacto", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nombre: nombre,
                        correo: correo,
                        motivo: motivo,
                        mensaje: mensaje
                    })
                });

                const resultado = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(
                        resultado.mensaje || "No se pudo enviar el mensaje."
                    );
                }

                estado.textContent = "✅ ¡Mensaje enviado correctamente!";
                formulario.reset();

            } catch (error) {
                console.error("Error de contacto:", error);

                estado.textContent =
                    error.message ||
                    "❌ Error al enviar. Comprueba que el servidor esté activo.";
            } finally {
                boton.disabled = false;
            }
        });
    }


    // =========================
    // 4. EVALUACIÓN INTERACTIVA
    // =========================
    const botonEvaluar = document.getElementById("evaluarBtn");

    if (botonEvaluar) {
        botonEvaluar.addEventListener("click", function () {
            const respuestas = document.querySelectorAll(
                'input[type="radio"]:checked'
            );

            const preguntas = document.querySelectorAll("[data-pregunta]");
            const resultado = document.getElementById("resultado");

            if (!resultado || preguntas.length === 0) {
                return;
            }

            if (respuestas.length < preguntas.length) {
                resultado.textContent =
                    "Responde todas las preguntas antes de evaluar.";
                return;
            }

            let puntos = 0;

            respuestas.forEach(function (respuesta) {
                if (respuesta.dataset.correcta === "true") {
                    puntos++;
                }
            });

            resultado.textContent =
                "Tu resultado: " + puntos + " de " +
                preguntas.length + " respuestas correctas.";
        });
    }

});

/* ========================================
   CAMBIAR IDIOMA ESPAÑOL / INGLÉS
======================================== */

const traducciones = {
    "es": {
        "Inicio": "Inicio",
        "Producto": "Producto",
        "JavaScript": "JavaScript",
        "jQuery": "jQuery",
        "JSON": "JSON",
        "Hosting": "Hosting",
        "Dominios": "Dominios",
        "Evaluación": "Evaluación",
        "Aprende tecnología de una forma diferente.": "Aprende tecnología de una forma diferente.",
        "PROYECTO EDUCATIVO": "PROYECTO EDUCATIVO",
        "Conocer NEXUS X": "Conocer NEXUS X",
        "Probar evaluación": "Probar evaluación",
        "Aprende": "Aprende",
        "Programa": "Programa",
        "Explora": "Explora",
        "¿QUÉ ES?": "¿QUÉ ES?",
        "Una idea pensada para estudiantes que quieren aprender tecnología.": "Una idea pensada para estudiantes que quieren aprender tecnología.",
        "Aprendizaje": "Aprendizaje",
        "Práctica": "Práctica",
        "Innovación": "Innovación",
        "🌙 Oscuro": "🌙 Oscuro",
        "☀️ Claro": "☀️ Claro"
    },

    "en": {
        "Inicio": "Home",
        "Producto": "Product",
        "JavaScript": "JavaScript",
        "jQuery": "jQuery",
        "JSON": "JSON",
        "Hosting": "Hosting",
        "Dominios": "Domains",
        "Evaluación": "Quiz",
        "Aprende tecnología de una forma diferente.": "Learn technology in a different way.",
        "PROYECTO EDUCATIVO": "EDUCATIONAL PROJECT",
        "Conocer NEXUS X": "Discover NEXUS X",
        "Probar evaluación": "Take the quiz",
        "Aprende": "Learn",
        "Programa": "Code",
        "Explora": "Explore",
        "¿QUÉ ES?": "WHAT IS IT?",
        "Una idea pensada para estudiantes que quieren aprender tecnología.": "An idea for students who want to learn technology.",
        "Aprendizaje": "Learning",
        "Práctica": "Practice",
        "Innovación": "Innovation",
        "🌙 Oscuro": "🌙 Dark",
        "☀️ Claro": "☀️ Light"
    }
};

function configurarIdioma() {
    const boton = document.getElementById("idiomaBtn");

    if (!boton) return;

    // Guardamos el texto original de cada elemento
    const elementos = document.querySelectorAll(
        "a, h1, h2, h3, h4, h5, p, span, button"
    );

    elementos.forEach(function (elemento) {
        if (elemento.id === "idiomaBtn") return;

        if (!elemento.hasAttribute("data-texto-es")) {
            elemento.setAttribute(
                "data-texto-es",
                elemento.textContent.trim()
            );
        }
    });

    function cambiarIdioma(idioma) {
        elementos.forEach(function (elemento) {
            if (elemento.id === "idiomaBtn") return;

            const original = elemento.getAttribute("data-texto-es");

            if (original && traducciones[idioma][original]) {
                elemento.textContent = traducciones[idioma][original];
            } else if (original) {
                elemento.textContent = original;
            }
        });

        document.documentElement.lang = idioma;
        boton.textContent = idioma === "es"
            ? "🇺🇸 English"
            : "🇸🇻 Español";

        try {
            localStorage.setItem("idiomaNexus", idioma);
        } catch (error) {
            console.warn("No se pudo guardar el idioma.");
        }
    }

    let idiomaGuardado = "es";

    try {
        idiomaGuardado = localStorage.getItem("idiomaNexus") || "es";
    } catch (error) {
        console.warn("No se pudo recuperar el idioma.");
    }

    cambiarIdioma(idiomaGuardado);

    boton.addEventListener("click", function () {
        const idiomaActual = document.documentElement.lang;
        cambiarIdioma(idiomaActual === "es" ? "en" : "es");
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", configurarIdioma);
} else {
    configurarIdioma();
}