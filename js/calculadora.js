/* =================== CALCULADORA DE CAÍDA DE TENSIÓN =================== */
function calcularCaida() {
  const resistividadCobre = 1.72e-8;
  const resistividadAluminio = 2.82e-8;

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

  const areas = {
    "14": 2.08, "12": 3.31, "10": 5.26,
    "8": 8.37, "6": 13.3, "4": 21.1,
    "2": 33.6, "1": 42.4, "0": 53.5,
    "00": 67.4, "000": 85, "0000": 107,
    "250": 127, "500": 253, "750": 380,
    "1000": 507, "1250": 633, "1500": 760
  };

  if (!areas[calibre]) {
    document.getElementById("resultado").textContent = "⚠️ Calibre no válido o no especificado.";
    return;
  }

  const area = areas[calibre] * 1e-6;
  let rho = material === "Aluminio" ? resistividadAluminio : resistividadCobre;
  let factor = fase.includes("Trifásico") ? Math.sqrt(3) : 2;

  const R = rho * (longitud * factor / area);
  const Vd = corriente * R;
  const porcentaje = (Vd / voltaje) * 100;
  const salida = voltaje - Vd;
  const format = n => n.toLocaleString("es-MX", { maximumFractionDigits: 2 });

  document.getElementById("resultado").innerHTML =
    `<strong>Caída:</strong> ${format(Vd)} V (${format(porcentaje)} %)`;
  document.getElementById("salida").innerHTML =
    `<strong>Voltaje en carga:</strong> ${format(salida)} V`;
  document.getElementById("recomendacion").innerHTML =
    porcentaje > 3
      ? "⚠️ La caída supera el 3 %, considera un calibre mayor."
      : "✅ Dentro del límite permitido (≤ 3 %).";
}

// =================== RECOMENDACIÓN DE CALIBRE ===================
function calcularRecomendacion() {
  const corriente = parseFloat(document.getElementById("rec-corriente").value);
  const longitud = parseFloat(document.getElementById("rec-longitud").value);
  const voltaje = parseFloat(document.getElementById("rec-voltaje").value);
  const fase = document.getElementById("fase-rec").value;
  const maxCaida = 0.03; // 3% caída máxima

    const format = (num) => num.toFixed(2);

  if (isNaN(corriente) || isNaN(longitud) || isNaN(voltaje) ||
      corriente <= 0 || longitud <= 0 || voltaje <= 0) {
    document.getElementById("recomendacion-cobre").textContent =
      "⚠️ Ingresa valores válidos mayores a 0.";
    document.getElementById("recomendacion-aluminio").textContent = "";
    document.getElementById("resultado-rec-cobre").textContent = "";
    document.getElementById("salida-rec-cobre").textContent = "";
    document.getElementById("resultado-rec-alu").textContent = "";
    document.getElementById("salida-rec-alu").textContent = "";
    return;
  }

    // Factor según el tipo de sistema
  let factor = 2; // Monofásico o Bifásico
  if (fase.includes("Trifásico")) factor = Math.sqrt(3);

  // Tabla de resistencias aproximadas (Ω/km)
  const calibres = [
    { awg: "14", cobre: 8.29, aluminio: 13.2 },
    { awg: "12", cobre: 5.21, aluminio: 8.37 },
    { awg: "10", cobre: 3.28, aluminio: 5.27 },
    { awg: "8",  cobre: 2.07, aluminio: 3.34 },
    { awg: "6",  cobre: 1.30, aluminio: 2.11 },
    { awg: "4",  cobre: 0.82, aluminio: 1.33 },
    { awg: "2",  cobre: 0.52, aluminio: 0.84 },
    { awg: "1",  cobre: 0.41, aluminio: 0.66 },
    { awg: "0",  cobre: 0.33, aluminio: 0.53 },
    { awg: "00", cobre: 0.26, aluminio: 0.42 },
    { awg: "000", cobre: 0.21, aluminio: 0.34 },
    { awg: "0000", cobre: 0.16, aluminio: 0.27 },
    { awg: "250 MCM", cobre: 0.13, aluminio: 0.22 },
    { awg: "500 MCM", cobre: 0.065, aluminio: 0.11 },
    { awg: "750 MCM", cobre: 0.043, aluminio: 0.073 },
    { awg: "1000 MCM", cobre: 0.032, aluminio: 0.058 }
  ];

  let cobreSeleccionado = null;
  let aluminioSeleccionado = null;
  let VdCobre = 0, VdAlu = 0;
  let porcentajeCobre = 0, porcentajeAlu = 0;
  let salidaCobre = 0, salidaAlu = 0;

  // Calcular caída para cada calibre
  for (let i = 0; i < calibres.length; i++) {
    const resistenciaCobre = (calibres[i].cobre * longitud * factor) / 1000; // Ω
    const resistenciaAlu   = (calibres[i].aluminio * longitud * factor) / 1000; // Ω

    const caidaCobre = resistenciaCobre * corriente;
    const caidaAlu   = resistenciaAlu * corriente;

    const porcentajeCaidaCobre = caidaCobre / voltaje;
    const porcentajeCaidaAlu   = caidaAlu / voltaje;

    if (!cobreSeleccionado && porcentajeCaidaCobre <= maxCaida) {
      cobreSeleccionado = calibres[i].awg;
      VdCobre = caidaCobre;
      porcentajeCobre = porcentajeCaidaCobre * 100;
      salidaCobre = voltaje - caidaCobre;
    }

    if (!aluminioSeleccionado && porcentajeCaidaAlu <= maxCaida) {
      aluminioSeleccionado = calibres[i].awg;
      VdAlu = caidaAlu;
      porcentajeAlu = porcentajeCaidaAlu * 100;
      salidaAlu = voltaje - caidaAlu;
    }

    if (cobreSeleccionado && aluminioSeleccionado) break;
  }

  if (!cobreSeleccionado) cobreSeleccionado = "≥ 1000 MCM";
  if (!aluminioSeleccionado) aluminioSeleccionado = "≥ 1000 MCM";

  // Mostrar resultados
  document.getElementById("recomendacion-cobre").textContent =
    `🔹 Cobre recomendado: ${cobreSeleccionado}`;
  document.getElementById("resultado-rec-cobre").innerHTML =
    `<strong>Caída:</strong> ${format(VdCobre)} V (${format(porcentajeCobre)} %)`;
  document.getElementById("salida-rec-cobre").innerHTML =
    `<strong>Voltaje en carga:</strong> ${format(salidaCobre)} V`;

  document.getElementById("recomendacion-aluminio").textContent =
    `🔹 Aluminio recomendado: ${aluminioSeleccionado}`;
  document.getElementById("resultado-rec-alu").innerHTML =
    `<strong>Caída:</strong> ${format(VdAlu)} V (${format(porcentajeAlu)} %)`;
  document.getElementById("salida-rec-alu").innerHTML =
    `<strong>Voltaje en carga:</strong> ${format(salidaAlu)} V`;
}