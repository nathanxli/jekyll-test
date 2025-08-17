document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid');
  const cards = Array.from(grid.querySelectorAll('.card'));
  const tagButtons = Array.from(document.querySelectorAll('.tag-toggle'));
  const logicRadios = Array.from(document.querySelectorAll('input[name="logic"]'));

  // Modal bits
  const modal = document.getElementById('modal');
  const modalContent = modal?.querySelector('#modal-content');
  const modalClose = modal?.querySelector('.modal__close');
  const modalBackdrop = modal?.querySelector('.modal__backdrop');
  let lastFocused = null;

  function selectedTags() {
    return tagButtons
      .filter(btn => btn.getAttribute('aria-pressed') === 'true')
      .map(btn => btn.dataset.tag);
  }

  function currentLogic() {
    const picked = logicRadios.find(r => r.checked);
    return picked ? picked.value : 'or';
  }

  function filter() {
    const selected = selectedTags();
    const logic = currentLogic();

    cards.forEach(card => {
      const tags = card.dataset.tags.split(',').map(s => s.trim());
      let show = true;

      if (selected.length > 0) {
        show = (logic === 'and')
          ? selected.every(t => tags.includes(t))
          : selected.some(t => tags.includes(t));
      }
      card.style.display = show ? '' : 'none';
    });

    equalizeHeights();
  }

  function equalizeHeights() {
    cards.forEach(c => { c.style.height = 'auto'; });
    const visible = cards.filter(c => c.style.display !== 'none');
    let max = 0;
    visible.forEach(c => { max = Math.max(max, c.offsetHeight); });
    document.documentElement.style.setProperty('--card-height', max > 0 ? `${max}px` : 'auto');
  }

  // --- Modal logic ---
  function openModal(html) {
    if (!modal) return;
    lastFocused = document.activeElement;
    modalContent.innerHTML = html;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose?.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalContent.innerHTML = '';
    if (lastFocused) lastFocused.focus();
  }

  // card click / Enter key
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;

    // Don’t open modal if clicking interactive elements
    if (e.target.closest('a, button, input, label')) return;

    const tpl = card.querySelector('template.card__details');
    if (tpl) openModal(tpl.innerHTML);
  });

  grid.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const card = e.target.closest('.card');
      if (!card) return;
      const tpl = card.querySelector('template.card__details');
      if (tpl) openModal(tpl.innerHTML);
    }
  });

  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('is-open')) closeModal();
  });

  // Toggle button behavior
  tagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const pressed = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', String(!pressed));
      filter();
    });
  });

  // Logic change
  logicRadios.forEach(r => r.addEventListener('change', filter));

  // Recompute on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(equalizeHeights, 100);
  });

  // Initial paint
  equalizeHeights();
});
