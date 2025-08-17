/* global window */
(function (w) {
  const { $, $$ } = w.App || {};

  function initModal() {
    const modal = $('#modal');
    if (!modal) return;

    const content  = $('#modal-content', modal);
    const closeBtn = $('.modal__close', modal);
    const backdrop = $('.modal__backdrop', modal);
    let lastFocused = null;

    function openModal(html) {
      if (!content) return;
      lastFocused = document.activeElement;
      content.innerHTML = html;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn && closeBtn.focus();
    }

    function closeModal() {
      if (!content) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      content.innerHTML = '';
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    closeBtn && closeBtn.addEventListener('click', closeModal);
    backdrop && backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    // Delegate card clicks / Enter
    const grid = $('#grid');
    if (grid) {
      grid.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (!card) return;
        if (e.target.closest('a,button,input,label')) return; // ignore interactive
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

    // Export on the App namespace (so other files can call if needed)
    w.App = Object.assign({}, w.App, { openModal, closeModal });
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModal, { once: true });
  } else {
    initModal();
  }
})(window);
