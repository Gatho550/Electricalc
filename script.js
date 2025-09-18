// Secciones
function mostrarSeccion(seccionId) {
    const secciones = document.querySelectorAll("main section");
    secciones.forEach(sec => sec.style.display = "none");
    document.getElementById(seccionId).style.display = "block";
}

// Mostrar calculadora por defecto
mostrarSeccion('calculadora');

// ----- Calculadora -----
function calcularCaida() {
    let corriente = parseFloat(document.getElementById("corriente").value);
    let longitud = parseFloat(document.getElementById("longitud").value);
    let voltajeEntrada = parseFloat(document.getElementById("voltaje").value);
    let material = document.getElementById("material").value;
    let calibre = document.getElementById("calibre").value;
    let fase = document.getElementById("fase").value;

    const resistividades = { "Cobre":1.68e-8, "Aluminio":2.65e-8, "Alucobre":3.2e-8 };
    const areasSeccion = { "20":0.518, "18":0.823, "16":1.31, "14":2.08, "12":3.31, "10":5.26, "8":8.37, "6":13.3, "4":21.2, "2":33.6, "1":42.4, "0":53.5, "00":67.4, "000":85.0, "0000":107 };

    let rho = resistividades[material]*1e6;
    let area = areasSeccion[calibre];
    let R = rho * (longitud / area);
    if (fase==="Bifásico") R*=2; else if(fase==="Trifásico") R*=3;

    let caidaVoltaje = corriente*R;
    let voltajeSalida = voltajeEntrada - caidaVoltaje;

    document.getElementById("resultado").innerText = `Caída de tensión: ${caidaVoltaje.toFixed(4)} V`;
    document.getElementById("salida").innerText = `Voltaje de salida: ${voltajeSalida.toFixed(4)} V`;
}

 const caidaMax = 0.03 * voltajeEntrada;
  let recomendaciones = [];
  for (let [c, a] of Object.entries(areasSeccion)) {
    let r = rho * (longitud / a);
    if (fase === "Bifásico") r *= 2;
    else if (fase === "Trifásico") r *= 3;
    if (corriente * r <= caidaMax) {
      recomendaciones.push(c);
    }
  }

  if (recomendaciones.length > 0) {
    document.getElementById("recomendacion-principal").innerText = `✅ Calibres recomendados: ${recomendaciones.join(", ")} AWG`;
  } else {
    document.getElementById("recomendacion-principal").innerText = "⚠ Ningún calibre cumple con la caída máxima";
  }
}

// Accordion para conceptos
document.querySelectorAll(".accordion-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const panel = btn.nextElementSibling;
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  });
});

// Tabs navegación
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
