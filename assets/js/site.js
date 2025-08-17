// Not used anymore

document.addEventListener('DOMContentLoaded', () => {
  // -------- Element lookup (safe) --------
  const grid = document.getElementById('grid');
  const tagButtons = Array.from(document.querySelectorAll('.tag-toggle'));

  // Logic toggle pieces
  const logicSwitch = document.getElementById('logicSwitch');
  const logicLabel  = document.getElementById('logicLabel');
  const logicThumb  = document.querySelector('.switch__thumb');

  // Modal pieces
  const modal = document.getElementById('modal');
  const modalContent = modal ? modal.querySelector('#modal-content') : null;
  const modalClose   = modal ? modal.querySelector('.modal__close') : null;
  const modalBackdrop= modal ? modal.querySelector('.modal__backdrop') : null;

  const cards = grid ? Array.from(grid.querySelectorAll('.card')) : [];

  // -------- Helpers --------
  function currentLogic() {
    // unchecked = OR, checked = AND
    return (logicSwitch && logicSwitch.checked) ? 'and' : 'or';
  }

  function updateLogicUI() {
    if (!logicSwitch) return;
    const isAnd = logicSwitch.checked;
    if (logicLabel) logicLabel.textContent = isAnd ? 'AND' : 'OR';
    if (logicThumb) logicThumb.setAttribute('data-glyph', isAnd ? '∧' : '∨');
  }

  function selectedTags() {
    return tagButtons
      .filter(btn => btn.getAttribute('aria-pressed') === 'true')
      .map(btn => btn.dataset.tag);
  }

  function equalizeHeights() {
    if (!cards.length) return;
    cards.forEach(c => { c.style.height = 'auto'; });
    const visible = cards.filter(c => c.style.display !== 'none');
    let max = 0;
    visible.forEach(c => { max = Math.max(max, c.offsetHeight); });
    document.documentElement.style.setProperty('--card-height', max > 0 ? `${max}px` : 'auto');
  }

  function filter() {
    if (!cards.length) return;
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

  // -------- Modal logic --------
  let lastFocused = null;

  function openModal(html) {
    if (!modal || !modalContent) return;
    lastFocused = document.activeElement;
    modalContent.innerHTML = html;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (modalClose) modalClose.focus();
  }

  function closeModal() {
    if (!modal || !modalContent) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalContent.innerHTML = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  // -------- Event wiring --------
  // tag chips
  tagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const pressed = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', String(!pressed));
      filter();
    });
  });

  // logic switch
  if (logicSwitch) {
    logicSwitch.addEventListener('change', () => {
      updateLogicUI();
      filter();
    });
    updateLogicUI(); // initial paint (sets ∨/∧ and OR/AND text)
  }

  // card click / Enter to open modal
  if (grid) {
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (!card) return;
      // ignore clicks on interactive elements inside the card
      if (e.target.closest('a, button, input, label')) return;

      const tpl = card.querySelector('template.card__details');
      if (tpl) openModal(tpl.innerHTML);
    });

    grid.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const card = e.target.closest('.card');
      if (!card) return;
      const tpl = card.querySelector('template.card__details');
      if (tpl) openModal(tpl.innerHTML);
    });
  }

  // modal close paths
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) closeModal();
  });

  // resize + initial
  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(equalizeHeights, 120);
  });

  equalizeHeights(); // initial height sync
});
