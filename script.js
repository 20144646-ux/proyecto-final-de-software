// =====================================
// NEXUS X - JAVASCRIPT
// =====================================


// FUNCIÓN PARA LA PÁGINA JAVASCRIPT

function cambiarMensaje() {

    const mensaje = document.getElementById("mensaje");

    mensaje.innerHTML = "¡JavaScript está funcionando correctamente! 🚀";

    mensaje.style.color = "#38BDF8";

}


// =====================================
// FUNCIÓN PARA LA AUTOEVALUACIÓN
// =====================================

function calcularQuiz() {

    let puntos = 0;

    const respuestas = document.querySelectorAll(
        "#quiz input:checked"
    );

    respuestas.forEach(function(respuesta) {

        if (respuesta.value === "correcto") {

            puntos++;

        }

    });


    let resultado = document.getElementById("resultado");


    if (puntos === 5) {

        resultado.innerHTML =
            "🏆 ¡Excelente! Obtuviste 5/5.";

    }

    else if (puntos >= 3) {

        resultado.innerHTML =
            "👍 ¡Muy bien! Obtuviste " + puntos + "/5.";

    }

    else {

        resultado.innerHTML =
            "📚 Sigue estudiando. Obtuviste " + puntos + "/5.";

    }

}