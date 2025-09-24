// =================== CALCULADORA DE CAÍDA DE TENSIÓN ===================
document.getElementById("calcular").addEventListener("click", function () {
    // Propiedades del conductor
    const resistividad = 1.72e-8; // Ω·m (cobre a 20 °C)
    const area = parseFloat(document.getElementById("area").value); // m²
    const longitudConductor = parseFloat(document.getElementById("longitud").value); // m (ida y vuelta si no se multiplica)
    const corrienteAmperes = parseFloat(document.getElementById("corriente").value); // A
    const voltajeVolts = parseFloat(document.getElementById("voltaje").value); // V

    // Validación
    if (
        isNaN(area) || isNaN(longitudConductor) ||
        isNaN(corrienteAmperes) || isNaN(voltajeVolts) ||
        area <= 0 || longitudConductor <= 0 ||
        corrienteAmperes <= 0 || voltajeVolts <= 0
    ) {
        document.getElementById("resultado").textContent = "⚠️ Por favor ingresa valores válidos y mayores a 0.";
        return;
    }

    // Fórmula de resistencia: R = ρ * (L / A)
    // ⚡ Nota: Si el usuario solo ingresa la longitud de ida, multiplicar por 2:
    const R = resistividad * (longitudConductor / area);

    // Caída de tensión Vd = I * R
    const Vd = corrienteAmperes * R;
    const porcentaje = (Vd / voltajeVolts) * 100;

    // Resultado
    document.getElementById("resultado").innerHTML =
        `Caída de tensión: <strong>${Vd.toFixed(2)} V</strong> 
        (${porcentaje.toFixed(2)} % del voltaje nominal)`;
});

// =================== TABS ===================
const tabButtons = document.querySelectorAll(".tab-btn");
tabButtons.forEach(btn => {
    btn.addEventListener("click", function () {
        document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
        document.getElementById(this.dataset.tab).style.display = "block";
        tabButtons.forEach(b => b.classList.remove("active"));
        this.classList.add("active");
    });
});
// Activa la pestaña inicial
document.querySelector(".tab-btn[data-tab='recomendaciones']").classList.add("active");
document.getElementById("recomendaciones").style.display = "block";

// =================== ACORDEÓN ===================
document.querySelectorAll(".accordion-btn").forEach(btn => {
    btn.addEventListener("click", function () {
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        content.style.display = (content.style.display === "block") ? "none" : "block";
    });
});

// =================== MODAL ===================
const modal = document.getElementById("modal");
const modalText = document.getElementById("modal-text");
const closeBtn = document.getElementById("close-modal");

document.querySelectorAll(".modal-link").forEach(link => {
    link.addEventListener("click", function () {
        modalText.textContent = this.dataset.text;
        modal.style.display = "block";
    });
});

closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
});

// Ocultar todos los paneles de acordeón al iniciar
const panels = document.querySelectorAll(".sub-panel");
panels.forEach(panel => {
  panel.style.display = "none";
});

const mainAcc = document.querySelectorAll(".accordion-btn:not(.sub)");
mainAcc.forEach(btn => {
  const panel = btn.nextElementSibling;
  panel.style.display = "none";
});
