// =================== CALCULADORA DE CAÍDA DE TENSIÓN ===================
function calcularCaida() {
  const resistividadCobre = 1.72e-8;
  const resistividadAluminio = 2.82e-8;
  const resistividadAlucobre = 2.1e-8;

  const corriente = parseFloat(document.getElementById("corriente").value);
  const longitud = parseFloat(document.getElementById("longitud").value);
  const voltaje = parseFloat(document.getElementById("voltaje").value);
  const material = document.getElementById("material").value;
  const calibre = document.getElementById("calibre").value;
  const fase = document.getElementById("fase").value;

  if (isNaN(corriente) || isNaN(longitud) || isNaN(voltaje) ||
      corriente <= 0 || longitud <= 0 || voltaje <= 0) {
    document.getElementById("resultado").textContent =
      "⚠️ Ingresa valores válidos mayores a 0.";
    return;
  }

  // Tabla de áreas (mm²)
  const areas = {
  "20": 0.52, "18": 0.82, "16": 1.31, "14": 2.08,
  "12": 3.31, "10": 5.26, "8": 8.37, "6": 13.3,
  "4": 21.1, "2": 33.6, "1": 42.4, "0": 53.5,
  "00": 67.4, "000": 85, "0000": 107
};

  const area = (areas[calibre] || 0) / 1e6; // mm² → m²

  let rho = resistividadCobre;
  if (material === "Aluminio") rho = resistividadAluminio;
  if (material === "Alucobre") rho = resistividadAlucobre;

  const R = rho * (longitud * 2 / area); // ida y vuelta
  const Vd = corriente * R;
  const porcentaje = (Vd / voltaje) * 100;
  const salida = voltaje - Vd;

  document.getElementById("resultado").innerHTML =
    `<strong>Caída:</strong> ${Vd.toFixed(2)} V (${porcentaje.toFixed(2)} %)`;
  document.getElementById("salida").innerHTML =
    `<strong>Voltaje en carga:</strong> ${salida.toFixed(2)} V`;
  document.getElementById("recomendacion").innerHTML =
    porcentaje > 3
      ? "⚠️ La caída supera el 3 %, considera un calibre mayor."
      : "✅ La caída está dentro del límite permitido (≤3 %).";
}

// =================== RECOMENDACIÓN DE CALIBRE ===================
function calcularRecomendacion() {
  const corriente = parseFloat(document.getElementById("rec-corriente").value);
  const longitud = parseFloat(document.getElementById("rec-longitud").value);
  const voltaje = parseFloat(document.getElementById("rec-voltaje").value);
  const maxCaida = 0.03; // 3% caída máxima

  if (isNaN(corriente) || isNaN(longitud) || isNaN(voltaje) ||
      corriente <= 0 || longitud <= 0 || voltaje <= 0) {
    document.getElementById("recomendacion-cobre").textContent =
      "⚠️ Ingresa valores válidos mayores a 0.";
    document.getElementById("recomendacion-aluminio").textContent = "";
    return;
  }

  // Tabla de resistencias aproximadas (Ω/km)
  const calibres = [
    { awg: 12, cobre: 5.21, aluminio: 8.37 },
    { awg: 10, cobre: 3.28, aluminio: 5.27 },
    { awg: 8,  cobre: 2.07, aluminio: 3.34 },
    { awg: 6,  cobre: 1.30, aluminio: 2.11 },
    { awg: 4,  cobre: 0.82, aluminio: 1.33 },
    { awg: 2,  cobre: 0.52, aluminio: 0.84 },
    { awg: 1,  cobre: 0.41, aluminio: 0.66 },
    { awg: 0,  cobre: 0.33, aluminio: 0.53 },
    { awg: "00", cobre: 0.26, aluminio: 0.42 },
    { awg: "000", cobre: 0.21, aluminio: 0.34 },
    { awg: "0000", cobre: 0.16, aluminio: 0.27 }
  ];

  let cobreSeleccionado = null;
  let aluminioSeleccionado = null;

  // Longitud total ida y vuelta
  const L = longitud * 2;

  for (let i = 0; i < calibres.length; i++) {
    const resistenciaCobre = (calibres[i].cobre * L) / 1000; // Ω
    const resistenciaAlu   = (calibres[i].aluminio * L) / 1000; // Ω

    const caidaCobre = resistenciaCobre * corriente;
    const caidaAlu   = resistenciaAlu * corriente;

    if (!cobreSeleccionado && (caidaCobre / voltaje) <= maxCaida) {
      cobreSeleccionado = calibres[i].awg;
    }

    if (!aluminioSeleccionado && (caidaAlu / voltaje) <= maxCaida) {
      aluminioSeleccionado = calibres[i].awg;
    }

    if (cobreSeleccionado && aluminioSeleccionado) break;
  }

  if (!cobreSeleccionado) cobreSeleccionado = "0000+";
  if (!aluminioSeleccionado) aluminioSeleccionado = "0000+";

  document.getElementById("recomendacion-cobre").textContent =
    `Cobre: calibre ${cobreSeleccionado} AWG`;
  document.getElementById("recomendacion-aluminio").textContent =
    `Aluminio: calibre ${aluminioSeleccionado} AWG (≈ equivalente)`;
}

// =================== TABS ===================
const tabButtons = document.querySelectorAll(".tab-btn");
const tabSections = document.querySelectorAll(".tab-section");

tabButtons.forEach(btn => {
  btn.addEventListener("click", function () {
    tabButtons.forEach(b => b.classList.remove("active"));
    this.classList.add("active");

    tabSections.forEach(section => {
      section.style.display = section.id === this.dataset.tab ? "block" : "none";
    });
  });
});

// Mostrar solo la primera pestaña al inicio
tabSections.forEach((s, i) => (s.style.display = i === 0 ? "block" : "none"));

// --- Accordion principal: solo un nivel abierto a la vez ---
document.querySelectorAll('.level-accordion .accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;

        // Cerrar todos los demás niveles
        document.querySelectorAll('.level-accordion .accordion-content').forEach(c => {
            if (c !== content) c.style.display = 'none';
        });

        // Quitar clase active de todos los botones menos el actual
        document.querySelectorAll('.level-accordion .accordion-btn').forEach(b => {
            if (b !== btn) b.classList.remove('active');
        });

        // Alternar el actual
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
        btn.classList.toggle('active');
    });
});

// --- Sub-accordion: solo un concepto abierto dentro de su nivel ---
document.querySelectorAll('.sub-accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;

        // Encontrar el contenedor del nivel padre
        const parent = btn.parentElement;

        // Cerrar todos los demás sub-accordion dentro del mismo nivel
        parent.querySelectorAll('.sub-accordion-content').forEach(c => {
            if (c !== content) c.style.display = 'none';
        });

        // Quitar clase active de los demás botones dentro del mismo nivel
        parent.querySelectorAll('.sub-accordion-btn').forEach(b => {
            if (b !== btn) b.classList.remove('active');
        });

        // Alternar el actual
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
        btn.classList.toggle('active');
    });
});

// Mini sub-accordion: solo un ítem abierto dentro de su sub-accordion
document.querySelectorAll('.mini-sub-accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        const parent = btn.parentElement; // sub-accordion-content del nivel

        // Cerrar los demás mini-sub dentro del mismo sub-accordion
        parent.querySelectorAll('.mini-sub-accordion-content').forEach(c => {
            if (c !== content) c.style.display = 'none';
        });

        // Quitar clase active de los demás botones
        parent.querySelectorAll('.mini-sub-accordion-btn').forEach(b => {
            if (b !== btn) b.classList.remove('active');
        });

        // Alternar el actual
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
        btn.classList.toggle('active');
    });
});

// =================== MODAL ===================
// (Deja este bloque si planeas usarlo después)
const modal = document.getElementById("modal");
if (modal) {
  const modalText = document.getElementById("modal-text");
  const closeBtn = document.getElementById("close-modal");

  document.querySelectorAll(".modal-link").forEach(link => {
    link.addEventListener("click", function () {
      modalText.textContent = this.dataset.text;
      modal.style.display = "block";
    });
  });

  closeBtn?.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });
}

const mainAcc = document.querySelectorAll(".accordion-btn:not(.sub)");
mainAcc.forEach(btn => {
  const panel = btn.nextElementSibling;
  panel.style.display = "none";
});
