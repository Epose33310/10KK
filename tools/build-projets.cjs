/**
 * Génère « Les derniers projets » : la page d'index et une page par récit.
 *
 *   node tools/build-projets.cjs
 *
 * Pour ajouter un projet, poser un objet de plus dans ARTICLES et relancer.
 * Chaque récit sort à l'adresse projet-<slug>.html, avec son propre titre, sa
 * propre description et son JSON-LD : c'est une page qui se référence seule.
 *
 * Champs :
 *   slug      adresse du récit, en minuscules et tirets
 *   titre     le titre de la page, celui qui porte les mots-clés
 *   date      AAAA-MM-JJ, sert au tri et à l'affichage
 *   lieu      « Collège Untel, Ville » — affiché tel quel
 *   atelier   slam | rap | eloquence | battle  (donne la couleur)
 *   cles      les mots-clés visés, pour mémoire et pour les meta
 *   chapo     deux phrases, reprises sur la carte et en description
 *   photo     nom d'un fichier de assets/img, ou null
 *   corps     [[titre de section, paragraphe], …]
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

const COULEUR = { slam: 'turquoise', rap: 'periwinkle', eloquence: 'green', battle: 'magenta' };
const NOM = { slam: 'Slam', rap: 'Rap', eloquence: 'Éloquence', battle: 'Battle de compliments' };

/* -------------------------------------------------------------------------
   Les récits. Vide pour l'instant : le premier projet raconté viendra ici.
   ------------------------------------------------------------------------- */
const ARTICLES = [];

/* ------------------------------------------------------------------------- */

const ech = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
              'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const enLettres = (iso) => {
  const [a, m, j] = iso.split('-').map(Number);
  return `${j} ${MOIS[m - 1]} ${a}`;
};

const tries = ARTICLES.slice().sort((a, b) => b.date.localeCompare(a.date));

const page = ({ titre, desc, corps, jsonld, seo }) => `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${ech(seo || titre)}</title>
<meta name="description" content="${ech(desc)}">
<meta name="author" content="Esope">
<meta name="theme-color" content="#fdc837">
<meta property="og:type" content="article">
<meta property="og:title" content="${ech(seo || titre)}">
<meta property="og:description" content="${ech(desc)}">
<meta property="og:locale" content="fr_FR">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%23fdc837'/%3E%3C/svg%3E">
<link rel="stylesheet" href="assets/css/style.css?v=${v}">
${jsonld ? `<script type="application/ld+json">${jsonld}</script>` : ''}
</head>
<body>

${header}<main id="main">
<span id="top"></span>
${corps}
</main>

${footer}`;

/* --- La page d'index ---------------------------------------------------- */

const carte = (a) => `
      <a class="projet band--${COULEUR[a.atelier] || 'yellow'}" href="projet-${a.slug}.html">
        <span class="projet__top">
          <span class="projet__date">${enLettres(a.date)}</span>
          <span class="projet__tag">${NOM[a.atelier] || 'Atelier'}</span>
        </span>
        <span class="projet__titre">${ech(a.titre)}</span>
        <span class="projet__chapo">${ech(a.chapo)}</span>
        <span class="projet__foot">
          <span class="projet__lieu">${ech(a.lieu)}</span>
          <span class="projet__cta">Lire le récit <span class="arrow" aria-hidden="true">→</span></span>
        </span>
      </a>`;

const vide = `
  <div class="def def--neutre center" data-reveal style="max-width:720px;margin-inline:auto">
    <h3>Les premiers récits arrivent</h3>
    <p style="margin-inline:auto">Chaque projet mené donnera lieu à un compte rendu : ce qu'on a
      écrit, comment le groupe s'en est emparé, et ce qu'il en reste. Le carnet s'ouvre avec la
      prochaine intervention.</p>
    <div class="btn-row btn-row--center" style="margin-top:clamp(20px,3vw,28px)">
      <a class="btn btn--yellow" href="index.html#contact">Construire votre projet</a>
    </div>
  </div>`;

const metaIndex = "Le carnet de bord des ateliers d'Esope : comptes rendus d'interventions slam, rap, éloquence et battle de compliments menées dans les collèges, lycées et structures.";

writeFileSync(join(root, 'projets.html'), page({
  titre: 'Les derniers projets',
  seo: "Les derniers projets — ateliers slam, rap et éloquence menés sur le terrain",
  desc: metaIndex,
  jsonld: JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Blog',
    name: 'Les derniers projets — Esope', description: metaIndex,
    inLanguage: 'fr',
    author: { '@type': 'Person', name: 'Esope' },
    blogPost: tries.map((a) => ({
      '@type': 'BlogPosting', headline: a.titre, datePublished: a.date,
      url: 'projet-' + a.slug + '.html', description: a.chapo,
    })),
  }),
  corps: `
<section class="page-hero wrap">
  <a class="crumb" href="index.html"><span class="arrow" aria-hidden="true">←</span> Retour à l'accueil</a>
  <div class="page-hero__band band--yellow">
    <svg class="scribbles" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
      <path d="M-20 70 C120 10 260 130 420 50 M-20 200 C100 150 300 260 420 190 M90 -20 C120 120 60 200 130 320 M300 -20 C280 110 350 190 300 320"/>
    </svg>
    <span class="page-hero__watermark" aria-hidden="true">Carnet</span>
    <div class="page-hero__inner">
      <h1>Les derniers projets</h1>
      <p>Le carnet de bord des ateliers : ce qu'on a écrit, comment le groupe s'en est emparé,
        et ce qu'il en reste une fois la scène démontée.</p>
      <div class="btn-row">
        <a class="btn btn--ink" href="index.html#contact">Je construis un projet</a>
        <a class="btn btn--link" href="temoignages.html">Témoignages &amp; médias <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </div>
</section>

<section class="section section--close wrap">
${tries.length ? `  <div class="projets" data-stagger>${tries.map(carte).join('')}
  </div>` : vide}
</section>
`,
}));
console.log('→ projets.html  (' + tries.length + ' récit' + (tries.length > 1 ? 's' : '') + ')');

/* --- Une page par récit -------------------------------------------------- */

tries.forEach((a, i) => {
  const voisins = tries.filter((_, j) => j !== i).slice(0, 2);
  const corpsHtml = a.corps.map(([t, p]) => `
    <h2 class="h4" style="margin-top:clamp(28px,4vw,40px)">${ech(t)}</h2>
    <p class="body-lg mute" style="margin-top:12px">${ech(p)}</p>`).join('');

  writeFileSync(join(root, 'projet-' + a.slug + '.html'), page({
    titre: a.titre,
    desc: a.chapo,
    jsonld: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'BlogPosting',
      headline: a.titre, description: a.chapo, datePublished: a.date, inLanguage: 'fr',
      keywords: (a.cles || []).join(', '),
      author: { '@type': 'Person', name: 'Esope' },
      publisher: { '@type': 'Person', name: 'Esope' },
      contentLocation: { '@type': 'Place', name: a.lieu },
    }),
    corps: `
<section class="page-hero wrap">
  <a class="crumb" href="projets.html"><span class="arrow" aria-hidden="true">←</span> Tous les projets</a>
  <div class="page-hero__band band--${COULEUR[a.atelier] || 'yellow'}">
    <svg class="scribbles" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
      <path d="M-20 70 C120 10 260 130 420 50 M-20 200 C100 150 300 260 420 190 M90 -20 C120 120 60 200 130 320 M300 -20 C280 110 350 190 300 320"/>
    </svg>
    <div class="page-hero__inner">
      <p class="eyebrow">${enLettres(a.date)} · ${ech(a.lieu)}</p>
      <h1>${ech(a.titre)}</h1>
      <p>${ech(a.chapo)}</p>
    </div>
  </div>
</section>

<section class="section section--close wrap">
  <div class="measure-wide" style="margin-inline:auto" data-reveal>${corpsHtml}
  </div>
</section>
${a.photo ? `
<section class="section section--close wrap">
  <figure class="shot" data-reveal>
    <img src="assets/img/${a.photo}" alt="${ech(a.titre)}" loading="lazy">
  </figure>
</section>` : ''}
${voisins.length ? `
<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(24px,5vw,36px)"><h2 class="h2">Les autres projets</h2></div>
  <div class="projets" data-stagger>${voisins.map(carte).join('')}
  </div>
</section>` : ''}

<section class="section section--close wrap center">
  <div class="measure" data-reveal>
    <h2 class="h2">Un projet comme celui-ci, chez vous ?</h2>
    <p class="lead mute" style="margin-top:24px">Décrivez-moi votre contexte et votre public :
      je réponds sous 48 h avec un déroulé et un devis.</p>
    <div class="btn-row btn-row--center" style="margin-top:32px">
      <a class="btn btn--yellow" href="index.html#contact">Je construis un projet</a>
    </div>
  </div>
</section>
`,
  }));
  console.log('→ projet-' + a.slug + '.html');
});
