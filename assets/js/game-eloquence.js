/* ==========================================================================
   Démo 03 — 60 secondes d'éloquence
   Un sujet tiré selon la tranche d'âge, soixante secondes de parole, puis une
   auto-évaluation qui déclenche des techniques adaptées aux réponses.
   Aucune note, aucun jugement : le participant s'évalue lui-même.
   ========================================================================== */

(function () {
  'use strict';

  var host = document.querySelector('#play-eloquence .play__body');
  if (!host) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------------
     Contenu — modifiable sans toucher à la mécanique
     ---------------------------------------------------------------------- */

  var AGE_GROUPS = [
    { id: '5-10', label: '5–10 ans', note: 'Imaginaire et concret' },
    { id: '10-15', label: '10–15 ans', note: 'Leur quotidien' },
    { id: '15-20', label: '15–20 ans', note: 'Sujets argumentatifs' },
    { id: '20+', label: '20 ans et +', note: 'Questions ouvertes' }
  ];

  var TOPICS = {
    '5-10': [
      'Si tu pouvais voler', 'Ton animal préféré', 'Faut-il avoir un super-pouvoir ?',
      'Ton meilleur souvenir', 'Une journée sans école', 'Si les animaux pouvaient parler',
      'Ton métier de rêve', 'Pourquoi faut-il avoir des amis ?', 'La chose qui te fait rire',
      'Si tu pouvais inventer une planète', 'Ton jeu préféré',
      'Est-ce que les adultes ont toujours raison ?', 'Une invention que tu aimerais créer',
      'Ton héros préféré', 'Si tu pouvais changer une règle du monde'
    ],
    '10-15': [
      'Les réseaux sociaux', 'Faut-il toujours dire la vérité ?',
      'Peut-on être populaire sans être heureux ?', "L'amitié", 'Les jeux vidéo',
      "Le téléphone à l'école", 'Faut-il avoir peur du regard des autres ?', 'Être différent',
      "L'intelligence artificielle", 'La liberté', 'Le collège', 'Les influenceurs',
      'Faut-il toujours écouter ses parents ?', 'Peut-on vivre sans téléphone ?',
      "Qu'est-ce qu'un vrai ami ?", 'La réussite'
    ],
    '15-20': [
      'Peut-on réussir sans diplôme ?', 'Les réseaux sociaux nous rapprochent-ils vraiment ?',
      "Faut-il avoir peur de l'intelligence artificielle ?", "La liberté d'expression",
      'Peut-on changer le monde à son échelle ?', "L'argent fait-il le bonheur ?",
      'Faut-il suivre sa passion ?', 'Le regard des autres', "L'échec", 'La réussite',
      'Le travail', 'Les études', "L'amour", 'La confiance en soi',
      'Faut-il toujours défendre ses convictions ?', 'La place des jeunes dans la société'
    ],
    '20+': [
      "Qu'est-ce qu'une vie réussie ?", 'Peut-on changer de vie ?',
      "L'argent fait-il le bonheur ?", 'Faut-il toujours dire ce que l’on pense ?',
      'Peut-on être libre sans contraintes ?', 'Le travail donne-t-il du sens à la vie ?',
      'Faut-il avoir peur de vieillir ?', 'Peut-on vivre sans regret ?',
      'Sommes-nous vraiment maîtres de notre temps ?',
      'La réussite est-elle personnelle ou collective ?', 'Peut-on être heureux sans réussir ?',
      'Faut-il toujours défendre ses convictions ?', 'Le monde va-t-il trop vite ?',
      "Qu'est-ce qu'être courageux ?", 'Peut-on recommencer sa vie ?', "L'ambition"
    ]
  };

  /* Chaque critère : un identifiant de technique, une question, trois réponses.
     La première réponse est celle qui n'appelle pas de technique. */
  var CRITERIA = {
    '5-10': [
      ['hold', "J'ai réussi à parler longtemps", ['Oui, facilement', 'Oui, avec des pauses', "Non, c'était dur"]],
      ['ideas', "J'ai eu plein d'idées", ['Oui', 'Quelques-unes', 'Pas beaucoup']],
      ['examples', "J'ai raconté quelque chose", ['Oui', 'Un peu', 'Pas vraiment']],
      ['voice', "J'ai parlé assez fort", ['Oui', 'Un peu', 'Pas vraiment']],
      ['gaze', "J'ai regardé devant moi", ['Oui', 'Un peu', 'Pas vraiment']],
      ['blocks', "J'ai continué même quand je ne savais plus quoi dire", ['Oui', 'Quelques fois', 'Non']]
    ],
    '10-15': [
      ['hold', "J'ai tenu les 60 secondes", ['Oui, facilement', "Oui, avec quelques blancs", "Non, j'ai manqué d'idées"]],
      ['topic', 'Je suis resté sur le sujet', ['Oui', 'La plupart du temps', 'Je me suis éloigné']],
      ['repeat', 'Je me suis répété', ['Peu', 'Par moments', 'Beaucoup']],
      ['blocks', "J'ai eu des blocages", ['Non', 'Quelques fois', 'Souvent']],
      ['structure', "J'ai structuré mes idées", ['Oui', 'Un peu', 'Pas vraiment']],
      ['examples', "J'ai donné des exemples", ['Oui', 'Quelques-uns', 'Pas vraiment']],
      ['variation', "J'ai varié ma façon de parler", ['Oui', 'Un peu', 'Pas encore']]
    ],
    '15-20': [
      ['hold', "J'ai tenu les 60 secondes", ['Oui, facilement', 'Oui, avec quelques blancs', "Non, j'ai manqué d'idées"]],
      ['hook', "J'ai soigné mon accroche", ['Oui', 'Un peu', "J'ai démarré au hasard"]],
      ['topic', 'Je suis resté sur le sujet', ['Oui', 'La plupart du temps', 'Je me suis éloigné']],
      ['structure', 'Mon discours avait un début et une fin', ['Oui', 'Un peu', 'Pas vraiment']],
      ['argue', "J'ai argumenté mes idées", ['Oui', 'Un peu', 'Pas vraiment']],
      ['examples', "J'ai illustré par des exemples", ['Oui', 'Quelques-uns', 'Pas vraiment']],
      ['repeat', 'Je me suis répété', ['Peu', 'Par moments', 'Beaucoup']],
      ['variation', "J'ai varié mon rythme et mes pauses", ['Oui', 'Un peu', 'Pas encore']]
    ],
    '20+': [
      ['hold', "J'ai tenu les 60 secondes", ['Oui, facilement', 'Oui, avec quelques blancs', "Non, j'ai manqué d'idées"]],
      ['clarity', "Mon propos était clair dès les premiers mots", ['Oui', 'Un peu', 'Pas vraiment']],
      ['structure', 'Mes idées étaient structurées', ['Oui', 'Un peu', 'Pas vraiment']],
      ['argue', "J'ai argumenté plutôt qu'affirmé", ['Oui', 'Un peu', 'Pas vraiment']],
      ['examples', "J'ai illustré par des exemples", ['Oui', 'Quelques-uns', 'Pas vraiment']],
      ['repeat', 'Je me suis répété', ['Peu', 'Par moments', 'Beaucoup']],
      ['variation', "J'ai joué du rythme et des silences", ['Oui', 'Un peu', 'Pas encore']],
      ['ending', "J'ai conclu au lieu de m'arrêter", ['Oui', 'Un peu', 'Pas vraiment']]
    ]
  };

  /* Points forts affichés quand la première réponse est choisie. */
  var STRENGTHS = {
    hold: ['Vous tenez votre parole.', 'Soixante secondes sur un sujet imposé, sans abandonner.'],
    ideas: ['Vous trouvez des idées.', 'La matière vient sans que vous ayez à la chercher longtemps.'],
    topic: ['Vous tenez votre cap.', 'Vous êtes resté dans le sujet du début à la fin.'],
    repeat: ['Vous vous renouvelez.', 'Vous avancez au lieu de tourner autour de la même idée.'],
    blocks: ['Vous encaissez le vide.', 'Les silences ne vous ont pas fait dérailler.'],
    structure: ['Vous construisez.', 'Votre propos avait un début, un milieu et une fin.'],
    argue: ['Vous argumentez.', 'Vous expliquez vos idées au lieu de seulement les affirmer.'],
    examples: ['Vous illustrez.', 'Vos idées s\u2019appuient sur du concret, c\u2019est ce qui les rend mémorables.'],
    variation: ['Vous jouez de votre voix.', 'Le rythme et les pauses font partie de votre discours.'],
    voice: ['Vous vous faites entendre.', 'Votre voix porte : c\u2019est la première marche.'],
    gaze: ['Vous regardez devant.', 'Le regard, c\u2019est la moitié de la présence.'],
    hook: ['Vous savez démarrer.', 'Une accroche travaillée, et la salle est avec vous.'],
    clarity: ['Vous êtes clair.', 'On sait où vous allez dès les premiers mots.'],
    ending: ['Vous savez conclure.', 'Vous terminez au lieu de vous arrêter : c\u2019est rare.']
  };

  /* Techniques déclenchées par les réponses 2 et 3. */
  var TECHNIQUES = {
    hold: ['La règle des 3', 'Quand vous ne savez plus quoi dire, cherchez trois angles : ce que j\u2019en pense, pourquoi je le pense, un exemple.'],
    ideas: ['La règle des 3', 'Trois choses à dire sur n\u2019importe quoi : ce que j\u2019en pense, pourquoi, et une fois où ça m\u2019est arrivé.'],
    topic: ['Le mot pilote', 'Gardez le thème en tête comme un fil conducteur. Chaque nouvelle idée doit pouvoir s\u2019y rattacher.'],
    repeat: ['Changez d\u2019angle', 'Une fois l\u2019idée donnée, demandez-vous : qu\u2019est-ce que je pourrais dire de complètement différent ?'],
    blocks: ['La pause', 'Un silence n\u2019est pas un échec. Respirez une seconde, puis repartez avec « ce que je veux dire, c\u2019est… »'],
    structure: ['Les trois temps', 'Mon idée, pourquoi, mon exemple. Puis terminez par « donc, pour moi… »'],
    argue: ['Pourquoi ?', 'Après chaque idée, posez-vous la question : pourquoi ? Puis répondez : parce que… Ça oblige à développer.'],
    examples: ['Racontez', 'Quand vous affirmez quelque chose, cherchez une situation réelle qui le montre.'],
    variation: ['Le mot important', 'Choisissez un mot qui compte dans votre phrase. Ralentissez. Faites une pause avant. Appuyez dessus.'],
    voice: ['Le fond de la salle', 'Parlez à quelqu\u2019un qui serait tout au fond. Votre voix monte toute seule.'],
    gaze: ['Trois points', 'Choisissez trois endroits dans la pièce et passez de l\u2019un à l\u2019autre. Ça évite de fixer ses chaussures.'],
    hook: ['La première phrase', 'Préparez seulement votre première phrase : une question, un chiffre, une image. Le reste suit.'],
    clarity: ['Annoncez', 'Dites en une phrase ce que vous allez défendre. Ensuite seulement, développez.'],
    ending: ['La dernière phrase', 'Gardez une phrase pour la fin et prononcez-la plus lentement. On retient surtout la sortie.']
  };

  var SPEAK_SECONDS = 60;

  /* ----------------------------------------------------------------------
     Outils
     ---------------------------------------------------------------------- */

  function pick(list, avoid) {
    if (!Array.isArray(list) || !list.length) return '';
    if (list.length === 1) return list[0];
    var value = avoid;
    while (value === avoid) value = list[Math.floor(Math.random() * list.length)];
    return value;
  }

  /* Typographie française : une espace fine insécable avant ? ! : ; et à
     l'intérieur des guillemets, sinon la ponctuation passe seule à la ligne. */
  function typo(texte) {
    return String(texte)
      .replace(/ ([?!:;»])/g, '\u202f$1')
      .replace(/« /g, '\u00ab\u202f');
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = typo(text);
    return node;
  }

  /* ----------------------------------------------------------------------
     État
     ---------------------------------------------------------------------- */

  var state = { age: null, topic: '', answers: {}, timerId: null, rollId: null };

  function clearTimers() {
    if (state.timerId) { clearInterval(state.timerId); state.timerId = null; }
    if (state.rollId) { clearTimeout(state.rollId); state.rollId = null; }
  }

  /* On reçoit le constructeur d'écran, pas l'écran : appelé avec show(build()),
     l'écran armait son minuteur AVANT que clearTimers() ne le supprime. */
  function show(build) {
    clearTimers();
    var node = build();
    host.replaceChildren(node);
    if (!reduced) {
      node.animate(
        [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
        { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );
    }
  }

  /* ----------------------------------------------------------------------
     Écrans
     ---------------------------------------------------------------------- */

  function screenIntro() {
    var s = el('div', 'g');
    s.appendChild(el('p', 'g__eyebrow', 'En trois étapes'));
    s.appendChild(el('h3', 'g__title', 'Un sujet tiré au sort, 60 secondes pour en parler.'));
    s.appendChild(el('p', 'g__text', 'Rien à écrire ici : on parle à voix haute. Vous choisissez l’âge, je choisis le sujet.'));

    var go = el('button', 'g__btn', 'Commencer');
    go.type = 'button';
    go.appendChild(el('span', 'arrow', '→'));
    go.addEventListener('click', function () { show(screenAge); });
    s.appendChild(go);
    return s;
  }

  function screenAge() {
    var s = el('div', 'g');
    s.appendChild(el('p', 'g__eyebrow', 'Étape 1 sur 3'));
    s.appendChild(el('h3', 'g__title', 'Le sujet sera pour quel âge ?'));

    var grid = el('div', 'g__choices');
    AGE_GROUPS.forEach(function (group) {
      var card = el('button', 'g__choice');
      card.type = 'button';
      card.appendChild(el('b', null, group.label));
      card.appendChild(el('small', null, group.note));
      card.addEventListener('click', function () {
        if (card.disabled) return;
        Array.prototype.forEach.call(grid.children, function (other) {
          other.disabled = true;
          other.classList.toggle('is-picked', other === card);
        });
        state.age = group.id;
        state.answers = {};
        setTimeout(function () { show(screenDraw); }, reduced ? 0 : 340);
      });
      grid.appendChild(card);
    });
    s.appendChild(grid);
    return s;
  }

  function screenDraw() {
    var list = TOPICS[state.age] || [];
    var finalTopic = pick(list, '');
    // Sécurité : jamais d'écran vide si une liste venait à manquer.
    state.topic = finalTopic || 'Le sujet de votre choix';

    var s = el('div', 'g g--center');
    s.appendChild(el('p', 'g__eyebrow', 'Étape 2 sur 3'));
    s.appendChild(el('h3', 'g__title g__title--sm', 'Je tire votre sujet au sort.'));
    var slot = el('p', 'g__slot', list[0] || state.topic);
    s.appendChild(slot);

    var after = el('div', 'g__after');
    after.hidden = true;
    after.appendChild(el('p', 'g__text', 'À vous : 60 secondes, à voix haute.'));
    var go = el('button', 'g__btn', 'Je relève le défi');
    go.type = 'button';
    go.appendChild(el('span', 'arrow', '→'));
    go.addEventListener('click', function () { show(screenCountdown); });
    after.appendChild(go);
    s.appendChild(after);

    // Roulette : on décélère jusqu'au sujet déjà choisi, jamais de valeur vide.
    // Décélération calibrée pour atterrir en ~1,4 s : assez pour voir défiler,
    // assez court pour ne pas faire attendre.
    var delay = reduced ? 0 : 50;
    var steps = reduced ? 0 : 14;
    var i = 0;
    // On garde la valeur brute à part : le texte affiché porte des espaces
    // fines, il ne se compare plus aux entrées de la liste.
    var affiche = list[0] || state.topic;
    function roll() {
      if (i >= steps) {
        slot.textContent = typo(state.topic);
        slot.classList.add('is-locked');
        after.hidden = false;
        return;
      }
      affiche = pick(list, affiche) || state.topic;
      slot.textContent = typo(affiche);
      i += 1;
      delay = delay * 1.10;
      state.rollId = setTimeout(roll, delay);
    }
    if (reduced) {
      slot.textContent = typo(state.topic);
      slot.classList.add('is-locked');
      after.hidden = false;
    } else {
      state.rollId = setTimeout(roll, delay);
    }
    return s;
  }

  function screenCountdown() {
    var s = el('div', 'g g--center');
    s.appendChild(el('p', 'g__eyebrow', state.topic));
    var count = el('p', 'g__count', '3');
    s.appendChild(count);

    var values = ['3', '2', '1', 'Parlez.'];
    var i = 0;
    state.timerId = setInterval(function () {
      i += 1;
      if (i >= values.length) {
        clearTimers();
        show(screenSpeak);
        return;
      }
      count.textContent = values[i];
      count.classList.toggle('g__count--go', values[i] === 'Parlez.');
      if (!reduced) {
        count.animate([{ transform: 'scale(0.7)', opacity: 0 }, { transform: 'none', opacity: 1 }],
          { duration: 300, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      }
    }, reduced ? 350 : 800);
    return s;
  }

  function screenSpeak() {
    var s = el('div', 'g g--center g--speak');
    s.appendChild(el('p', 'g__eyebrow', 'Votre sujet'));
    s.appendChild(el('h3', 'g__topic', state.topic));

    var ring = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ring.setAttribute('viewBox', '0 0 120 120');
    ring.setAttribute('class', 'g__ring');
    ring.setAttribute('aria-hidden', 'true');
    var track = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    track.setAttribute('cx', '60'); track.setAttribute('cy', '60'); track.setAttribute('r', '52');
    track.setAttribute('class', 'g__ring-track');
    var run = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    run.setAttribute('cx', '60'); run.setAttribute('cy', '60'); run.setAttribute('r', '52');
    run.setAttribute('class', 'g__ring-run');
    var circumference = 2 * Math.PI * 52;
    run.style.strokeDasharray = circumference;
    run.style.strokeDashoffset = '0';
    ring.appendChild(track); ring.appendChild(run);

    var wrap = el('div', 'g__clock');
    wrap.appendChild(ring);
    var value = el('span', 'g__clock-value', String(SPEAK_SECONDS));
    value.setAttribute('role', 'timer');
    wrap.appendChild(value);
    s.appendChild(wrap);

    s.appendChild(el('p', 'g__text', 'Parlez jusqu’à la fin du chrono.'));

    var skip = el('button', 'g__link', 'J’ai fini');
    skip.type = 'button';
    skip.addEventListener('click', function () { show(screenQuiz); });
    s.appendChild(skip);

    var left = SPEAK_SECONDS;
    state.timerId = setInterval(function () {
      left -= 1;
      if (left <= 0) {
        clearTimers();
        value.textContent = '0';
        run.style.strokeDashoffset = String(circumference);
        show(screenDone);
        return;
      }
      value.textContent = String(left);
      run.style.strokeDashoffset = String(circumference * (1 - left / SPEAK_SECONDS));
    }, 1000);

    return s;
  }

  function screenDone() {
    var s = el('div', 'g g--center');
    s.appendChild(el('p', 'g__eyebrow', 'Temps écoulé'));
    s.appendChild(el('h3', 'g__title', 'Vous venez de tenir 60 secondes sur un sujet imposé.'));
    s.appendChild(el('p', 'g__text', 'Étape 3 : regardons comment ça s’est passé.'));

    var go = el('button', 'g__btn', 'Comment ça s’est passé ?');
    go.type = 'button';
    go.appendChild(el('span', 'arrow', '→'));
    go.addEventListener('click', function () { show(screenQuiz); });
    s.appendChild(go);
    return s;
  }

  function screenQuiz() {
    var list = CRITERIA[state.age] || CRITERIA['15-20'];
    var s = el('div', 'g');
    s.appendChild(el('p', 'g__eyebrow', 'Étape 3 sur 3'));
    s.appendChild(el('h3', 'g__title', 'Comment ça s’est passé, pour vous ?'));
    s.appendChild(el('p', 'g__text', 'Pas de bonne réponse : ce sont vos réponses qui choisissent les techniques que je vous montre après.'));

    var form = el('div', 'g__quiz');
    list.forEach(function (item, index) {
      var key = item[0], question = item[1], options = item[2];
      var row = el('div', 'g__q');
      row.appendChild(el('p', 'g__q-label', question));
      var opts = el('div', 'g__opts');
      options.forEach(function (label, level) {
        var opt = el('button', 'g__opt', label);
        opt.type = 'button';
        opt.addEventListener('click', function () {
          Array.prototype.forEach.call(opts.children, function (other) {
            other.classList.toggle('is-on', other === opt);
          });
          state.answers[key] = level;
          update();
        });
        opts.appendChild(opt);
      });
      row.appendChild(opts);
      form.appendChild(row);
      row.dataset.index = String(index);
    });
    s.appendChild(form);

    var go = el('button', 'g__btn', 'Voir mon profil');
    go.type = 'button';
    go.disabled = true;
    go.appendChild(el('span', 'arrow', '→'));
    go.addEventListener('click', function () {
      if (go.disabled) return;
      show(screenProfile);
    });
    s.appendChild(go);

    var hint = el('p', 'g__hint', '');
    s.appendChild(hint);

    function update() {
      var answered = Object.keys(state.answers).length;
      var total = list.length;
      go.disabled = answered < total;
      // À zéro, on explique pourquoi le bouton est grisé ; ensuite, on compte.
      hint.textContent = answered >= total ? ''
        : answered === 0 ? 'Répondez aux ' + total + ' questions pour voir votre profil.'
        : answered + ' sur ' + total;
    }
    update();
    return s;
  }

  function screenProfile() {
    var list = CRITERIA[state.age] || CRITERIA['15-20'];
    var strong = [];
    var work = [];

    list.forEach(function (item) {
      var key = item[0];
      var level = state.answers[key];
      if (level === 0 && STRENGTHS[key]) strong.push(STRENGTHS[key]);
      else if (level > 0 && TECHNIQUES[key]) work.push({ key: key, level: level, tech: TECHNIQUES[key] });
    });

    // Les pistes les plus marquées d'abord, trois au maximum : une liste
    // interminable décourage au lieu d'aider.
    work.sort(function (a, b) { return b.level - a.level; });
    work = work.slice(0, 3);

    var s = el('div', 'g');
    s.appendChild(el('p', 'g__eyebrow', 'Votre profil d’éloquence'));

    if (strong.length) {
      s.appendChild(el('h3', 'g__title', 'Ce sur quoi vous pouvez compter'));
      var ups = el('div', 'g__strengths');
      strong.slice(0, 3).forEach(function (pair) {
        var card = el('div', 'g__strength');
        card.appendChild(el('b', null, pair[0]));
        card.appendChild(el('span', null, pair[1]));
        ups.appendChild(card);
      });
      s.appendChild(ups);
    } else {
      s.appendChild(el('h3', 'g__title', 'Vous avez tenu soixante secondes sur un sujet imposé.'));
      s.appendChild(el('p', 'g__text', 'C’est exactement l’exercice. Le reste se travaille, et voilà par où commencer.'));
    }

    if (work.length) {
      s.appendChild(el('p', 'g__eyebrow g__eyebrow--sep', work.length > 1 ? 'Vos pistes de progression' : 'Votre piste de progression'));
      var techs = el('div', 'g__techs');
      work.forEach(function (entry) {
        var card = el('div', 'g__tech');
        card.appendChild(el('p', 'g__tech-label', 'Technique'));
        card.appendChild(el('b', null, entry.tech[0]));
        card.appendChild(el('span', null, entry.tech[1]));
        techs.appendChild(card);
      });
      s.appendChild(techs);
    } else {
      s.appendChild(el('p', 'g__eyebrow g__eyebrow--sep', 'Pour aller plus loin'));
      var extra = el('div', 'g__techs');
      var card = el('div', 'g__tech');
      card.appendChild(el('p', 'g__tech-label', 'Technique'));
      card.appendChild(el('b', null, TECHNIQUES.variation[0]));
      card.appendChild(el('span', null, TECHNIQUES.variation[1]));
      extra.appendChild(card);
      s.appendChild(extra);
    }

    var outro = el('div', 'g__outro');
    outro.appendChild(el('p', 'g__text', 'En atelier, on va plus loin : trouver ses idées, structurer son discours, travailler sa voix, et oser devant les autres.'));
    outro.appendChild(el('p', 'g__text g__text--strong', 'Imaginez maintenant votre groupe relever le même défi.'));

    var cta = el('a', 'g__btn g__btn--cta', 'Découvrir l’atelier éloquence');
    cta.href = 'atelier-eloquence.html';
    cta.appendChild(el('span', 'arrow', '→'));
    outro.appendChild(cta);

    var again = el('button', 'g__link', 'Rejouer ↻');
    again.type = 'button';
    again.addEventListener('click', reset);
    outro.appendChild(again);

    s.appendChild(outro);
    return s;
  }

  /* ----------------------------------------------------------------------
     Cycle de vie
     ---------------------------------------------------------------------- */

  function reset() {
    clearTimers();
    state.age = null;
    state.topic = '';
    state.answers = {};
    show(screenIntro);
  }

  var dialog = document.getElementById('play-eloquence');
  if (dialog) {
    // Le chrono ne doit jamais continuer derrière une fenêtre fermée.
    dialog.addEventListener('close', clearTimers);
  }

  reset();
})();
