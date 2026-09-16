/* ==========================================================================
   Démo 01 — Phrase poétique
   Un verbe choisi puis verrouillé, un sujet tiré au sort, une association
   inattendue. Le site pose la contrainte ; le participant écrit la suite.
   Jamais de phrase générée à sa place, jamais de jugement sur ce qu'il écrit.
   ========================================================================== */

(function () {
  'use strict';

  var host = document.querySelector('#play-slam .play__body');
  if (!host) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LIEN_ATELIER = 'atelier-slam.html';

  /* ----------------------------------------------------------------------
     Contenu
     ---------------------------------------------------------------------- */

  /* Les formes conjuguées sont écrites, pas dérivées : mieux vaut vingt-cinq
     verbes sûrs que trois cents approximatifs. */
  var VERBS = [
    { inf: 'déraper', sing: 'dérape', plur: 'dérapent' },
    { inf: 'voler', sing: 'vole', plur: 'volent' },
    { inf: 'trembler', sing: 'tremble', plur: 'tremblent' },
    { inf: 'brûler', sing: 'brûle', plur: 'brûlent' },
    { inf: "s'effacer", sing: "s'efface", plur: "s'effacent" },
    { inf: 'courir', sing: 'court', plur: 'courent' },
    { inf: "s'échapper", sing: "s'échappe", plur: "s'échappent" },
    { inf: 'dormir', sing: 'dort', plur: 'dorment' },
    { inf: 'tomber', sing: 'tombe', plur: 'tombent' },
    { inf: 'danser', sing: 'danse', plur: 'dansent' },
    { inf: 'marcher', sing: 'marche', plur: 'marchent' },
    { inf: 'chuchoter', sing: 'chuchote', plur: 'chuchotent' },
    { inf: 'crier', sing: 'crie', plur: 'crient' },
    { inf: 'flotter', sing: 'flotte', plur: 'flottent' },
    { inf: 'glisser', sing: 'glisse', plur: 'glissent' },
    { inf: 'attendre', sing: 'attend', plur: 'attendent' },
    { inf: 'grandir', sing: 'grandit', plur: 'grandissent' },
    { inf: 'disparaître', sing: 'disparaît', plur: 'disparaissent' },
    { inf: 'respirer', sing: 'respire', plur: 'respirent' },
    { inf: 'revenir', sing: 'revient', plur: 'reviennent' },
    { inf: "s'envoler", sing: "s'envole", plur: "s'envolent" },
    { inf: "s'endormir", sing: "s'endort", plur: "s'endorment" },
    { inf: 'rêver', sing: 'rêve', plur: 'rêvent' },
    { inf: 'saigner', sing: 'saigne', plur: 'saignent' },
    { inf: 'vibrer', sing: 'vibre', plur: 'vibrent' }
  ];

  var SUBJECTS = [
    // nature
    { t: 'les étoiles', p: true }, { t: 'la lune', p: false }, { t: 'le soleil', p: false },
    { t: 'la pluie', p: false }, { t: 'le vent', p: false }, { t: 'les nuages', p: true },
    { t: 'la mer', p: false }, { t: 'les vagues', p: true }, { t: 'les arbres', p: true },
    { t: 'les fleurs', p: true }, { t: 'la neige', p: false }, { t: 'les feuilles', p: true },
    { t: 'les montagnes', p: true }, { t: 'la rivière', p: false }, { t: "l'orage", p: false },
    { t: 'le brouillard', p: false },
    // objets
    { t: 'une horloge', p: false }, { t: 'une fenêtre', p: false }, { t: 'une chaise', p: false },
    { t: 'une valise', p: false }, { t: 'une photo', p: false }, { t: 'une lettre', p: false },
    { t: 'un téléphone', p: false }, { t: 'une ampoule', p: false }, { t: 'une porte', p: false },
    { t: 'un miroir', p: false }, { t: 'un carnet', p: false }, { t: 'une chaussure', p: false },
    { t: 'un stylo', p: false },
    // émotions et abstractions
    { t: 'la peur', p: false }, { t: 'la colère', p: false }, { t: 'la joie', p: false },
    { t: 'la solitude', p: false }, { t: "l'amour", p: false }, { t: 'le silence', p: false },
    { t: 'le temps', p: false }, { t: 'la mémoire', p: false }, { t: "l'espoir", p: false },
    { t: 'le doute', p: false }, { t: 'le désir', p: false }, { t: 'la liberté', p: false },
    { t: 'la tristesse', p: false }, { t: 'la nostalgie', p: false },
    // quotidien
    { t: 'la ville', p: false }, { t: 'la rue', p: false }, { t: 'le métro', p: false },
    { t: "l'école", p: false }, { t: 'la maison', p: false }, { t: 'la chambre', p: false },
    { t: 'le café', p: false }, { t: 'la nuit', p: false }, { t: 'le matin', p: false },
    { t: 'le dimanche', p: false },
    // personnes et groupes
    { t: 'un enfant', p: false }, { t: 'un vieil homme', p: false }, { t: 'une inconnue', p: false },
    { t: 'un voisin', p: false }, { t: 'un amoureux', p: false }, { t: 'une foule', p: false },
    { t: 'les passants', p: true }, { t: 'les souvenirs', p: true }
  ];

  /* ----------------------------------------------------------------------
     Outils
     ---------------------------------------------------------------------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function pick(liste, eviter) {
    if (!Array.isArray(liste) || !liste.length) return null;
    if (liste.length === 1) return liste[0];
    var v = eviter;
    while (v === eviter) v = liste[Math.floor(Math.random() * liste.length)];
    return v;
  }

  function majuscule(texte) {
    var s = String(texte || '');
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /** Sujet + verbe accordé. Ne renvoie jamais de fragment incomplet. */
  function amorce(sujet, verbe) {
    if (!sujet || !verbe) return '';
    var forme = sujet.p ? verbe.plur : verbe.sing;
    if (!forme) return '';
    return majuscule(sujet.t) + ' ' + forme;
  }

  /** Assemble l'amorce et la suite écrite, en nettoyant la ponctuation. */
  function composer(debut, suite) {
    var fin = String(suite || '')
      .replace(/^[\s.…]+/, '')        // le joueur recopie souvent les points
      .replace(/\s+/g, ' ')
      .trim();
    if (!debut) return '';
    if (!fin) return debut + '.';

    var phrase = /^[,;:]/.test(fin) ? debut + fin : debut + ' ' + fin;
    phrase = phrase
      .replace(/\s+([,.])/g, '$1')    // jamais d'espace avant virgule ou point
      .replace(/\s*([!?;:])/g, ' $1') // une seule espace avant les autres
      .replace(/\s{2,}/g, ' ')
      .replace(/([.!?])\.+$/, '$1')   // pas de point après un point
      .trim();

    if (!/[.!?…]$/.test(phrase)) phrase += '.';
    return phrase;
  }

  function show(build) {
    if (state.rollId) { clearTimeout(state.rollId); state.rollId = null; }
    host.replaceChildren(build());
  }

  /* ----------------------------------------------------------------------
     État
     ---------------------------------------------------------------------- */

  var state = { verbe: null, sujet: null, rollId: null };

  /* ----------------------------------------------------------------------
     Écrans
     ---------------------------------------------------------------------- */

  function screenIntro() {
    var s = el('div', 'g g--center');
    s.appendChild(el('p', 'g__eyebrow', 'Association inattendue'));
    s.appendChild(el('h3', 'g__title', 'Deux mots. Une image. À vous d’écrire la suite.'));
    s.appendChild(el('p', 'g__text', 'On part d’une association que personne n’aurait choisie. La machine pose la contrainte — la poésie, c’est vous qui l’écrivez.'));

    var go = el('button', 'g__btn', 'Commencer');
    go.type = 'button';
    go.appendChild(el('span', 'arrow', '→'));
    go.addEventListener('click', function () { show(screenVerbe); });
    s.appendChild(go);
    return s;
  }

  function screenVerbe() {
    var s = el('div', 'g');
    s.appendChild(el('p', 'g__eyebrow', 'Étape 1'));
    s.appendChild(el('h3', 'g__title', 'Choisissez votre verbe.'));
    s.appendChild(el('p', 'g__text', 'Ce mot va guider toute la phrase. Une fois choisi, il est verrouillé.'));

    var grille = el('div', 'g__verbs');
    VERBS.forEach(function (verbe) {
      if (!verbe.sing || !verbe.plur) return;          // jamais de forme incertaine
      var b = el('button', 'g__verb', verbe.inf);
      b.type = 'button';
      b.addEventListener('click', function () {
        if (b.disabled) return;
        Array.prototype.forEach.call(grille.children, function (autre) {
          autre.disabled = true;
          autre.classList.toggle('is-picked', autre === b);
        });
        state.verbe = verbe;
        setTimeout(function () { show(screenSujet); }, reduced ? 0 : 360);
      });
      grille.appendChild(b);
    });
    s.appendChild(grille);
    return s;
  }

  function verrou() {
    var lock = el('p', 'g__lock');
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', 'g__lock-icon');
    svg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12 2a5 5 0 0 1 5 5v2h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v2h6V7a3 3 0 0 0-3-3zm0 9a2 2 0 0 0-1 3.7V19h2v-2.3A2 2 0 0 0 12 13z');
    svg.appendChild(path);
    lock.appendChild(svg);                              // le cadenas ouvre la pastille
    lock.appendChild(el('span', 'g__lock-label', 'Verbe verrouillé'));
    lock.appendChild(el('b', null, state.verbe ? state.verbe.inf : ''));
    return lock;
  }

  function screenSujet() {
    state.sujet = pick(SUBJECTS, null) || SUBJECTS[0];

    var s = el('div', 'g g--center');
    s.appendChild(verrou());
    s.appendChild(el('p', 'g__eyebrow', 'Étape 2 · le sujet'));
    s.appendChild(el('h3', 'g__title', 'Et maintenant, qui fait cette action ?'));

    var slot = el('p', 'g__slot', SUBJECTS[0].t);
    s.appendChild(slot);

    var apres = el('div', 'g__after');
    apres.hidden = true;
    var go = el('button', 'g__btn', 'Continuer');
    go.type = 'button';
    go.appendChild(el('span', 'arrow', '→'));
    go.addEventListener('click', function () { show(screenEcrire); });
    apres.appendChild(go);
    s.appendChild(apres);

    var delai = 50;
    var restants = reduced ? 0 : 14;
    function rouler() {
      if (restants <= 0) {
        slot.textContent = state.sujet.t;
        slot.classList.add('is-locked');
        apres.hidden = false;
        return;
      }
      var tire = pick(SUBJECTS, null);
      slot.textContent = tire ? tire.t : state.sujet.t;
      restants -= 1;
      delai *= 1.10;
      state.rollId = setTimeout(rouler, delai);
    }
    if (reduced) {
      slot.textContent = state.sujet.t;
      slot.classList.add('is-locked');
      apres.hidden = false;
    } else {
      state.rollId = setTimeout(rouler, delai);
    }
    return s;
  }

  function screenEcrire() {
    var debut = amorce(state.sujet, state.verbe);
    if (!debut) { return screenIntro(); }        // sécurité : jamais d'écran cassé

    var s = el('div', 'g');
    s.appendChild(verrou());
    s.appendChild(el('p', 'g__phrase', debut + '…'));

    s.appendChild(el('h3', 'g__title g__title--sm', 'À vous de trouver la suite.'));
    s.appendChild(el('p', 'g__text', 'Ajoutez quelques mots pour transformer cette phrase en image.'));
    s.appendChild(el('p', 'g__hint', 'Où ? Pourquoi ? Vers quoi ? Avec quelle sensation ?'));

    var form = el('form', 'g__form g__form--stack');
    form.setAttribute('autocomplete', 'off');

    var label = el('label', 'visually-hidden', 'La suite de votre phrase');
    label.setAttribute('for', 'slam-input');
    form.appendChild(label);

    /* Une zone de texte plutôt qu'une ligne : sur téléphone, on voit sa phrase
       entière pendant qu'on l'écrit au lieu de la regarder défiler. */
    var input = document.createElement('textarea');
    input.id = 'slam-input';
    input.className = 'g__input g__input--area';
    input.rows = 3;
    input.placeholder = 'Continuez la phrase…';
    input.enterKeyHint = 'done';
    input.maxLength = 140;
    form.appendChild(input);

    var send = el('button', 'g__btn g__btn--send', 'Terminer ma phrase');
    send.type = 'submit';
    form.appendChild(send);
    s.appendChild(form);

    var flash = el('p', 'g__flash');
    flash.setAttribute('role', 'status');
    s.appendChild(flash);

    /* Le champ grandit avec le texte, sans jamais pousser le bouton hors écran. */
    function ajuster() {
      input.style.height = 'auto';
      var h = input.scrollHeight;
      input.style.height = (h > 0 ? Math.min(h, 240) : 112) + 'px';
    }
    input.addEventListener('input', ajuster);

    function valider() {
      var suite = String(input.value || '').replace(/^[\s.…]+/, '').trim();
      if (!suite) {
        flash.textContent = 'Écrivez quelques mots pour continuer la phrase.';
        flash.className = 'g__flash is-ko';
        input.focus();
        return;
      }
      state.phrase = composer(debut, suite);
      show(screenResultat);
    }

    form.addEventListener('submit', function (e) { e.preventDefault(); valider(); });

    // Entrée valide ; Maj+Entrée laisse revenir à la ligne.
    input.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.shiftKey || e.altKey) return;
      e.preventDefault();
      valider();
    });

    /* Quand le clavier s'ouvre, le champ reste sous les yeux. */
    input.addEventListener('focus', function () {
      if (host.scrollHeight - host.clientHeight < 8) return;
      try {
        input.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
      } catch (err) {
        input.scrollIntoView(false);
      }
    });

    setTimeout(function () { input.focus(); }, reduced ? 0 : 280);
    return s;
  }

  function screenResultat() {
    var s = el('div', 'g g--center');
    s.appendChild(el('p', 'g__eyebrow', 'Votre phrase'));

    var phrase = el('p', 'g__result', state.phrase || '');
    s.appendChild(phrase);
    if (!reduced) {
      phrase.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
        { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    }

    s.appendChild(el('p', 'g__text g__text--strong', 'Vous venez de créer une image poétique.'));
    s.appendChild(el('p', 'g__text', 'En atelier, on part d’une association inattendue, puis on cherche ensemble comment la prolonger, la préciser, la rendre plus évocatrice.'));
    s.appendChild(el('p', 'g__text g__text--strong', 'Imaginez maintenant cette consigne avec tout un groupe.'));

    var cta = el('a', 'g__btn g__btn--cta', 'Découvrir l’atelier slam');
    cta.href = LIEN_ATELIER;
    cta.appendChild(el('span', 'arrow', '→'));
    s.appendChild(cta);

    var again = el('button', 'g__link', 'Rejouer ↻');
    again.type = 'button';
    again.addEventListener('click', reset);
    s.appendChild(again);
    return s;
  }

  /* ----------------------------------------------------------------------
     Cycle de vie
     ---------------------------------------------------------------------- */

  function reset() {
    state.verbe = null;
    state.sujet = null;
    state.phrase = '';
    show(screenIntro);
  }

  var dialog = document.getElementById('play-slam');
  if (dialog) dialog.addEventListener('close', reset);

  reset();
})();
