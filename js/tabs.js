const menuBtn = document.getElementById('menu-btn');
const sideMenu = document.getElementById('side-menu');
const mainContent = document.querySelector('.main-content');
const menuLinks = document.querySelectorAll('.menu-link');
const tabSections = document.querySelectorAll('.tab-section');

// Toggle menú lateral
menuBtn.addEventListener('click', () => {
  sideMenu.classList.toggle('open');
  mainContent.classList.toggle('shifted');
});

// Mostrar sección al hacer clic en el menú
menuLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // Activar enlace
    menuLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Mostrar sección correspondiente
    const target = link.dataset.tab;
    tabSections.forEach(section => {
      section.style.display = section.id === target ? 'block' : 'none';
    });

    // Cerrar menú lateral automáticamente
    sideMenu.classList.remove('open');
    mainContent.classList.remove('shifted');
  });
});

// Mostrar solo la primera sección al inicio
tabSections.forEach((s, i) => (s.style.display = i === 0 ? 'block' : 'none'));
