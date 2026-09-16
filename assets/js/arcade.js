/* ==========================================================================
   Page démo — ouverture des bornes de jeu
   Chargé uniquement par demo.html.
   ========================================================================== */

(function () {
  'use strict';

  var openers = document.querySelectorAll('[data-play]');
  if (!openers.length) return;

  function close(dialog) {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  Array.prototype.forEach.call(openers, function (button) {
    var dialog = document.getElementById('play-' + button.getAttribute('data-play'));
    if (!dialog) return;

    button.addEventListener('click', function () {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');    // navigateurs sans <dialog>
      document.body.classList.add('is-locked');
    });

    var closeBtn = dialog.querySelector('[data-play-close]');
    if (closeBtn) closeBtn.addEventListener('click', function () { close(dialog); });

    // Clic sur le fond : la cible est le dialog lui-même, pas son contenu.
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) close(dialog);
    });

    // Le verrou de défilement se lève quelle que soit la façon de fermer,
    // bouton, Échap ou clic extérieur : tous passent par l'événement close.
    dialog.addEventListener('close', function () {
      document.body.classList.remove('is-locked');
      button.focus();
    });
  });
})();
