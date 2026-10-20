
document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // 1. MODO CLARO Y OSCURO
    // =====================================

    const modoBtn = document.getElementById("modoBtn");

    function aplicarModo(modo) {
        const oscuro = modo === "oscuro";
        document.body.classList.toggle("modo-oscuro", oscuro);

        if (modoBtn) {
            modoBtn.textContent = oscuro ? " Claro" : " Oscuro";
        }

        try {
            localStorage.setItem("modo", modo);
        } catch (error) {
            console.warn("No se pudo guardar el modo.");
        }
    }

    let modoInicial = "claro";

    try {
        modoInicial = localStorage.getItem("modo") || "claro";
    } catch (error) {
        console.warn("No se pudo recuperar el modo.");
    }

    aplicarModo(modoInicial);

    if (modoBtn) {
        modoBtn.addEventListener("click", function () {
            aplicarModo(
                document.body.classList.contains("modo-oscuro")
                    ? "claro"
                    : "oscuro"
            );
        });
    }

    // =====================================
    // 2. ANIMACIONES SUAVES
    // =====================================

    const elementos = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visible");
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.1 });

        elementos.forEach(function (elemento) {
            observador.observe(elemento);
        });
    } else {
        elementos.forEach(function (elemento) {
            elemento.classList.add("visible");
        });
    }

    // =====================================
    // 3. FORMULARIO DE CONTACTO
    // =====================================

    const formulario = document.getElementById("formContacto");

    if (formulario) {
        formulario.addEventListener("submit", async function (evento) {
            evento.preventDefault();

            const boton = document.getElementById("enviarContacto");
            const estado = document.getElementById("estadoFormulario");

            const nombre = document.getElementById("nombre")?.value.trim() || "";
            const correo = document.getElementById("correo")?.value.trim() || "";
            const motivo = document.getElementById("motivo")?.value || "";
            const mensaje = document.getElementById("mensajeContacto")?.value.trim() || "";

            if (!estado || !boton) return;

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
                        nombre,
                        correo,
                        motivo,
                        mensaje
                    })
                });

                const resultado = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(
                        resultado.mensaje || "No se pudo enviar el mensaje."
                    );
                }

                estado.textContent = "✅ ¡Enviado correctamente!";
                formulario.reset();

            } catch (error) {
                console.error("Error al enviar el formulario:", error);
                estado.textContent =
                    error.message ||
                    "No se pudo enviar. Comprueba que el servidor esté funcionando.";
            } finally {
                boton.disabled = false;
            }
        });
    }

    // =====================================
    // 4. EVALUACIÓN INTERACTIVA
    // =====================================

    const evaluarBtn = document.getElementById("evaluarBtn");

    if (evaluarBtn) {
        evaluarBtn.addEventListener("click", function () {
            const preguntas = document.querySelectorAll("[data-pregunta]");
            const resultado = document.getElementById("resultado");

            if (!resultado || preguntas.length === 0) return;

            let puntos = 0;
            let contestadas = 0;

            preguntas.forEach(function (pregunta) {
                const respuesta = pregunta.querySelector(
                    'input[type="radio"]:checked'
                );

                if (respuesta) {
                    contestadas++;

                    if (respuesta.dataset.correcta === "true") {
                        puntos++;
                    }
                }
            });

            if (contestadas < preguntas.length) {
                resultado.textContent =
                    "Responde todas las preguntas antes de evaluar.";
                return;
            }

            resultado.textContent =
                "Tu resultado: " + puntos + " de " +
                preguntas.length + " respuestas correctas.";
        });
    }

    // =====================================
    // 5. TRADUCTOR ESPAÑOL - INGLÉS
    // =====================================

    const idiomaBtn = document.getElementById("idiomaBtn");

    const traducciones = {
        etiqueta: {
            es: "TECNOLOGÍA PARA EL FUTURO",
            en: "TECHNOLOGY FOR THE FUTURE"
        },
        titulo: {
            es: "CREA EL FUTURO DIGITAL",
            en: "CREATE THE DIGITAL FUTURE"
        },
        descripcion: {
            es: "Descubre herramientas y tecnologías para crear experiencias digitales increíbles.",
            en: "Discover tools and technologies to create amazing digital experiences."
        },
        conocer: {
            es: "CONOCER MÁS",
            en: "LEARN MORE"
        },
        evaluacion: {
            es: "Evaluación interactiva",
            en: "Interactive quiz"
        },
        aprende: {
            es: "Aprende sobre desarrollo web",
            en: "Learn about web development"
        },
        futuro: {
            es: "El futuro comienza aquí",
            en: "The future starts here"
        },
        programa: {
            es: "Programa, crea e innova",
            en: "Code, create and innovate"
        },
        tecnologias: {
            es: "Tecnologías web",
            en: "Web technologies"
        },
        explora: {
            es: "Explora nuestras tecnologías",
            en: "Explore our technologies"
        },
        herramientas: {
            es: "Herramientas digitales",
            en: "Digital tools"
        },
        queEs: {
            es: "¿Qué es?",
            en: "What is it?"
        },
        idea: {
            es: "Aprende algo nuevo",
            en: "Learn something new"
        },
        aprendizaje: {
            es: "Aprendizaje",
            en: "Learning"
        },
        infoAprendizaje: {
            es: "Aprende paso a paso con nuestros recursos.",
            en: "Learn step by step with our resources."
        },
        practica: {
            es: "Practica tus conocimientos",
            en: "Practice your knowledge"
        },
        infoPractica: {
            es: "Pon a prueba lo que has aprendido.",
            en: "Test what you have learned."
        },
        innovacion: {
            es: "Innovación digital",
            en: "Digital innovation"
        },
        infoInnovacion: {
            es: "Descubre nuevas formas de usar la tecnología.",
            en: "Discover new ways to use technology."
        },
        pie: {
            es: "Todos los derechos reservados.",
            en: "All rights reserved."
        }
    };

    let idiomaActual = "es";

    try {
        idiomaActual = localStorage.getItem("idiomaNexus") || "es";
    } catch (error) {
        console.warn("No se pudo recuperar el idioma.");
    }

    function cambiarIdioma(idioma) {
        if (!traducciones || !["es", "en"].includes(idioma)) {
            return;
        }

        idiomaActual = idioma;

        try {
            localStorage.setItem("idiomaNexus", idioma);
        } catch (error) {
            console.warn("No se pudo guardar el idioma.");
        }

        document.querySelectorAll("[data-i18n]").forEach(function (elemento) {
            const clave = elemento.dataset.i18n;
            const traduccion = traducciones[clave];

            if (traduccion && traduccion[idioma] !== undefined) {
                elemento.textContent = traduccion[idioma];
            }
        });

        document.documentElement.lang = idioma;

        if (idiomaBtn) {
            idiomaBtn.textContent =
                idioma === "es" ? "🌐 English" : "🌐 Español";
        }
    }

    if (idiomaBtn) {
        idiomaBtn.addEventListener("click", function () {
            cambiarIdioma(idiomaActual === "es" ? "en" : "es");
        });
    }

    cambiarIdioma(idiomaActual);

});