/* global window */
(function (w) {
  // Tiny DOM helpers
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Debounce helper
  function debounce(fn, ms = 120) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  // Equalize visible card heights via CSS var
  function equalizeHeights(cards) {
    if (!cards || !cards.length) return;
    cards.forEach(c => { c.style.height = 'auto'; });
    const visible = cards.filter(c => c.style.display !== 'none');
    let max = 0;
    visible.forEach(c => { max = Math.max(max, c.offsetHeight); });
    document.documentElement
      .style.setProperty('--card-height', max > 0 ? `${max}px` : 'auto');
  }

  // Expose a tiny namespace (no bundler, no modules)
  w.App = Object.assign({}, w.App, { $, $$, debounce, equalizeHeights });
})(window);
