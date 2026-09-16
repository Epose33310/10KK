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

  /* Les pages atelier pointent sur demo.html#demo-slam & co. : le jeu s'ouvre
     tout seul à l'arrivée. On attend DOMContentLoaded pour que les scripts
     de jeu aient rempli leur écran — jamais de fenêtre vide. */
  function ouvrirDepuisLien() {
    var cible = /^#demo-([a-z]+)$/.exec(window.location.hash || '');
    if (!cible) return;
    var bouton = document.querySelector('[data-play="' + cible[1] + '"]');
    if (bouton) bouton.click();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ouvrirDepuisLien);
  } else {
    // Les scripts differés suivants n'ont pas encore tourné : on leur laisse le tour.
    setTimeout(ouvrirDepuisLien, 0);
  }
})();
