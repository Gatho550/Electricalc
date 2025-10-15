/* =================== MENÚ LATERAL =================== */
function abrirNav() {
  document.getElementById("miSidenav").style.width = "250px";
  document.getElementById("principal").style.marginLeft = "250px";
  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function cerrarNav() {
  document.getElementById("miSidenav").style.width = "0";
  document.getElementById("principal").style.marginLeft = "0";
  document.body.style.backgroundColor = "white";
}

/* =================== MODAL (opcional) =================== */
const modal = document.getElementById("modal");
if (modal) {
  const modalText = document.getElementById("modal-text");
  const closeBtn = document.getElementById("close-modal");

  document.querySelectorAll(".modal-link").forEach((link) => {
    link.addEventListener("click", function () {
      modalText.textContent = this.dataset.text;
      modal.style.display = "block";
    });
  });

  closeBtn?.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
}
