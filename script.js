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

// ----- Recomendación -----
function recomendarCalibre() {
    let carga = parseFloat(document.getElementById("carga").value);
    let voltaje = parseFloat(document.getElementById("voltajeRec").value);
    let distancia = parseFloat(document.getElementById("distancia").value);

    const resistividades = { "Cobre":1.68e-8, "Aluminio":2.65e-8 };
    const areasSeccion = { "20":0.518, "18":0.823, "16":1.31, "14":2.08, "12":3.31, "10":5.26, "8":8.37, "6":13.3, "4":21.2, "2":33.6, "1":42.4, "0":53.5, "00":67.4, "000":85.0, "0000":107 };
    const caidaMax = 0.03 * voltaje;

    let recomendaciones = {};

    for (let mat in resistividades) {
        let rho = resistividades[mat]*1e6;
        for (let c in areasSeccion) {
            let r = rho*(distancia/areasSeccion[c]);
            if(carga*r <= caidaMax) { recomendaciones[mat]=c; break; }
        }
    }

    document.getElementById("recomendacionCobre").innerText = recomendaciones["Cobre"] ? `Cobre: ${recomendaciones["Cobre"]} AWG` : "No se encontró calibre adecuado para Cobre.";
    document.getElementById("recomendacionAluminio").innerText = recomendaciones["Aluminio"] ? `Aluminio: ${recomendaciones["Aluminio"]} AWG` : "No se encontró calibre adecuado para Aluminio.";
}

// ----- Panel de conceptos -----
function mostrarConcepto(id) {
    const subindices = document.querySelectorAll(".subindice");
    subindices.forEach(s => s.style.display = "none");
    document.getElementById(id).style.display = "block";
}

function cargarContenido(texto) {
    document.getElementById("contenido").innerText = texto;
}
