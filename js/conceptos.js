/* =================== ACCORDION =================== */
// Nivel principal
document.querySelectorAll('.level-accordion .accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    document.querySelectorAll('.level-accordion .accordion-content').forEach(c => {
      if (c !== content) c.style.display = 'none';
    });
    document.querySelectorAll('.level-accordion .accordion-btn').forEach(b => {
      if (b !== btn) b.classList.remove('active');
    });
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
    btn.classList.toggle('active');
  });
});

// Sub-accordion
document.querySelectorAll('.sub-accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    const parent = btn.parentElement;
    parent.querySelectorAll('.sub-accordion-content').forEach(c => {
      if (c !== content) c.style.display = 'none';
    });
    parent.querySelectorAll('.sub-accordion-btn').forEach(b => {
      if (b !== btn) b.classList.remove('active');
    });
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
    btn.classList.toggle('active');
  });
});

// Mini-sub
document.querySelectorAll('.mini-sub-accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    const parent = btn.parentElement;
    parent.querySelectorAll('.mini-sub-accordion-content').forEach(c => {
      if (c !== content) c.style.display = 'none';
    });
    parent.querySelectorAll('.mini-sub-accordion-btn').forEach(b => {
      if (b !== btn) b.classList.remove('active');
    });
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
    btn.classList.toggle('active');
  });
});
