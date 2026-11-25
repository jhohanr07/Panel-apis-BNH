// ==========================================
// 1. PARÁMETROS AJUSTABLES
// ==========================================

// Cambia esta clave por la que desees usar para el panel gerencial
const CLAVE_GERENCIAL = "BNH2026$$";

// Paleta inicial basada en el logo BNH Medical:
// "bnh-medical" | "clinico-claro" | "ejecutivo-oscuro"
const PALETA_INICIAL = "bnh-medical";

// APIs visibles para todos los usuarios (sin clave)
const APIS_USUARIOS = [
  {
    nombre: "Reporte de pago",
    descripcion: "Reportar pagos de clientes BNH o VIVA.",
    url: "https://bnhrpagos.vercel.app/"
  },
  {
    nombre: "Calculadora-Cotizacion",
    descripcion: "Calculos para indicar precios a clientes",
    url: "https://bnhrpagos.vercel.app/"
  },
  {
    nombre: "Reporte de pago",
    descripcion: "Reportar pagos de clientes BNH o VIVA.",
    url: "https://cotizav1.vercel.app/"
  },
  {
    nombre: "Reporte Servicio tecnico",
    descripcion: "Reportar incidencia de clientes",
    url: "https://serviciotbnh.vercel.app/"
  },
  {
    nombre: "Solicitud de viaticos",
    descripcion: "Solicitud de viaticos para eventos",
    url: "https://script.google.com/a/macros/bnhmedical.com/s/AKfycbyESOEB1yyA9ierOc4DcM0PDu_PfWpPlCxM482_HxAJSoGda0FfZuT_qJ32rif7ylkt/exec"
  },
  {
    nombre: "Solicitud de pagos",
    descripcion: "Solicitar pagos internos a tesoreria o externos",
    url: "https://script.google.com/a/macros/bnhmedical.com/s/AKfycby3Gj6Q4dAq5Yz2kHGbhX9rxRPJ4s1ljKGcLdwiVIusStRft3lb8GvcOmLL6sDy8pNd/exec"
  },
  {
    nombre: "Bitacora de vehiculos",
    descripcion: "Reportar mantenimientos a los vehiculos",
    url: "https://script.google.com/a/macros/bnhmedical.com/s/AKfycbxWP-qrJC4xepfH6YxCfxeIxHLOkp8vgM-p-uYxLtq0zla3p0djKYlCSdB52jkf2uP3aw/exec"
  }
];

// APIs visibles solo al validar la clave gerencial
const APIS_GERENCIALES = [
  {
    nombre: "Inteligencia Comercial & Control de Metas",
    descripcion: "reporte de las ventas Vs meta.",
    url: "https://script.google.com/a/macros/bnhmedical.com/s/AKfycbzYlHfqnZObnC36ClnvijDIqKfzwFlgx6vARECpeWxhuZrXi_jSyc38JkTz4u_zKvNtSg/exec"
  },
   {
    nombre: "Panel de cxc VIVA",
    descripcion: "Reporte de cobranzas VIVA.",
    url: "https://script.google.com/a/macros/bnhmedical.com/s/AKfycbzpgsnEVYc8FhWi7sbErT0HzppV0D_oPOfcmW7op-5m5LRNG13eaYvVpURW4EYLNag5/exec"
  },
   {
    nombre: "Panel de reporte de pago",
    descripcion: "Resumen del flujo de efectivo entrante.",
    url: "https://bnhrpagos.vercel.app/admin"
  },
   {
    nombre: "Panel de servicio tecnico",
    descripcion: "Reporte de insidencia y respuesta de los tecnicos.",
    url: "https://serviciotbnh.vercel.app/dashboard"
  },
  {
    nombre: "API de Control de Accesos",
    descripcion: "Gestión de permisos y auditoría interna.",
    url: "https://api.ejemplo.com/gerencia/v1/accesos"
  }
];

// ==========================================
// 2. REFERENCIAS DEL DOM Y FUNCIONES
// ==========================================

const listaUsuariosEl = document.getElementById("lista-usuarios");
const listaGerencialEl = document.getElementById("lista-gerencial");
const bloqueLoginEl = document.getElementById("bloque-login");
const contenidoGerencialEl = document.getElementById("contenido-gerencial");
const inputClaveEl = document.getElementById("input-clave");
const btnDesbloquearEl = document.getElementById("btn-desbloquear");
const btnBloquearEl = document.getElementById("btn-bloquear");
const mensajeErrorEl = document.getElementById("mensaje-error");
const selectPaletaEl = document.getElementById("select-paleta");

/**
 * Aplica la paleta de colores seleccionada mediante el atributo data-paleta en <html>.
 * @param {string} nombrePaleta
 */
function aplicarPaleta(nombrePaleta) {
  document.documentElement.setAttribute("data-paleta", nombrePaleta);
  if (selectPaletaEl && selectPaletaEl.value !== nombrePaleta) {
    selectPaletaEl.value = nombrePaleta;
  }
}

/**
 * Dibuja las tarjetas de APIs dentro del contenedor indicado.
 * @param {Array<{nombre: string, descripcion: string, url: string}>} apis
 * @param {HTMLElement} contenedor
 */
function renderizarApis(apis, contenedor) {
  contenedor.innerHTML = "";

  apis.forEach((api) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-api";

    const titulo = document.createElement("h3");
    titulo.textContent = api.nombre;

    const descripcion = document.createElement("p");
    descripcion.textContent = api.descripcion;

    const enlace = document.createElement("a");
    enlace.href = api.url;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.textContent = api.url;

    tarjeta.appendChild(titulo);
    tarjeta.appendChild(descripcion);
    tarjeta.appendChild(enlace);
    contenedor.appendChild(tarjeta);
  });
}

/**
 * Valida la clave ingresada y muestra el panel gerencial si coincide.
 */
function desbloquearPanelGerencial() {
  const claveIngresada = inputClaveEl.value.trim();

  if (claveIngresada === CLAVE_GERENCIAL) {
    mensajeErrorEl.textContent = "";
    renderizarApis(APIS_GERENCIALES, listaGerencialEl);
    bloqueLoginEl.classList.add("oculto");
    contenidoGerencialEl.classList.remove("oculto");
    inputClaveEl.value = "";
  } else {
    mensajeErrorEl.textContent = "Clave incorrecta. Inténtalo de nuevo.";
  }
}

/**
 * Oculta el panel gerencial y limpia las tarjetas del DOM.
 */
function bloquearPanelGerencial() {
  listaGerencialEl.innerHTML = "";
  contenidoGerencialEl.classList.add("oculto");
  bloqueLoginEl.classList.remove("oculto");
}

// Inicialización de paleta y APIs para usuarios normales
aplicarPaleta(PALETA_INICIAL);
renderizarApis(APIS_USUARIOS, listaUsuariosEl);

// Eventos de usuario
if (selectPaletaEl) {
  selectPaletaEl.addEventListener("change", (event) => {
    aplicarPaleta(event.target.value);
  });
}
btnDesbloquearEl.addEventListener("click", desbloquearPanelGerencial);
inputClaveEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    desbloquearPanelGerencial();
  }
});
btnBloquearEl.addEventListener("click", bloquearPanelGerencial);
