/**
 * Génère demo.html : l'intro de la page et les quatre bornes de jeu.
 * Réutilise le header, les fenêtres et le pied de page de index.html.
 *
 *   node tools/build-demo.cjs
 */
const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const index = readFileSync(join(root, 'index.html'), 'utf8');
const toHome = (h) => h.replace(/href="#(?!top\b|main\b)([a-z0-9-]+)"/g, 'href="index.html#$1"');
const v = (index.match(/style\.css\?v=(\d+)/) || [, '1'])[1];

const header = toHome(index.slice(index.indexOf('<a class="skip-link"'), index.indexOf('<main id="main">')));
const footer = toHome(index.slice(index.indexOf('<!-- ================= PARCOURS — fenêtre')))
  .replace(/app\.js\?v=\d+/, `app.js?v=${v}`);

/* Chaque emblème est dessiné dans la même grammaire : traits épais d'encre,
   une seule idée par jeu, un seul élément animé au survol. */
const EMBLEMS = {
  slam: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="30" cy="38" r="20" data-stroke/>
        <path d="M74 20 l18 36 -36 0 z" data-stroke class="cab__spark"/>
        <path d="M16 80 c10 -10 20 10 30 0 s20 -10 30 0 s20 10 28 0" data-stroke/>
        <path d="M16 98 c10 -10 20 10 30 0 s20 -10 30 0 s20 10 28 0" data-stroke/>
      </svg>`,
  battle: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M6 20 l26 40 -26 40" data-stroke/>
        <path d="M114 20 l-26 40 26 40" data-stroke/>
        <path d="M64 12 l-20 44 18 0 -12 56 32 -50 -18 0 16 -50 z" data-fill class="cab__spark"/>
      </svg>`,
  eloquence: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <g class="cab__waves">
          <circle cx="60" cy="52" r="32" data-stroke opacity="0.55"/>
          <circle cx="60" cy="52" r="46" data-stroke opacity="0.28"/>
        </g>
        <rect x="47" y="14" width="26" height="46" rx="13" data-fill class="cab__spark"/>
        <path d="M34 54 a26 26 0 0 0 52 0" data-stroke/>
        <path d="M60 80 v18 M42 104 h36" data-stroke/>
      </svg>`,
  rap: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <g class="cab__bars">
          <rect x="10" y="40" width="14" height="52" rx="7" data-fill/>
          <rect x="34" y="20" width="14" height="72" rx="7" data-fill/>
          <rect x="58" y="48" width="14" height="44" rx="7" data-fill/>
          <rect x="82" y="12" width="14" height="80" rx="7" data-fill/>
          <rect x="106" y="56" width="10" height="36" rx="5" data-fill/>
        </g>
        <path d="M10 106 h44 M66 106 h44" data-stroke stroke-width="5"/>
      </svg>`,
};

const GAMES = [
  { key: 'slam', num: '01', tag: 'Slam',
    title: 'Écrire une métaphore',
    sub: 'Un verbe, un sujet tiré au sort et la poésie se crée.',
    soon: "Un exercice d'association : deux mots que rien ne rapproche, et une phrase qui les relie." },
  { key: 'battle', num: '02', tag: 'Battle de compliments',
    title: 'Faire des punchlines',
    sub: 'Je tire au sort quelqu\'un et vous lui envoyez une punchline.',
    soon: "Une qualité, une image connue de tous, et la punchline se construit toute seule." },
  { key: 'eloquence', num: '03', tag: 'Éloquence',
    title: "S'essayer au discours",
    sub: 'Je tire un sujet au sort. 60 secondes pour en parler.',
    soon: "Une prise de parole minutée, avec la contrainte qui oblige à structurer." },
  { key: 'rap', num: '04', tag: 'Rap',
    title: 'Trouver des rimes',
    sub: 'Combien de rimes pouvez-vous trouver en 60 secondes ?',
    soon: "Un mot à faire rimer, un compte à rebours, et la liste qui s'allonge." },
];

const cards = GAMES.map((g) => `
      <button class="cab cab--${g.key}" type="button" id="demo-${g.key}" data-play="${g.key}"
              aria-haspopup="dialog" aria-controls="play-${g.key}">
        <span class="cab__top">
          <span class="cab__num" aria-hidden="true">${g.num}</span>
          <span class="cab__tag">${g.tag}</span>
        </span>
        <span class="cab__emblem" aria-hidden="true">${EMBLEMS[g.key]}
        </span>
        <span class="cab__body">
          <span class="cab__title">${g.title}</span>
          <span class="cab__sub">${g.sub}</span>
          <span class="cab__play">Jouer <span class="arrow" aria-hidden="true">→</span></span>
        </span>
      </button>`).join('');

const dialogs = GAMES.map((g) => `
<dialog class="play" id="play-${g.key}" aria-labelledby="play-${g.key}-title">
  <div class="play__head play__head--${g.key}">
    <div>
      <p class="play__label">Démo ${g.num} · ${g.tag}</p>
      <h2 class="play__title" id="play-${g.key}-title">${g.title}</h2>
    </div>
    <button class="play__close" type="button" data-play-close aria-label="Fermer le jeu">
      <span aria-hidden="true"></span><span aria-hidden="true"></span>
    </button>
  </div>
  <!-- Rempli par assets/js/game-<jeu>.js ; sans script, l'écran reste vide. -->
  <div class="play__body"></div>
</dialog>`).join('\n');

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Démo en ligne — Esope</title>
<meta name="description" content="Quatre exercices d'atelier à essayer directement : métaphore, punchline, discours et rimes. Un aperçu concret de ce qui se passe en salle.">
<meta name="theme-color" content="#fdc837">
<meta property="og:type" content="article">
<meta property="og:title" content="Démo en ligne — Esope">
<meta property="og:description" content="Quatre exercices d'atelier à essayer directement dans le navigateur.">
<meta property="og:locale" content="fr_FR">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%23fdc837'/%3E%3C/svg%3E">
<link rel="stylesheet" href="assets/css/style.css?v=${v}">
<link rel="stylesheet" href="assets/css/arcade.css?v=${v}">
</head>
<body>

${header}<main id="main">
<span id="top"></span>

<section class="wrap" style="padding-block:clamp(24px,5vw,40px) clamp(20px,4vw,28px)">
  <a class="crumb" href="index.html"><span class="arrow" aria-hidden="true">←</span> Retour à l'accueil</a>
  <div class="center" style="margin-top:clamp(18px,3vw,26px)">
    <h1 class="h2" style="max-width:22ch;margin-inline:auto">4 exercices qu'Esope peut faire en atelier</h1>
    <p class="lead mute" style="margin-top:16px">Essayez maintenant !</p>
  </div>
</section>

<section class="section section--close wrap">
  <div class="arcade" data-stagger>${cards}
  </div>
</section>

<section class="section section--close wrap center">
  <div class="measure" data-reveal>
    <h2 class="h2">Et avec un groupe, c'est autre chose</h2>
    <p class="lead mute" style="margin-top:24px">Ce que vous venez d'essayer seul prend une tout
      autre dimension à vingt-cinq, avec le rire, l'émulation et le passage devant les autres.
      Décrivez-moi votre contexte, je réponds sous 48 h.</p>
    <div class="btn-row btn-row--center" style="margin-top:32px">
      <a class="btn btn--yellow" href="index.html#contact">Construire votre projet</a>
      <a class="btn btn--link" href="assets/docs/dossier-esope.pdf" download>Télécharger le dossier <span class="arrow" aria-hidden="true">↓</span></a>
    </div>
  </div>
</section>

</main>
${dialogs}

${footer.replace(
  '</body>',
  '<script src="assets/js/arcade.js?v=' + v + '" defer></script>\n' +
  '<script src="assets/js/game-eloquence.js?v=' + v + '" defer></script>\n' +
  '<script src="assets/js/game-rap.js?v=' + v + '" defer></script>\n' +
  '<script src="assets/js/game-slam.js?v=' + v + '" defer></script>\n' +
  '<script src="assets/js/game-battle.js?v=' + v + '" defer></script>\n</body>'
)}`;

writeFileSync(join(root, 'demo.html'), html);
console.log('→ demo.html');
