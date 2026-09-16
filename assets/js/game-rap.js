/* ==========================================================================
   Démo 04 — 60 secondes de rap
   Un mot apparaît, il faut trouver une rime. Bonne réponse : mot suivant.
   Mauvaise : le mot reste, on réessaie. Le chrono ne s'arrête pas.

   La validation ne compare pas des lettres : l'index assets/data/rimes.json
   a été construit hors ligne en phonétisant un vrai lexique français
   (tools/build-rimes.cjs). Un mot est accepté s'il figure dans le panier de
   rimes du mot affiché, ce qui vérifie d'un coup son existence et sa rime.
   ========================================================================== */

(function () {
  'use strict';

  var host = document.querySelector('#play-rap .play__body');
  if (!host) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DUREE = 60;
  var LIEN_ATELIER = 'atelier-rap.html';

  var data = null;          // index chargé à la demande
  var chargement = null;    // promesse en cours, pour ne pas charger deux fois

  var state = { restant: DUREE, score: 0, cible: null, file: [], fini: true, tickId: null };

  /* ----------------------------------------------------------------------
     Outils
     ---------------------------------------------------------------------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  /** Minuscules, accents conservés, espaces et ponctuation écartés. */
  function normaliser(valeur) {
    return String(valeur == null ? '' : valeur)
      .toLowerCase()
      .replace(/[^a-zà-öø-ÿ'-]/g, '')
      .trim();
  }

  function melanger(liste) {
    var copie = liste.slice();
    for (var i = copie.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = copie[i]; copie[i] = copie[j]; copie[j] = t;
    }
    return copie;
  }

  function stop() {
    if (state.tickId) { clearInterval(state.tickId); state.tickId = null; }
  }

  function show(build) {
    stop();
    host.replaceChildren(build());
  }

  /* ----------------------------------------------------------------------
     Chargement de l'index
     ---------------------------------------------------------------------- */

  function charger() {
    if (data) return Promise.resolve(data);
    if (chargement) return chargement;
    chargement = fetch('assets/data/rimes.json')
      .then(function (r) {
        if (!r.ok) throw new Error('indisponible');
        return r.json();
      })
      .then(function (json) {
        if (!json || !json.cibles || !json.rimes) throw new Error('format');
        data = json;
        return data;
      })
      .catch(function (e) { chargement = null; throw e; });
    return chargement;
  }

  /* ----------------------------------------------------------------------
     Écrans
     ---------------------------------------------------------------------- */

  function screenIntro() {
    var s = el('div', 'g g--center');
    s.appendChild(el('p', 'g__eyebrow', 'Défi de rimes'));
    s.appendChild(el('h3', 'g__title', 'Combien de rimes en 60 secondes ?'));
    s.appendChild(el('p', 'g__text', 'Je vous donne un mot. Trouvez une rime, validez, le mot suivant arrive. Une mauvaise réponse ne coûte aucun point : elle coûte du temps.'));

    var tip = el('p', 'g__tip', 'On cherche le dernier son, pas les mêmes lettres. « soleil » rime avec « merveille ».');
    s.appendChild(tip);

    var go = el('button', 'g__btn', 'Jouer');
    go.type = 'button';
    go.appendChild(el('span', 'arrow', '→'));
    go.addEventListener('click', function () {
      if (go.disabled) return;
      go.disabled = true;
      go.textContent = 'Chargement…';
      charger().then(function () { show(screenPlay); })
        .catch(function () { show(screenErreur); });
    });
    s.appendChild(go);
    return s;
  }

  function screenErreur() {
    var s = el('div', 'g g--center');
    s.appendChild(el('p', 'g__eyebrow', 'Dictionnaire indisponible'));
    s.appendChild(el('h3', 'g__title', 'Le jeu n’a pas pu charger sa liste de rimes.'));
    s.appendChild(el('p', 'g__text', 'C’est passager, et souvent lié à la connexion.'));
    var retry = el('button', 'g__btn', 'Réessayer');
    retry.type = 'button';
    retry.addEventListener('click', function () { show(screenIntro); });
    s.appendChild(retry);
    return s;
  }

  function motSuivant() {
    if (!state.file.length) state.file = melanger(data.cibles);
    state.cible = state.file.pop() || data.cibles[0];
    return state.cible;
  }

  function screenPlay() {
    state.restant = DUREE;
    state.score = 0;
    state.file = melanger(data.cibles);
    state.fini = false;
    motSuivant();

    var s = el('div', 'g g--play');

    var bar = el('div', 'g__hud');
    var chrono = el('p', 'g__hud-time');
    chrono.appendChild(el('span', 'g__hud-label', 'Temps'));
    var chronoVal = el('b', null, String(DUREE));
    chrono.appendChild(chronoVal);
    var score = el('p', 'g__hud-score');
    score.appendChild(el('span', 'g__hud-label', 'Rimes'));
    var scoreVal = el('b', null, '0');
    score.appendChild(scoreVal);
    bar.appendChild(chrono);
    bar.appendChild(score);
    s.appendChild(bar);

    var jauge = el('div', 'g__gauge');
    var jaugeIn = el('span');
    jauge.appendChild(jaugeIn);
    s.appendChild(jauge);

    var mot = el('p', 'g__word', state.cible.mot);
    s.appendChild(mot);

    var form = el('form', 'g__form');
    form.setAttribute('autocomplete', 'off');

    var label = el('label', 'visually-hidden', 'Votre rime');
    label.setAttribute('for', 'rap-input');
    form.appendChild(label);

    var input = document.createElement('input');
    input.type = 'text';
    input.id = 'rap-input';
    input.className = 'g__input';
    input.placeholder = 'Votre rime…';
    input.autocapitalize = 'none';
    input.autocorrect = 'off';
    input.spellcheck = false;
    input.enterKeyHint = 'send';
    form.appendChild(input);

    var send = el('button', 'g__btn g__btn--send', 'Valider');
    send.type = 'submit';
    form.appendChild(send);
    s.appendChild(form);

    // Un seul élément de retour, annoncé aux lecteurs d'écran.
    var flash = el('p', 'g__flash');
    flash.setAttribute('role', 'status');
    s.appendChild(flash);

    function dire(texte, ok) {
      flash.textContent = texte;
      flash.className = 'g__flash ' + (ok ? 'is-ok' : 'is-ko');
      if (!reduced) {
        flash.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
          { duration: 200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (state.fini) return;

      var reponse = normaliser(input.value);
      if (!reponse) { dire('✕  Écrivez un mot.', false); input.focus(); return; }

      var cible = state.cible;
      if (reponse === normaliser(cible.mot)) {
        dire('✕  Le même mot ne compte pas.', false);
        input.select();
        return;
      }

      var panier = data.rimes[cible.rime];
      var accepte = Array.isArray(panier) && panier.indexOf(reponse) !== -1;

      if (!accepte) {
        dire('✕  Pas encore. Cherchez le même son final.', false);
        input.select();
        return;
      }

      state.score += 1;
      scoreVal.textContent = String(state.score);
      dire('✓  Validé', true);
      if (navigator.vibrate) { try { navigator.vibrate(18); } catch (err) { /* sans effet */ } }

      var suivant = motSuivant();
      mot.textContent = suivant.mot;
      if (!reduced) {
        mot.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
          { duration: 220, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      }
      input.value = '';
      input.focus();
    });

    setTimeout(function () { input.focus(); }, reduced ? 0 : 260);

    // Compte à rebours ancré sur l'horloge : il ne dérive pas si l'onglet rame.
    var fin = Date.now() + DUREE * 1000;
    state.tickId = setInterval(function () {
      var restant = Math.max(0, Math.round((fin - Date.now()) / 1000));
      state.restant = restant;
      chronoVal.textContent = String(restant);
      jaugeIn.style.transform = 'scaleX(' + (restant / DUREE) + ')';
      chrono.classList.toggle('is-low', restant <= 10);
      if (restant <= 0) {
        state.fini = true;
        stop();
        input.blur();
        show(screenFin);
      }
    }, 200);

    return s;
  }

  function screenFin() {
    var n = state.score;
    var s = el('div', 'g g--center');
    s.appendChild(el('p', 'g__eyebrow', 'Temps écoulé'));
    s.appendChild(el('p', 'g__score', String(n)));
    s.appendChild(el('h3', 'g__title', n === 0 ? 'Aucune rime validée cette fois.'
      : n === 1 ? '1 rime trouvée.' : n + ' rimes trouvées.'));
    s.appendChild(el('p', 'g__text', 'Vous venez de travailler une technique d’atelier rap : chercher une rime à partir du son, pas de l’orthographe.'));
    s.appendChild(el('p', 'g__text g__text--strong', 'Imaginez maintenant quinze participants, un chrono et leurs propres mots.'));

    var cta = el('a', 'g__btn g__btn--cta', 'Découvrir l’atelier rap');
    cta.href = LIEN_ATELIER;
    cta.appendChild(el('span', 'arrow', '→'));
    s.appendChild(cta);

    var again = el('button', 'g__link', 'Rejouer ↻');
    again.type = 'button';
    again.addEventListener('click', function () { show(screenPlay); });
    s.appendChild(again);
    return s;
  }

  /* ----------------------------------------------------------------------
     Cycle de vie
     ---------------------------------------------------------------------- */

  var dialog = document.getElementById('play-rap');
  if (dialog) {
    dialog.addEventListener('close', function () {
      state.fini = true;
      stop();
      show(screenIntro);       // on repart propre à la réouverture
    });
  }

  show(screenIntro);
})();
