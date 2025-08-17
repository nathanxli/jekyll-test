/* global window */
(function (w) {
  const { $, $$, debounce, equalizeHeights } = w.App || {};

  function initCourses() {
    const grid        = $('#grid');
    const cards       = grid ? $$('.card', grid) : [];
    const tagButtons  = $$('.tag-toggle');
    const logicSwitch = $('#logicSwitch');
    const logicLabel  = $('#logicLabel');
    const logicThumb  = document.querySelector('.switch__thumb');

    // --- logic helpers ---
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

    function filter() {
      if (!cards.length) return;
      const selected = selectedTags();
      const logic = currentLogic();

      cards.forEach(card => {
        const tags = (card.dataset.tags || '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);

        let show = true;
        if (selected.length > 0) {
          show = (logic === 'and')
            ? selected.every(t => tags.includes(t))
            : selected.some(t => tags.includes(t));
        }
        card.style.display = show ? '' : 'none';
      });

      equalizeHeights(cards);
    }

    // chip toggles
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
      updateLogicUI(); // initial symbol + label
    }

    // recompute heights on resize
    window.addEventListener('resize', debounce(() => equalizeHeights(cards), 120));

    // initial paint
    equalizeHeights(cards);
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCourses, { once: true });
  } else {
    initCourses();
  }
})(window);
