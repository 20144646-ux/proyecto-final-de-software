
$(document).ready(function () {
  const $body = $("body");
  let idiomaActual = localStorage.getItem("idiomaVOLTIX") || "es";
  let productosVOLTIX = [];

  // AÑO ACTUAL
  $("#anioActual").text(new Date().getFullYear());

  // ==========================
  // MODO OSCURO Y CLARO
  // ==========================
  function actualizarBotonModo() {
    const oscuro = $body.hasClass("modo-oscuro");

    $("#modoBtn").html(
      oscuro
        ? '<i class="bi bi-sun"></i> <span data-es="Claro" data-en="Light">Claro</span>'
        : '<i class="bi bi-moon-stars"></i> <span data-es="Oscuro" data-en="Dark">Oscuro</span>'
    );

    aplicarIdioma();
  }

  if (localStorage.getItem("modo") === "oscuro") {
    $body.addClass("modo-oscuro");
  }

  actualizarBotonModo();

  $("#modoBtn").on("click", function () {
    $body.toggleClass("modo-oscuro");

    localStorage.setItem(
      "modo",
      $body.hasClass("modo-oscuro") ? "oscuro" : "claro"
    );

    actualizarBotonModo();
  });

  // ==========================
  // TRADUCTOR ESPAÑOL / INGLÉS
  // ==========================
  function aplicarIdioma() {
    $("[data-es][data-en]").each(function () {
      const texto = $(this).attr("data-" + idiomaActual);

      if (texto !== undefined) {
        $(this).text(texto);
      }
    });

    $("[data-placeholder-es][data-placeholder-en]").each(function () {
      const placeholder = $(this).attr(
        "data-placeholder-" + idiomaActual
      );

      if (placeholder !== undefined) {
        $(this).attr("placeholder", placeholder);
      }
    });

    $("#idiomaBtn").text(idiomaActual === "es" ? "EN" : "ES");
    $("html").attr("lang", idiomaActual);

    // Actualizar productos para el idioma seleccionado
    mostrarProductos();
  }

  $("#idiomaBtn").on("click", function () {
    idiomaActual = idiomaActual === "es" ? "en" : "es";
    localStorage.setItem("idiomaVOLTIX", idiomaActual);
    aplicarIdioma();
  });

  // ==========================
  // CARGAR PRODUCTOS DESDE JSON
  // ==========================
  function cargarProductos() {
    $.getJSON("datos.json")
      .done(function (datos) {
        if (!datos || !Array.isArray(datos.productos)) {
          mostrarErrorProductos();
          return;
        }

        productosVOLTIX = datos.productos;
        mostrarProductos();
      })
      .fail(function () {
        mostrarErrorProductos();
      });
  }

  function mostrarErrorProductos() {
    $("#productosInicio").html("");
    $("#errorProductos").removeClass("d-none");
  }

  // ==========================
  // MOSTRAR PRODUCTOS
  // ==========================
  function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, function (caracter) {
      const entidades = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };

      return entidades[caracter];
    });
  }

  function mostrarProductos() {
    const $contenedor = $("#productosInicio");

    if (!$contenedor.length || !productosVOLTIX.length) {
      return;
    }

    $contenedor.empty();
    $("#errorProductos").addClass("d-none");

    const productosDestacados = productosVOLTIX.slice(0, 3);

    productosDestacados.forEach(function (producto) {
      const nombre = escaparHTML(producto.nombre);
      const descripcion = escaparHTML(producto.descripcion);
      const categoria = escaparHTML(producto.categoria || "Tecnología");
      const imagen = escaparHTML(producto.imagen);
      const precio = Number(producto.precio);

      const precioTexto = Number.isFinite(precio)
        ? "$" + precio.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        : "Consultar precio";

      const textoBoton =
        idiomaActual === "es" ? "Ver producto" : "View product";

      const textoAlternativo =
        idiomaActual === "es" ? "Imagen de " : "Image of ";

      const tarjeta = `
        <div class="col-sm-6 col-lg-4">
          <article class="product-card h-100">
            <img
              src="${imagen}"
              alt="${textoAlternativo}${nombre}"
              loading="lazy"
              onerror="this.onerror=null;this.src='https://placehold.co/600x400/f0ebe5/292929?text=VOLTIX+Product'">

            <div class="card-body">
              <span class="product-category">${categoria}</span>
              <h3 class="card-title">${nombre}</h3>
              <p class="card-text">${descripcion}</p>
              <p class="price">${precioTexto}</p>
              <a href="producto.html" class="btn btn-outline-primary w-100">
                ${textoBoton}
              </a>
            </div>
          </article>
        </div>
      `;

      $contenedor.append(tarjeta);
    });
  }

  // ==========================
  // FORMULARIO DE CONTACTO
  // ==========================
  $("#contactoForm").on("submit", function (evento) {
    evento.preventDefault();

    const nombre = $("#nombreContacto").val().trim();
    const correo = $("#correoContacto").val().trim();
    const mensaje = $("#mensajeContacto").val().trim();

    if (!nombre || !correo || !mensaje) {
      mostrarEstadoContacto(
        idiomaActual === "es"
          ? "Completa todos los campos."
          : "Please complete all fields."
      );
      return;
    }

    const asunto = encodeURIComponent("Mensaje para VOLTIX");
    const cuerpo = encodeURIComponent(
      "Nombre: " + nombre +
      "\nCorreo: " + correo +
      "\n\nMensaje:\n" + mensaje
    );

    const enlaceCorreo =
      "mailto:?subject=" + asunto + "&body=" + cuerpo;

    mostrarEstadoContacto(
      idiomaActual === "es"
        ? "Se abrirá tu aplicación de correo para preparar el mensaje. Debes elegir el destinatario y enviarlo."
        : "Your email app will open to prepare the message. Choose a recipient and send it."
    );

    window.location.href = enlaceCorreo;
  });

  function mostrarEstadoContacto(mensaje) {
    $("#contactoEstado").text(mensaje);
  }

  // ==========================
  // INICIAR
  // ==========================
  cargarProductos();
  aplicarIdioma();
});
