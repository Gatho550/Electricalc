// --- Función de recomendación simplificada ---
function calcularRecomendacion() {
  let corriente = parseFloat(document.getElementById("rec-corriente").value);
  let longitud = parseFloat(document.getElementById("rec-longitud").value);
  let voltaje = parseFloat(document.getElementById("rec-voltaje").value);

  if (isNaN(corriente) || isNaN(longitud) || isNaN(voltaje)) {
    alert("Por favor completa todos los campos.");
    return;
  }

  const resistividades = { "Cobre": 1.68e-8, "Aluminio": 2.65e-8 };
  const areasSeccion = {
    "20":0.518, "18":0.823, "16":1.31, "14":2.08, "12":3.31,
    "10":5.26, "8":8.37, "6":13.3, "4":21.2, "2":33.6,
    "1":42.4, "0":53.5, "00":67.4, "000":85.0, "0000":107
  };

  const caidaMax = 0.03 * voltaje;

  function calcularCalibre(material) {
    let rho = resistividades[material];
    // Ordenar los calibres de menor a mayor sección
    let calibres = Object.entries(areasSeccion).sort((a,b) => a[1]-b[1]);
    for (let [c, a_mm2] of calibres) {
      let A = a_mm2 * 1e-6; // mm² a m²
      let R = rho * (longitud / A);
      let Vcaida = corriente * R;
      if (Vcaida <= caidaMax) return c;
    }
    return "Ninguno cumple la norma";
  }

  document.getElementById("recomendacion-cobre").innerText = `✅ Cobre: ${calcularCalibre("Cobre")} AWG`;
  document.getElementById("recomendacion-aluminio").innerText = `✅ Aluminio: ${calcularCalibre("Aluminio")} AWG`;
}

// --- Función de calculadora detallada ---
function calcularCaida() {
  let corriente = parseFloat(document.getElementById("corriente").value);
  let longitud = parseFloat(document.getElementById("longitud").value);
  let voltajeEntrada = parseFloat(document.getElementById("voltaje").value);
  let material = document.getElementById("material").value;
  let calibre = document.getElementById("calibre").value;
  let fase = document.getElementById("fase").value;

  const resistividades = {
    "Cobre": 1.68e-8,
    "Aluminio": 2.65e-8
  };

  const areasSeccion = {
    "20":0.518, "18":0.823, "16":1.31, "14":2.08, "12":3.31,
    "10":5.26, "8":8.37, "6":13.3, "4":21.2, "2":33.6,
    "1":42.4, "0":53.5, "00":67.4, "000":85.0, "0000":107
  };

  if (isNaN(corriente) || isNaN(longitud) || isNaN(voltajeEntrada)) {
    alert("Por favor completa todos los campos numéricos.");
    return;
  }

  let rho = resistividades[material];
  let area = areasSeccion[calibre] * 1e-6; // mm² a m²
  let R = rho * (longitud / area);

  if (fase === "Bifásico") R *= 2;
  else if (fase === "Trifásico") R *= 3;

  let caidaVoltaje = corriente * R;
  let voltajeSalida = voltajeEntrada - caidaVoltaje;

  document.getElementById("resultado").innerText = `Caída de tensión: ${caidaVoltaje.toFixed(4)} V`;
  document.getElementById("salida").innerText = `Voltaje de salida: ${voltajeSalida.toFixed(4)} V`;

  const caidaMax = 0.03 * voltajeEntrada;
  let recomendacion = "";
  // Ordenar calibres de menor a mayor
  let calibres = Object.entries(areasSeccion).sort((a,b) => a[1]-b[1]);
  for (let [c, a_mm2] of calibres) {
    let A = a_mm2 * 1e-6;
    let r = rho * (longitud / A);
    if (fase === "Bifásico") r *= 2;
    else if (fase === "Trifásico") r *= 3;
    if (corriente * r <= caidaMax) {
      recomendacion = `✅ Calibre recomendado: ${c} AWG`;
      break;
    }
  }
  document.getElementById("recomendacion").innerText = recomendacion;
}

// --- Navegación por pestañas ---
const tabs = document.querySelectorAll(".tab-btn");
const sections = document.querySelectorAll(".tab-section");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    sections.forEach(sec => sec.style.display = "none");
    document.getElementById(tab.dataset.tab).style.display = "block";
  });
});

// Mostrar la primera pestaña por defecto
document.getElementById("recomendaciones").style.display = "block";

// --- Accordion principal ---
const acc = document.getElementsByClassName("accordion-btn");
for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    const panel = this.nextElementSibling;
    panel.style.display = (panel.style.display === "block") ? "none" : "block";
  });
}

// --- Sub-accordion (nivel árbol) ---
const subAcc = document.getElementsByClassName("sub");
for (let i = 0; i < subAcc.length; i++) {
  subAcc[i].addEventListener("click", function(e) {
    e.stopPropagation(); // evita que se cierre el nivel superior
    this.classList.toggle("active");
    const panel = this.nextElementSibling;
    panel.style.display = (panel.style.display === "block") ? "none" : "block";
  });
}

// --- Modal para mostrar contenido detallado ---
const modal = document.createElement("div");
modal.id = "concept-modal";
modal.style.position = "fixed";
modal.style.top = "0";
modal.style.left = "0";
modal.style.width = "100%";
modal.style.height = "100%";
modal.style.background = "rgba(0,0,0,0.8)";
modal.style.color = "#fff";
modal.style.display = "none";
modal.style.justifyContent = "center";
modal.style.alignItems = "center";
modal.style.padding = "20px";
modal.style.overflowY = "auto";
modal.style.zIndex = "1000";

const modalContent = document.createElement("div");
modalContent.style.background = "#1e1e1e";
modalContent.style.borderRadius = "12px";
modalContent.style.padding = "20px";
modalContent.style.maxWidth = "600px";
modalContent.style.width = "90%";
modal.appendChild(modalContent);

const closeBtn = document.createElement("button");
closeBtn.innerText = "Cerrar";
closeBtn.style.marginTop = "10px";
closeBtn.onclick = () => { modal.style.display = "none"; };
modalContent.appendChild(closeBtn);

document.body.appendChild(modal);

// Abrir modal al hacer click en un sub-accordion
const subPanels = document.querySelectorAll(".sub-panel p");
subPanels.forEach(p => {
  p.style.cursor = "pointer";
  p.addEventListener("click", function(e){
    modalContent.innerHTML = `<p>${this.innerText}</p>`;
    modalContent.appendChild(closeBtn);
    modal.style.display = "flex";
  });
});
