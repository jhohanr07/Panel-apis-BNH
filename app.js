// ==========================================
// 1. PARÁMETROS AJUSTABLES
// ==========================================

// Clave configurada para desbloquear el panel gerencial
const CLAVE_GERENCIAL = "BNH2026$$";

// Paleta inicial basada en el logo BNH Medical:
// "bnh-medical" | "clinico-claro" | "ejecutivo-oscuro"
const PALETA_INICIAL = "bnh-medical";

// APIs visibles para todos los usuarios (sin clave)
const APIS_USUARIOS = [
  {
    nombre: "Reporte de pago",
    tipo: "Portal",
    descripcion: "Reportar pagos de clientes BNH o VIVA.",
    url: "https://bnhrpagos.vercel.app/"
  },
  {
    nombre: "Calculadora-Cotizacion",
    tipo: "Herramienta",
    descripcion: "Calculos para indicar precios a clientes",
    url: "https://cotizav1.vercel.app/"
  },
 
  {
    nombre: "Reporte Servicio tecnico",
    tipo: "Soporte",
    descripcion: "Reportar incidencia de clientes",
    url: "https://serviciotbnh.vercel.app/"
  },
  {
    nombre: "Solicitud de viaticos",
    tipo: "Apps Script",
    descripcion: "Solicitud de viaticos para eventos",
    url: "https://script.google.com/a/macros/bnhmedical.com/s/AKfycbyESOEB1yyA9ierOc4DcM0PDu_PfWpPlCxM482_HxAJSoGda0FfZuT_qJ32rif7ylkt/exec"
  },
  {
    nombre: "Solicitud de pagos",
    tipo: "Apps Script",
    descripcion: "Solicitar pagos internos a tesoreria o externos",
    url: "https://script.google.com/a/macros/bnhmedical.com/s/AKfycby3Gj6Q4dAq5Yz2kHGbhX9rxRPJ4s1ljKGcLdwiVIusStRft3lb8GvcOmLL6sDy8pNd/exec"
  },
  {
    nombre: "Bitacora de vehiculos",
    tipo: "Apps Script",
    descripcion: "Reportar mantenimientos a los vehiculos",
    url: "https://script.google.com/a/macros/bnhmedical.com/s/AKfycbxWP-qrJC4xepfH6YxCfxeIxHLOkp8vgM-p-uYxLtq0zla3p0djKYlCSdB52jkf2uP3aw/exec"
  }
];

// APIs visibles solo al validar la clave gerencial
const APIS_GERENCIALES = [
  {
    nombre: "Inteligencia Comercial & Control de Metas",
    tipo: "Gerencia",
    descripcion: "reporte de las ventas Vs meta.",
    url: "https://script.google.com/a/macros/bnhmedical.com/s/AKfycbzYlHfqnZObnC36ClnvijDIqKfzwFlgx6vARECpeWxhuZrXi_jSyc38JkTz4u_zKvNtSg/exec"
  },
  {
    nombre: "Panel de cxc VIVA",
    tipo: "Cobranzas",
    descripcion: "Reporte de cobranzas VIVA.",
    url: "https://script.google.com/a/macros/bnhmedical.com/s/AKfycbzpgsnEVYc8FhWi7sbErT0HzppV0D_oPOfcmW7op-5m5LRNG13eaYvVpURW4EYLNag5/exec"
  },
  {
    nombre: "Panel de reporte de pago",
    tipo: "Finanzas",
    descripcion: "Resumen del flujo de efectivo entrante.",
    url: "https://bnhrpagos.vercel.app/admin"
  },
  {
    nombre: "Aprobacion de viaticos",
    tipo: "Viaticos",
    descripcion: "Panel de aprobacion de viaticos",
    url: "https://script.google.com/a/macros/bnhmedical.com/s/AKfycbxUZaFQEDFcLT9UoErtTaIK228WDE0kC2O1Zx1KTyxB-MXG8OYuu7nGDMmFpF6GQQuS/exec?vista=pendientes"
  },
  {
    nombre: "Panel de servicio tecnico",
    tipo: "Dashboard",
    descripcion: "Reporte de insidencia y respuesta de los tecnicos.",
    url: "https://serviciotbnh.vercel.app/dashboard"
  },
  {
    nombre: "API de Control de Accesos",
    tipo: "Seguridad",
    descripcion: "Gestión de permisos y auditoría interna.",
    url: "https://api.ejemplo.com/gerencia/v1/accesos"
  }
];

// ==========================================
// 2. REFERENCIAS DEL DOM Y ESTADO
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
const inputBusquedaEl = document.getElementById("input-busqueda");
const contadorApisEl = document.getElementById("contador-apis");
const estadoGerencialEl = document.getElementById("estado-gerencial");

let gerencialDesbloqueado = false;
let terminoBusqueda = "";

// ==========================================
// 3. FUNCIONES DE INTERFAZ
// ==========================================

/**
 * Aplica la paleta seleccionada y la guarda en localStorage.
 * @param {string} nombrePaleta
 */
function aplicarPaleta(nombrePaleta) {
  document.documentElement.setAttribute("data-paleta", nombrePaleta);
  if (selectPaletaEl && selectPaletaEl.value !== nombrePaleta) {
    selectPaletaEl.value = nombrePaleta;
  }
  try {
    localStorage.setItem("bnh_paleta", nombrePaleta);
  } catch (_) {}
}

/**
 * Formatea visualmente enlaces muy largos (como Google Apps Script) sin alterar su destino real.
 * @param {string} url
 */
function formatearUrlCorta(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("script.google.com")) {
      return `${parsed.origin}/.../exec`;
    }
    return url;
  } catch (_) {
    return url;
  }
}

/**
 * Verifica si una tarjeta coincide con el texto buscado.
 */
function coincideBusqueda(api, consulta) {
  if (!consulta) return true;
  const texto = `${api.nombre} ${api.descripcion} ${api.tipo || ""} ${api.url}`.toLowerCase();
  return texto.includes(consulta.toLowerCase());
}

/**
 * Copia el enlace al portapapeles y muestra confirmación en el botón.
 */
function copiarEnlace(url, boton) {
  const etiqueta = boton.querySelector("span");
  const confirmar = () => {
    boton.classList.add("copiado");
    if (etiqueta) etiqueta.textContent = "Copiado";
    setTimeout(() => {
      boton.classList.remove("copiado");
      if (etiqueta) etiqueta.textContent = "Copiar enlace";
    }, 1600);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(url).then(confirmar).catch(() => {});
  } else {
    const aux = document.createElement("textarea");
    aux.value = url;
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    confirmar();
  }
}

/**
 * Dibuja las tarjetas de APIs dentro del contenedor indicado.
 */
function renderizarApis(apis, contenedor, mensajeVacio) {
  contenedor.innerHTML = "";
  const filtradas = apis.filter((api) => coincideBusqueda(api, terminoBusqueda));

  if (filtradas.length === 0) {
    const vacio = document.createElement("div");
    vacio.className = "estado-vacio";
    vacio.textContent = mensajeVacio;
    contenedor.appendChild(vacio);
    return 0;
  }

  filtradas.forEach((api) => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-api";

    const cabecera = document.createElement("div");
    cabecera.className = "tarjeta-top";

    const titulo = document.createElement("h3");
    titulo.textContent = api.nombre;

    const insignia = document.createElement("span");
    insignia.className = "insignia-tipo";
    insignia.textContent = api.tipo || (api.url.includes("script.google.com") ? "Apps Script" : "Portal");

    cabecera.appendChild(titulo);
    cabecera.appendChild(insignia);

    const descripcion = document.createElement("p");
    descripcion.textContent = api.descripcion;

    const enlace = document.createElement("a");
    enlace.className = "tarjeta-enlace";
    enlace.href = api.url;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.title = api.url;
    enlace.textContent = formatearUrlCorta(api.url);

    const acciones = document.createElement("div");
    acciones.className = "tarjeta-acciones";

    const btnAbrir = document.createElement("a");
    btnAbrir.className = "btn-abrir";
    btnAbrir.href = api.url;
    btnAbrir.target = "_blank";
    btnAbrir.rel = "noopener noreferrer";
    btnAbrir.textContent = "Abrir";

    const btnCopiar = document.createElement("button");
    btnCopiar.type = "button";
    btnCopiar.className = "btn-copiar";
    btnCopiar.innerHTML = `
      <svg class="icono-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <span>Copiar enlace</span>
    `;
    btnCopiar.addEventListener("click", () => copiarEnlace(api.url, btnCopiar));

    acciones.appendChild(btnAbrir);
    acciones.appendChild(btnCopiar);

    tarjeta.appendChild(cabecera);
    tarjeta.appendChild(descripcion);
    tarjeta.appendChild(enlace);
    tarjeta.appendChild(acciones);
    contenedor.appendChild(tarjeta);
  });

  return filtradas.length;
}

/**
 * Actualiza ambos paneles y el contador superior según la búsqueda activa.
 */
function actualizarPaneles() {
  const visiblesUsuarios = renderizarApis(
    APIS_USUARIOS,
    listaUsuariosEl,
    "No hay APIs de usuarios que coincidan con tu búsqueda."
  );

  let visiblesGerenciales = 0;
  if (gerencialDesbloqueado) {
    visiblesGerenciales = renderizarApis(
      APIS_GERENCIALES,
      listaGerencialEl,
      "No hay APIs gerenciales que coincidan con tu búsqueda."
    );
  }

  if (contadorApisEl) {
    const total = visiblesUsuarios + visiblesGerenciales;
    contadorApisEl.textContent = `${total} ${total === 1 ? "API visible" : "APIs visibles"}`;
  }
}

/**
 * Valida la clave ingresada y muestra el panel gerencial si coincide.
 */
function desbloquearPanelGerencial() {
  const claveIngresada = inputClaveEl.value.trim();

  if (claveIngresada === CLAVE_GERENCIAL) {
    gerencialDesbloqueado = true;
    mensajeErrorEl.textContent = "";
    bloqueLoginEl.classList.add("oculto");
    contenidoGerencialEl.classList.remove("oculto");
    inputClaveEl.value = "";
    if (estadoGerencialEl) {
      estadoGerencialEl.textContent = "Desbloqueado";
      estadoGerencialEl.classList.remove("etiqueta-bloqueado");
      estadoGerencialEl.classList.add("etiqueta-desbloqueado");
    }
    actualizarPaneles();
  } else {
    mensajeErrorEl.textContent = "Clave incorrecta. Inténtalo de nuevo.";
  }
}

/**
 * Oculta el panel gerencial y limpia las tarjetas del DOM.
 */
function bloquearPanelGerencial() {
  gerencialDesbloqueado = false;
  listaGerencialEl.innerHTML = "";
  contenidoGerencialEl.classList.add("oculto");
  bloqueLoginEl.classList.remove("oculto");
  if (estadoGerencialEl) {
    estadoGerencialEl.textContent = "Restringido";
    estadoGerencialEl.classList.remove("etiqueta-desbloqueado");
    estadoGerencialEl.classList.add("etiqueta-bloqueado");
  }
  actualizarPaneles();
}

// ==========================================
// 4. INICIALIZACIÓN Y EVENTOS
// ==========================================

let paletaGuardada = PALETA_INICIAL;
try {
  paletaGuardada = localStorage.getItem("bnh_paleta") || PALETA_INICIAL;
} catch (_) {}

aplicarPaleta(paletaGuardada);
actualizarPaneles();

if (selectPaletaEl) {
  selectPaletaEl.addEventListener("change", (event) => {
    aplicarPaleta(event.target.value);
  });
}

if (inputBusquedaEl) {
  inputBusquedaEl.addEventListener("input", (event) => {
    terminoBusqueda = event.target.value.trim();
    actualizarPaneles();
  });
}

btnDesbloquearEl.addEventListener("click", desbloquearPanelGerencial);
inputClaveEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    desbloquearPanelGerencial();
  }
});
btnBloquearEl.addEventListener("click", bloquearPanelGerencial);
