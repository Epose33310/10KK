/* ==========================================================================
   Démo 02 — Punchline compliment
   Une personne tirée au sort, puis quatre mots écrits par le joueur : la
   qualité, l'image, le verbe et la comparaison. Rien n'est proposé à sa
   place — Esope pose le cadre, le participant fournit toute la matière.
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

  /* Le verbe et la comparaison viennent du joueur : rien n'est ajouté ici. */
  function composer() {
    var personne = state.personne && state.personne.t;
    if (!personne || !state.verbe || !state.qualite || !state.lien || !state.image) return '';
    // Le joueur écrit souvent « comme le soleil » : on évite le doublon.
    var img = state.image.replace(/^comme\s+/i, '').trim();
    if (!img) return '';
    var phrase = [personne, state.verbe, state.qualite, state.lien, img].join(' ');
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

  var state = { personne: null, qualite: '', image: '', verbe: '', lien: '', rollId: null, revealId: null };

  /* ----------------------------------------------------------------------
     Écrans
     ---------------------------------------------------------------------- */

  function screenIntro() {
    var s = el('div', 'g g--center');
    s.appendChild(el('p', 'g__eyebrow', 'Un compliment. Une image. Une punchline.'));
    s.appendChild(el('h3', 'g__title', 'Construisez votre punchline, mot après mot.'));
    s.appendChild(el('p', 'g__text', 'Le principe du battle, retourné : on ne cherche pas à démolir, on cherche à flatter. Et on frappe avec une image.'));
    s.appendChild(el('p', 'g__hint', 'Je tire la personne au sort et je pose le cadre — tous les mots de la punchline, c’est vous qui les écrivez.'));

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
    if (config.indice) s.appendChild(el('p', 'g__hint', config.indice));

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
      aide: 'Un adjectif mélioratif — donc positif — celui qui ' + (feminin ? 'la' : 'le') + ' décrit le mieux.',
      indice: 'On flatte, on ne démolit pas : cherchez ce qu’' + (feminin ? 'elle' : 'il') + ' a de meilleur.',
      label: 'La qualité',
      id: 'battle-qualite',
      placeholder: feminin ? EXEMPLES_F : EXEMPLES_M,
      bouton: 'Continuer',
      erreur: 'Écrivez un adjectif positif pour continuer.',
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
      aide: 'Cherchez une chose que tout le monde connaît et qui possède cette qualité.',
      indice: 'C’est elle qui rendra le compliment imparable.',
      label: "L'image",
      id: 'battle-image',
      placeholder: 'Ex. le soleil…',
      bouton: 'Continuer',
      erreur: 'Écrivez une image pour continuer.',
      // « comme » seul donnerait « brillant comme comme ».
      verifier: function (valeur) {
        return /^comme\s*$/i.test(valeur)
          ? 'Écrivez la chose elle-même : « le soleil », « une montagne »…'
          : null;
      },
      valider: function (valeur) {
        state.image = valeur;
        show(screenAssemblage);
      }
    });
  }

  /* ----------------------------------------------------------------------
     Étape 4 — l'assemblage
     Le verbe et le mot de comparaison manquent volontairement : ce sont eux
     qui transforment trois mots en phrase, et c'est au joueur de les poser.
     ---------------------------------------------------------------------- */

  /** Un petit champ libellé, pour tenir deux saisies côte à côte. */
  function petitChamp(id, libelle, exemple) {
    var bloc = el('div', 'g__field');
    var lab = el('label', 'g__field-label', libelle);
    lab.setAttribute('for', id);
    bloc.appendChild(lab);

    var input = document.createElement('input');
    input.type = 'text';
    input.id = id;
    input.className = 'g__input';
    input.placeholder = exemple;
    input.enterKeyHint = 'next';
    input.maxLength = 24;
    bloc.appendChild(input);
    return { bloc: bloc, input: input };
  }

  function screenAssemblage() {
    var personne = state.personne && state.personne.t;
    if (!personne || !state.qualite || !state.image) return screenIntro();

    var s = el('div', 'g');
    s.appendChild(el('p', 'g__eyebrow', 'Étape 4 · l’assemblage'));
    s.appendChild(el('h3', 'g__title', 'Reliez vos trois mots.'));
    s.appendChild(el('p', 'g__text', 'Il manque deux mots : le verbe, et celui qui compare. Je ne les écris pas à votre place.'));
    var exemple = el('p', 'g__hint');
    exemple.appendChild(document.createTextNode('Par exemple : Zidane '));
    exemple.appendChild(el('b', null, 'est'));
    exemple.appendChild(document.createTextNode(' brillant '));
    exemple.appendChild(el('b', null, 'comme'));
    exemple.appendChild(document.createTextNode(' le soleil.'));
    s.appendChild(exemple);

    /* L'aperçu se remplit à mesure qu'on tape : on voit la phrase venir. */
    var apercu = el('p', 'g__apercu');
    var trouVerbe = el('span', 'g__apercu-trou is-vide', 'verbe');
    var trouLien = el('span', 'g__apercu-trou is-vide', 'comparaison');
    apercu.appendChild(el('span', 'g__apercu-mot', personne));
    apercu.appendChild(document.createTextNode(' '));
    apercu.appendChild(trouVerbe);
    apercu.appendChild(document.createTextNode(' '));
    apercu.appendChild(el('span', 'g__apercu-mot', state.qualite));
    apercu.appendChild(document.createTextNode(' '));
    apercu.appendChild(trouLien);
    apercu.appendChild(document.createTextNode(' '));
    apercu.appendChild(el('span', 'g__apercu-mot', state.image.replace(/^comme\s+/i, '')));
    s.appendChild(apercu);

    var form = el('form', 'g__form g__form--stack');
    form.setAttribute('autocomplete', 'off');

    var verbe = petitChamp('battle-verbe', 'Le verbe', 'Ex. est, brille, avance…');
    var lien = petitChamp('battle-lien', 'Le mot de comparaison', 'Ex. comme, tel, autant que…');

    var paire = el('div', 'g__pair');
    paire.appendChild(verbe.bloc);
    paire.appendChild(lien.bloc);
    form.appendChild(paire);

    var send = el('button', 'g__btn g__btn--send', 'Créer ma punchline');
    send.type = 'submit';
    send.appendChild(el('span', 'arrow', '→'));
    form.appendChild(send);
    s.appendChild(form);

    var flash = el('p', 'g__flash');
    flash.setAttribute('role', 'status');
    s.appendChild(flash);

    function refleter(input, trou, defaut) {
      var mot = nettoyer(input.value);
      trou.textContent = mot || defaut;
      trou.classList.toggle('is-vide', !mot);
    }
    verbe.input.addEventListener('input', function () { refleter(verbe.input, trouVerbe, 'verbe'); });
    lien.input.addEventListener('input', function () { refleter(lien.input, trouLien, 'comparaison'); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = nettoyer(verbe.input.value);
      var l = nettoyer(lien.input.value);
      if (!v) {
        flash.textContent = 'Écrivez le verbe qui relie les deux : est, brille, avance…';
        flash.className = 'g__flash is-ko';
        verbe.input.focus();
        return;
      }
      if (!l) {
        flash.textContent = 'Écrivez le mot de comparaison : comme, tel, autant que…';
        flash.className = 'g__flash is-ko';
        lien.input.focus();
        return;
      }
      state.verbe = v;
      state.lien = l;
      show(screenResultat);
    });

    setTimeout(function () { verbe.input.focus(); }, reduced ? 0 : 280);
    return s;
  }

  function screenResultat() {
    var phrase = composer();
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

    var resultat = el('p', 'g__result g__result--reveal');
    s.appendChild(resultat);

    var suite = el('div', 'g__after');
    suite.hidden = true;
    suite.appendChild(el('p', 'g__text g__text--strong', 'Vous venez de construire une punchline.'));
    suite.appendChild(el('p', 'g__text', 'La technique tient en quatre temps : partir d’une qualité positive, chercher une image que tout le monde comprend, poser le verbe, puis choisir le mot qui compare. C’est tout, et ça marche à chaque fois.'));
    suite.appendChild(el('p', 'g__text g__text--strong', 'Imaginez maintenant un groupe entier en train d’en fabriquer.'));

    var cta = el('a', 'g__btn g__btn--cta', 'Découvrir le battle de compliments');
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
    state.verbe = '';
    state.lien = '';
    show(screenIntro);
  }

  var dialog = document.getElementById('play-battle');
  if (dialog) dialog.addEventListener('close', reset);

  reset();
})();
