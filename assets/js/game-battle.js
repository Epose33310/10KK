/* ==========================================================================
   Démo 02 — Punchline compliment
   Une personne tirée au sort, une qualité et une image écrites par le joueur,
   puis la comparaison s'assemble. Le site ne propose jamais la qualité ni
   l'image : c'est le participant qui crée la matière.
   ========================================================================== */

(function () {
  'use strict';

  var host = document.querySelector('#play-battle .play__body');
  if (!host) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LIEN_ATELIER = 'atelier-battle.html';

  /* Le genre ne sert pas à corriger le joueur mais à lui poser la bonne
     question : « qui la décrit » plutôt que « qui le décrit ». */
  var PEOPLE = [
    { t: 'Mon chat', f: false }, { t: 'Mon frère', f: false }, { t: 'Zidane', f: false },
    { t: 'Ma mère', f: true }, { t: 'Mon voisin', f: false }, { t: 'Ma sœur', f: true },
    { t: 'Mon meilleur pote', f: false }, { t: 'Ma grand-mère', f: true },
    { t: 'Mbappé', f: false }, { t: 'Mon prof', f: false }, { t: 'Mon collègue', f: false },
    { t: 'Mon père', f: false }, { t: 'Ma copine', f: true }, { t: 'Mon chien', f: false },
    { t: 'Mon patron', f: false }, { t: 'Mon idole', f: true }, { t: 'Mon meilleur ami', f: false },
    { t: 'Ma prof', f: true }, { t: 'Ma meilleure amie', f: true }, { t: 'Mon petit frère', f: false },
    { t: 'Ma tante', f: true }, { t: 'Mon équipe', f: true }
  ];

  var EXEMPLES_M = 'Ex. drôle, élégant, fort, généreux…';
  var EXEMPLES_F = 'Ex. drôle, élégante, forte, généreuse…';

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

  /** Nettoie une saisie sans en changer les mots. */
  function nettoyer(valeur) {
    return String(valeur == null ? '' : valeur)
      .replace(/\s+/g, ' ')
      .replace(/^[\s.,;:!?…-]+/, '')
      .replace(/[\s.,;:…]+$/, '')
      .trim();
  }

  function composer(personne, qualite, image) {
    if (!personne || !qualite || !image) return '';
    // Le joueur écrit souvent « comme le soleil » : on évite le doublon.
    var img = image.replace(/^comme\s+/i, '').trim();
    if (!img) return '';
    var phrase = personne + ' est ' + qualite + ' comme ' + img;
    return phrase.replace(/\s{2,}/g, ' ').trim() + '.';
  }

  function show(build) {
    if (state.rollId) { clearTimeout(state.rollId); state.rollId = null; }
    if (state.revealId) { clearTimeout(state.revealId); state.revealId = null; }
    host.replaceChildren(build());
  }

  /* ----------------------------------------------------------------------
     État
     ---------------------------------------------------------------------- */

  var state = { personne: null, qualite: '', image: '', rollId: null, revealId: null };

  /* ----------------------------------------------------------------------
     Écrans
     ---------------------------------------------------------------------- */

  function screenIntro() {
    var s = el('div', 'g g--center');
    s.appendChild(el('p', 'g__eyebrow', 'Un compliment. Une image. Une punchline.'));
    s.appendChild(el('h3', 'g__title', 'Construisez votre punchline en trois mots.'));
    s.appendChild(el('p', 'g__text', 'Le principe de la battle, retourné : on ne cherche pas à démolir, on cherche à flatter. Et on frappe avec une image.'));

    var go = el('button', 'g__btn', 'Commencer');
    go.type = 'button';
    go.appendChild(el('span', 'arrow', '→'));
    go.addEventListener('click', function () { show(screenPersonne); });
    s.appendChild(go);
    return s;
  }

  function screenPersonne() {
    state.personne = pick(PEOPLE, null) || PEOPLE[0];

    var s = el('div', 'g g--center');
    s.appendChild(el('p', 'g__eyebrow', 'Étape 1'));
    s.appendChild(el('h3', 'g__title', 'À qui allez-vous faire ce compliment ?'));

    var slot = el('p', 'g__slot', PEOPLE[0].t);
    s.appendChild(slot);

    var apres = el('div', 'g__after');
    apres.hidden = true;
    var go = el('button', 'g__btn', "C'est parti");
    go.type = 'button';
    go.appendChild(el('span', 'arrow', '→'));
    go.addEventListener('click', function () { show(screenQualite); });
    apres.appendChild(go);
    s.appendChild(apres);

    var delai = 50;
    var restants = reduced ? 0 : 14;
    function rouler() {
      if (restants <= 0) {
        slot.textContent = state.personne.t;
        slot.classList.add('is-locked');
        apres.hidden = false;
        return;
      }
      var tire = pick(PEOPLE, null);
      slot.textContent = tire ? tire.t : state.personne.t;
      restants -= 1;
      delai *= 1.10;
      state.rollId = setTimeout(rouler, delai);
    }
    if (reduced) {
      slot.textContent = state.personne.t;
      slot.classList.add('is-locked');
      apres.hidden = false;
    } else {
      state.rollId = setTimeout(rouler, delai);
    }
    return s;
  }

  /** Écran de saisie commun aux étapes 2 et 3. */
  function champ(config) {
    var s = el('div', 'g');
    s.appendChild(el('p', 'g__eyebrow', config.etape));
    s.appendChild(el('h3', 'g__title', config.titre));
    s.appendChild(el('p', 'g__text', config.aide));

    var form = el('form', 'g__form g__form--stack');
    form.setAttribute('autocomplete', 'off');

    var label = el('label', 'visually-hidden', config.label);
    label.setAttribute('for', config.id);
    form.appendChild(label);

    var input = document.createElement('input');
    input.type = 'text';
    input.id = config.id;
    input.className = 'g__input';
    input.placeholder = config.placeholder;
    input.enterKeyHint = 'next';
    input.maxLength = 60;
    form.appendChild(input);

    var send = el('button', 'g__btn g__btn--send', config.bouton);
    send.type = 'submit';
    send.appendChild(el('span', 'arrow', '→'));
    form.appendChild(send);
    s.appendChild(form);

    var flash = el('p', 'g__flash');
    flash.setAttribute('role', 'status');
    s.appendChild(flash);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valeur = nettoyer(input.value);
      var souci = !valeur ? config.erreur
        : (config.verifier ? config.verifier(valeur) : null);
      if (souci) {
        flash.textContent = souci;
        flash.className = 'g__flash is-ko';
        input.focus();
        return;
      }
      config.valider(valeur);
    });

    setTimeout(function () { input.focus(); }, reduced ? 0 : 280);
    return s;
  }

  function screenQualite() {
    var personne = state.personne;
    var feminin = personne && personne.f;
    return champ({
      etape: 'Étape 2 · ' + (personne ? personne.t : ''),
      titre: 'Quelle qualité lui donneriez-vous ?',
      aide: 'Un adjectif, celui qui ' + (feminin ? 'la' : 'le') + ' décrit le mieux.',
      label: 'La qualité',
      id: 'battle-qualite',
      placeholder: feminin ? EXEMPLES_F : EXEMPLES_M,
      bouton: 'Continuer',
      erreur: 'Écrivez un adjectif pour continuer.',
      valider: function (valeur) {
        state.qualite = valeur;
        show(screenImage);
      }
    });
  }

  function screenImage() {
    return champ({
      etape: 'Étape 3 · ' + state.qualite,
      titre: "Qu'est-ce qui est " + state.qualite + ' ?',
      aide: 'Cherchez une chose que tout le monde connaît et qui possède cette qualité. C’est elle qui rendra le compliment imparable.',
      label: "L'image",
      id: 'battle-image',
      placeholder: 'Ex. le soleil…',
      bouton: 'Créer ma punchline',
      erreur: 'Écrivez une image pour créer la punchline.',
      // « comme » seul donnerait « brillant comme comme ».
      verifier: function (valeur) {
        return /^comme\s*$/i.test(valeur)
          ? 'Écrivez la chose elle-même : « le soleil », « une montagne »…'
          : null;
      },
      valider: function (valeur) {
        state.image = valeur;
        show(screenResultat);
      }
    });
  }

  function screenResultat() {
    var phrase = composer(state.personne && state.personne.t, state.qualite, state.image);
    if (!phrase) return screenIntro();       // sécurité : jamais de phrase cassée

    var s = el('div', 'g g--center');
    s.appendChild(el('p', 'g__eyebrow', 'Votre punchline'));

    // Les trois ingrédients apparaissent l'un après l'autre, puis la phrase.
    var pile = el('div', 'g__build');
    var morceaux = [state.personne.t, state.qualite, state.image].map(function (mot) {
      var ligne = el('p', 'g__build-item', mot);
      pile.appendChild(ligne);
      return ligne;
    });
    s.appendChild(pile);

    var resultat = el('p', 'g__result');
    s.appendChild(resultat);

    var suite = el('div', 'g__after');
    suite.hidden = true;
    suite.appendChild(el('p', 'g__text g__text--strong', 'Vous venez de construire une punchline.'));
    suite.appendChild(el('p', 'g__text', 'La technique tient en trois temps : partir d’une qualité, chercher une image que tout le monde comprend, puis fabriquer la comparaison. C’est tout, et ça marche à chaque fois.'));
    suite.appendChild(el('p', 'g__text g__text--strong', 'Imaginez maintenant un groupe entier en train d’en fabriquer.'));

    var cta = el('a', 'g__btn g__btn--cta', 'Découvrir la battle de compliments');
    cta.href = LIEN_ATELIER;
    cta.appendChild(el('span', 'arrow', '→'));
    suite.appendChild(cta);

    var again = el('button', 'g__link', 'Rejouer ↻');
    again.type = 'button';
    again.addEventListener('click', reset);
    suite.appendChild(again);
    s.appendChild(suite);

    if (reduced) {
      morceaux.forEach(function (n) { n.classList.add('is-in'); });
      resultat.textContent = phrase;
      resultat.classList.add('is-in');
      suite.hidden = false;
    } else {
      var etapes = morceaux.map(function (node, i) {
        return function () { node.classList.add('is-in'); };
      });
      etapes.push(function () {
        resultat.textContent = phrase;
        resultat.classList.add('is-in');
      });
      etapes.push(function () { suite.hidden = false; });

      var i = 0;
      (function jouer() {
        if (i >= etapes.length) return;
        etapes[i]();
        i += 1;
        state.revealId = setTimeout(jouer, i <= 3 ? 420 : 560);
      })();
    }

    return s;
  }

  /* ----------------------------------------------------------------------
     Cycle de vie
     ---------------------------------------------------------------------- */

  function reset() {
    state.personne = null;
    state.qualite = '';
    state.image = '';
    show(screenIntro);
  }

  var dialog = document.getElementById('play-battle');
  if (dialog) dialog.addEventListener('close', reset);

  reset();
})();
