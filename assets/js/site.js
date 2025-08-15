document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid');
  const cards = Array.from(grid.querySelectorAll('.card'));
  const tagButtons = Array.from(document.querySelectorAll('.tag-toggle'));
  const logicRadios = Array.from(document.querySelectorAll('input[name="logic"]'));

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
        if (logic === 'and') {
          show = selected.every(t => tags.includes(t));
        } else {
          show = selected.some(t => tags.includes(t));
        }
      }

      card.style.display = show ? '' : 'none';
    });

    equalizeHeights(); // keep heights in sync after visibility changes
  }

  function equalizeHeights() {
    // reset first so we measure natural heights
    cards.forEach(c => { c.style.height = 'auto'; });

    // Only consider visible cards
    const visible = cards.filter(c => c.style.display !== 'none');
    let max = 0;
    visible.forEach(c => { max = Math.max(max, c.offsetHeight); });

    // Apply global max
    document.documentElement.style.setProperty('--card-height', max > 0 ? `${max}px` : 'auto');
  }

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
