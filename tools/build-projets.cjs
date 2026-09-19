/**
 * Génère « Les derniers projets » : la page d'index et une page par récit.
 *
 *   node tools/build-projets.cjs
 *
 * Chaque récit sort à l'adresse projet-<slug>.html, avec son propre titre, sa
 * propre description, son fil d'Ariane et son JSON-LD : c'est une page qui se
 * référence seule. La date sert au tri (du plus récent au plus ancien) et n'est
 * jamais affichée au visiteur.
 *
 * Champs d'un article :
 *   slug      adresse du récit, en minuscules et tirets
 *   ordre     entier décroissant : 100 = le plus récent. Sert au tri seul.
 *   h1        le titre affiché en haut de la page
 *   seo       le <title> de la page, plus court et plus explicite
 *   meta      la meta description
 *   chapo     les premières phrases : accroche de l'article et texte de la carte
 *   lieu      « Collège Untel, Ville » — affiché dans l'en-tête
 *   publics   « Élèves de 4e », « Jeunes suivis par la Mission locale »…
 *   format    « Projet de 20 h, restitution publique »
 *   atelier   slam | rap | eloquence | battle  (donne la couleur de la carte)
 *   motCle    le mot-clé principal visé
 *   secondes  les mots-clés secondaires
 *   images    { principale, deux, trois } — { src, alt, legende }
 *   corps     une suite de blocs : voir bloc() plus bas
 */
const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const index = readFileSync(join(root, 'index.html'), 'utf8');
const toHome = (h) => h.replace(/href="#(?!top\b|main\b)([a-z0-9-]+)"/g, 'href="index.html#$1"');
const v = (index.match(/style\.css\?v=(\d+)/) || [, '1'])[1];

const SITE = 'https://slamesope.fr/';

const header = toHome(index.slice(index.indexOf('<a class="skip-link"'), index.indexOf('<main id="main">')));
const footer = toHome(index.slice(index.indexOf('<!-- ================= MODULE 9 — PIED DE PAGE NOIR')))
  .replace(/app\.js\?v=\d+/, `app.js?v=${v}`);

const COULEUR = { slam: 'turquoise', rap: 'periwinkle', eloquence: 'green', battle: 'magenta' };
const NOM = { slam: 'Slam', rap: 'Rap', eloquence: 'Éloquence', battle: 'Battle de compliments' };
/* Le filtre n'affiche que les ateliers réellement racontés : inutile de
   proposer « Éloquence » tant qu'aucun récit ne porte ce tag. */
const ORDRE_TAGS = ['slam', 'battle', 'eloquence', 'rap'];
/* La couleur d'une carte peut être forcée : deux récits du même atelier se
   suivent souvent, et deux cartes identiques côte à côte font terne. */
const teinteDe = (a) => a.teinte || COULEUR[a.atelier] || 'yellow';

/* -------------------------------------------------------------------------
   Les récits, du plus récent au plus ancien (champ « ordre »).
   ------------------------------------------------------------------------- */
const ARTICLES = require('./data-projets.cjs');
const VILLES = require('./data-villes.cjs');

/* Le lieu du récit devient un lien vers la page de ville quand il en existe
   une. C'est de là que cette page tire l'essentiel de ses liens entrants : un
   lien contextuel depuis un contenu qui parle du même territoire vaut mieux
   qu'une entrée de menu, et la page de ville reste hors navigation. */
const lienLieu = (lieu) => {
  const v = VILLES.find((ville) => ville.communes.some((c) => lieu.includes(c)));
  return v ? `<a href="${v.file}">${ech(lieu)}</a>` : ech(lieu);
};

/* ------------------------------------------------------------------------- */

const ech = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/* Les paragraphes portent des liens : on n'échappe que les guillemets doubles
   des attributs déjà écrits à la main, donc rien. Ils sont relus à la main. */
const tries = ARTICLES.slice().sort((a, b) => b.ordre - a.ordre);

const page = ({ titre, desc, corps, jsonld, canonical, ogImage }) => `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${ech(titre)}</title>
<meta name="description" content="${ech(desc)}">
<meta name="author" content="Esope">
<meta name="theme-color" content="#fdc837">
<link rel="canonical" href="${SITE}${canonical}">
<meta property="og:type" content="article">
<meta property="og:title" content="${ech(titre)}">
<meta property="og:description" content="${ech(desc)}">
<meta property="og:url" content="${SITE}${canonical}">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="Esope — ateliers slam et oralité">${ogImage ? `
<meta property="og:image" content="${SITE}assets/img/blog/${ogImage}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%23fdc837'/%3E%3C/svg%3E">
<link rel="stylesheet" href="assets/css/style.css?v=${v}">
<script type="application/ld+json">${jsonld}</script>
</head>
<body>

${header}<main id="main">
<span id="top"></span>
${corps}
</main>

${footer}`;

/* --- La carte, commune à l'index et au bas des articles ------------------- */
/* Même dessin que les cartes de presse : titre, premières phrases, appel.
   Les pastilles en tête servent de repère visuel et de prise pour le filtre
   de la page d'index — data-tags porte les mêmes valeurs pour le script. */
const carte = (a) => `
      <a class="projet band--${teinteDe(a)}" href="projet-${a.slug}.html" data-tags="${a.tags.join(' ')}">
        <span class="projet__tags">${a.tags.map((t) => `<span class="projet__tag">${NOM[t]}</span>`).join('')}</span>
        <span class="projet__titre">${ech(a.h1)}</span>
        <span class="projet__chapo">${ech(a.chapo)}</span>
        <span class="projet__foot">
          <span class="projet__cta">Lire l’article <span class="arrow" aria-hidden="true">→</span></span>
        </span>
      </a>`;

/* --- Les blocs du corps d'un article ------------------------------------- */

const figure = (img, grande) => img ? `
  <figure class="illus${grande ? ' illus--large' : ''}">
    <img src="assets/img/blog/${img.src}" alt="${ech(img.alt)}" width="480" height="360"
         loading="lazy" decoding="async">${img.legende ? `
    <figcaption>${ech(img.legende)}</figcaption>` : ''}
  </figure>` : '';

const bloc = (a, [type, val], compteur) => {
  if (type === 'h2') return `\n  <h2 class="h3">${ech(val)}</h2>`;
  if (type === 'p') return `\n  <p>${val}</p>`;
  if (type === 'ul') return `\n  <ul class="liste">${val.map((li) => `\n    <li>${li}</li>`).join('')}\n  </ul>`;
  if (type === 'img') return figure(a.images[val]);
  if (type === 'expert') return `
  <aside class="expert band--yellow">
    <p class="expert__eyebrow">Le point de l’intervenant</p>
    <h2 class="h4">${ech(val.titre)}</h2>
    <div class="faq" style="margin-top:18px">${val.qr.map(([q, r], i) => {
      const id = `${a.slug}-q${compteur + i}`;
      return `
      <div class="faq__item">
        <h3><button class="faq__q" type="button" aria-expanded="false" aria-controls="${id}">
          ${ech(q)}<span class="faq__icon" aria-hidden="true">+</span></button></h3>
        <div class="faq__a" id="${id}"><div><p>${ech(r)}</p></div></div>
      </div>`;
    }).join('')}
    </div>
  </aside>`;
  return '';
};

/* --- La page d'index ---------------------------------------------------- */

const metaIndex = "Le journal de bord des interventions d'Esope : ateliers slam, rap, éloquence et battle de compliments menés dans les collèges, les structures jeunesse et les établissements partenaires.";

writeFileSync(join(root, 'projets.html'), page({
  titre: 'Les derniers projets — ateliers slam, rap et éloquence sur le terrain',
  desc: metaIndex,
  canonical: 'projets.html',
  jsonld: JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Blog',
    name: 'Les derniers projets — Esope', description: metaIndex,
    url: SITE + 'projets.html', inLanguage: 'fr',
    author: { '@type': 'Person', name: 'Esope' },
    blogPost: tries.map((a) => ({
      '@type': 'BlogPosting', headline: a.h1,
      url: SITE + 'projet-' + a.slug + '.html', description: a.chapo,
      author: { '@type': 'Person', name: 'Esope' },
    })),
  }),
  corps: `
<section class="wrap" style="padding-block:clamp(24px,5vw,40px) clamp(20px,4vw,28px)">
  <a class="crumb" href="index.html"><span class="arrow" aria-hidden="true">←</span> Retour à l'accueil</a>
  <div class="center" style="margin-top:clamp(18px,3vw,26px)">
    <h1 class="h2" style="max-width:22ch;margin-inline:auto">Les derniers projets</h1>
    <p class="lead mute" style="margin-top:16px">Le journal de bord des interventions d'Esope</p>
  </div>
</section>

<section class="section section--close wrap">
  <div class="filtres" role="group" aria-label="Filtrer par atelier" data-filtres>
    <button class="filtre is-actif" type="button" data-filtre="tous" aria-pressed="true">Tous</button>${ORDRE_TAGS
      .filter((t) => tries.some((a) => a.tags.includes(t)))
      .map((t) => `
    <button class="filtre" type="button" data-filtre="${t}" aria-pressed="false">${NOM[t]}</button>`).join('')}
  </div>

  <div class="projets" data-paginate style="margin-top:clamp(24px,3.6vw,32px)">${tries.map(carte).join('')}
  </div>
  <button class="voirplus" type="button" data-voirplus hidden>
    Voir plus <span class="voirplus__chevron" aria-hidden="true"></span>
  </button>
</section>
`,
}));
console.log('→ projets.html  (' + tries.length + ' articles)');

/* --- Une page par récit -------------------------------------------------- */

tries.forEach((a, i) => {
  const voisins = tries.filter((_, j) => j !== i).slice(0, 3);
  let q = 1;
  const corpsHtml = a.corps.map((b) => {
    const html = bloc(a, b, q);
    if (b[0] === 'expert') q += b[1].qr.length;
    return html;
  }).join('');

  const faqs = a.corps.filter((b) => b[0] === 'expert')
    .reduce((acc, b) => acc.concat(b[1].qr), []);

  // Le stock des trente-six illustrations Blog est épuisé : un récit peut
  // désormais n'en porter aucune. L'emplacement reste alors simplement vide.
  const imgPrincipale = a.images && a.images.principale;

  const jsonld = [{
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: a.h1, description: a.chapo, inLanguage: 'fr',
    url: SITE + 'projet-' + a.slug + '.html',
    mainEntityOfPage: { '@type': 'WebPage', '@id': SITE + 'projet-' + a.slug + '.html' },
    ...(imgPrincipale ? { image: SITE + 'assets/img/blog/' + imgPrincipale.src } : {}),
    keywords: [a.motCle].concat(a.secondes || []).join(', '),
    author: { '@type': 'Person', name: 'Esope' },
    creator: { '@type': 'Person', name: 'Esope' },
    publisher: { '@type': 'Person', name: 'Esope' },
    contentLocation: { '@type': 'Place', name: a.lieu },
    isPartOf: { '@type': 'Blog', name: 'Les derniers projets — Esope', url: SITE + 'projets.html' },
  }, {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Les derniers projets', item: SITE + 'projets.html' },
      { '@type': 'ListItem', position: 3, name: a.h1, item: SITE + 'projet-' + a.slug + '.html' },
    ],
  }];
  if (faqs.length) jsonld.push({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(([q2, r]) => ({
      '@type': 'Question', name: q2,
      acceptedAnswer: { '@type': 'Answer', text: r },
    })),
  });

  writeFileSync(join(root, 'projet-' + a.slug + '.html'), page({
    titre: a.seo,
    desc: a.meta,
    canonical: 'projet-' + a.slug + '.html',
    ogImage: imgPrincipale ? imgPrincipale.src : undefined,
    jsonld: JSON.stringify(jsonld),
    corps: `
<nav class="fil wrap" aria-label="Fil d'Ariane">
  <a href="index.html">Accueil</a> <span aria-hidden="true">/</span>
  <a href="projets.html">Les derniers projets</a> <span aria-hidden="true">/</span>
  <span aria-current="page">${ech(a.h1)}</span>
</nav>

<article class="article wrap">
  <header class="article__tete band--${teinteDe(a)}">
    <h1>${ech(a.h1)}</h1>
    <p class="article__chapo">${ech(a.chapo)}</p>
    <dl class="article__meta">
      <div><dt>Lieu</dt><dd>${lienLieu(a.lieu)}</dd></div>
      <div><dt>Public</dt><dd>${ech(a.publics)}</dd></div>
      <div><dt>Intervention</dt><dd>${ech(a.format)}</dd></div>
    </dl>
    <p class="article__signature">Auteur : Esope · Intervenants slam : Esope</p>
  </header>
${figure(imgPrincipale, true)}

  <div class="article__corps">${corpsHtml}
  </div>
</article>

<section class="section section--close wrap center">
  <div class="def def--yellow def--centre" data-reveal style="max-width:820px;margin-inline:auto">
    <h2 class="h3">Vous souhaitez imaginer un projet similaire ?</h2>
    <p style="margin-inline:auto;margin-top:14px">Esope conçoit des ateliers de slam, d'écriture,
      de poésie, de rap et d'éloquence adaptés aux publics, aux objectifs et au contexte de chaque
      structure.</p>
    <div class="btn-row btn-row--center" style="margin-top:clamp(20px,3vw,28px)">
      <a class="btn btn--ink" href="index.html#contact">Construire mon projet</a>
    </div>
  </div>
</section>
${voisins.length ? `
<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(24px,5vw,36px)"><h2 class="h2">Les autres projets</h2></div>
  <div class="projets" data-stagger>${voisins.map(carte).join('')}
  </div>
</section>` : ''}
`,
  }));
  console.log('→ projet-' + a.slug + '.html');
});

/* Le sitemap est produit à part : voir tools/build-sitemap.cjs. */
