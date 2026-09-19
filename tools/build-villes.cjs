/**
 * Génère les pages de ville.
 *
 *   node tools/build-villes.cjs
 *
 * Ces pages ne figurent volontairement dans aucun menu : elles répondent à une
 * requête locale (« ateliers slam à Bordeaux ») sans alourdir une navigation
 * déjà dense. Elles restent indexables, et surtout reliées — une page sans lien
 * entrant n'est pas seulement invisible pour le visiteur, elle ne se classe
 * pas. Les liens entrants sont posés par build-projets.cjs, qui transforme le
 * lieu de chaque récit girondin en lien vers la page de ville, et par
 * build-pages.cjs sur la page atelier slam.
 *
 * Les récits et les chiffres sont calculés depuis data-projets.cjs : la page ne
 * peut pas prétendre à plus que ce qui existe réellement.
 */
const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const index = readFileSync(join(root, 'index.html'), 'utf8');

const between = (start, end) => index.slice(index.indexOf(start), index.indexOf(end));
const toHome = (html) =>
  html.replace(/href="#(?!top)/g, 'href="index.html#').replace(/href="index\.html#top"/g, 'href="#top"');

const assetVersion = (index.match(/style\.css\?v=(\d+)/) || [, '1'])[1];
const header = toHome(between('<a class="skip-link"', '<main id="main">'));
const footer = toHome(index.slice(index.indexOf('<!-- ================= MODULE 9 — PIED DE PAGE NOIR')));

const PROJETS = require('./data-projets.cjs');
const VILLES = require('./data-villes.cjs');
const ech = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const ATELIERS = {
  slam: ['Ateliers slam', 'atelier-slam.html', 'turquoise', 'Écrire un texte, le dire debout.'],
  rap: ['Ateliers rap', 'atelier-rap.html', 'periwinkle', 'Du texte au clip vidéo.'],
  eloquence: ['Ateliers éloquence', 'atelier-eloquence.html', 'green', 'Prise de parole et grand oral.'],
  battle: ['Battle de compliments', 'atelier-battle.html', 'magenta', 'Une joute verbale flatteuse.'],
};

const PUBLICS = [
  ['Éducation nationale', 'public-education-nationale.html', 'Primaire, collège, lycée.'],
  ['Structures jeunesse', 'public-structures-jeunesse.html', 'MJC, centres sociaux, dispositifs.'],
  ['Santé et médico-social', 'public-sante-medico-social.html', 'Hôpitaux, IME, foyers d’accueil.'],
];

/* Un récit appartient au cœur de cible si son lieu nomme l'une des communes,
   au second cercle s'il nomme le département. */
const dansVille = (a, v) => v.communes.some((c) => a.lieu.includes(c));
const dansRayon = (a, v) => !dansVille(a, v) &&
  (a.lieu.includes(v.departement) || v.rayon.some((c) => a.lieu.includes(c)));

for (const v of VILLES) {
  const coeur = PROJETS.filter((a) => dansVille(a, v));
  const autour = PROJETS.filter((a) => dansRayon(a, v));
  const locaux = coeur.concat(autour);
  const slug = v.file.replace('.html', '');

  const carte = (a) => `
      <a class="recit" href="projet-${a.slug}.html">
        <span class="recit__corps">
          <span class="recit__titre">${ech(a.h1)}</span>
          <span class="recit__chapo">${ech(a.chapo)}</span>
        </span>
        <span class="recit__cta">Lire le récit <span class="arrow" aria-hidden="true">→</span></span>
      </a>`;

  /* Quatre encarts, quatre grappes de mots-clés distinctes : le type
     d'établissement, le métier, le territoire, le format. Ils sont lus tôt dans
     la page et servent autant au visiteur pressé qu'au référencement. */
  const facts = v.facts.map(([k, t]) => `
      <div class="fact"><b>${k}</b><span>${t}</span></div>`).join('');

  const lieux = v.lieux.items.map(([nom, quoi]) => `
      <div class="goal"><em aria-hidden="true"></em><b>${ech(nom)}</b><span>${ech(quoi)}</span></div>`).join('');

  const ateliers = Object.keys(ATELIERS).map((k) => {
    const [nom, file, color, note] = ATELIERS[k];
    return `
      <a class="related__item band--${color}" href="${file}">
        <span><b>${nom}</b><small>${note}</small></span>
        <span class="arrow" aria-hidden="true">→</span>
      </a>`;
  }).join('');

  const publics = PUBLICS.map(([nom, file, note]) => `
      <a class="related__item" href="${file}">
        <span><b>${nom}</b><small>${note}</small></span>
        <span class="arrow" aria-hidden="true">→</span>
      </a>`).join('');

  const faq = v.faq.map(([q, r], i) => `
      <div class="faq__item">
        <h3><button class="faq__q" type="button" aria-expanded="false" aria-controls="${slug}-faq-${i + 1}">
          ${q}<span class="faq__icon" aria-hidden="true">+</span></button></h3>
        <div class="faq__a" id="${slug}-faq-${i + 1}"><div><p>${r}</p></div></div>
      </div>`).join('');

  const preuves = v.preuves.items.map(([media, titre, lieu, url]) => `
      <a class="relais" href="${url}" target="_blank" rel="noopener">
        <span class="relais__nom">${ech(media)} · ${ech(lieu)}</span>
        <span class="relais__titre">${ech(titre)} <span class="arrow" aria-hidden="true">↗</span></span>
      </a>`).join('');

  const img = (cle, classe) => {
    const i = v.images[cle];
    return `
  <figure class="illus${classe}">
    <img src="assets/img/${i.src}" alt="${ech(i.alt)}" loading="lazy" decoding="async">${i.legende ? `
    <figcaption>${ech(i.legende)}</figcaption>` : ''}
  </figure>`;
  };

  const url = `https://slamesope.fr/${v.file}`;
  const jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://slamesope.fr/' },
          { '@type': 'ListItem', position: 2, name: 'Ateliers slam', item: 'https://slamesope.fr/atelier-slam.html' },
          { '@type': 'ListItem', position: 3, name: v.title, item: url },
        ],
      },
      {
        /* Service plutôt que LocalBusiness : il n'y a ni adresse d'accueil ni
           horaires d'ouverture, et déclarer un commerce local qui n'existe pas
           est le genre de balisage que Google finit par retenir contre le site. */
        '@type': 'Service',
        name: v.title,
        serviceType: 'Atelier d’écriture et d’oralité',
        description: v.meta,
        url,
        provider: {
          '@type': 'Person',
          name: 'Esope',
          jobTitle: 'Slameur, intervenant artistique et pédagogique',
          award: ['Champion de France de Slam', 'Champion Sud-Ouest de Slam'],
          email: 'slampoetrip@gmail.com',
        },
        areaServed: [
          { '@type': 'City', name: v.ville },
          { '@type': 'AdministrativeArea', name: v.departement },
        ],
        audience: {
          '@type': 'Audience',
          audienceType: 'Établissements scolaires, structures jeunesse, structures de santé et médico-sociales',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: v.faq.map(([q, r]) => ({
          '@type': 'Question', name: q,
          acceptedAnswer: { '@type': 'Answer', text: r },
        })),
      },
    ],
  });

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${v.seoTitle}</title>
<meta name="description" content="${v.meta}">
<meta name="author" content="Esope">
<meta name="theme-color" content="#fdc837">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${v.seoTitle}">
<meta property="og:description" content="${v.meta}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="fr_FR">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%23fdc837'/%3E%3C/svg%3E">
<link rel="stylesheet" href="assets/css/style.css?v=${assetVersion}">
<script type="application/ld+json">${jsonld}</script>
</head>
<body>

${header}<main id="main">
<span id="top"></span>

<section class="page-hero wrap">
  <a class="crumb" href="atelier-slam.html"><span class="arrow" aria-hidden="true">←</span> Les ateliers slam</a>
  <div class="page-hero__band band--${v.color}">
    <svg class="scribbles" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
      <path d="M-20 70 C120 10 260 130 420 50 M-20 200 C100 150 300 260 420 190 M90 -20 C120 120 60 200 130 320 M300 -20 C280 110 350 190 300 320"/>
    </svg>
    <span class="page-hero__watermark" aria-hidden="true">${v.watermark}</span>
    <div class="page-hero__inner">
      <h1>${v.title}</h1>
      <p>${v.baseline}</p>
      <div class="btn-row">
        <a class="btn btn--ink" href="index.html#contact">Construire votre projet</a>
        <a class="btn btn--link" href="index.html#dossier">Le dossier en PDF <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </div>
  <p class="body-lg mute lede" data-reveal>${v.intro}</p>
</section>

<section class="section section--close wrap">
  <div class="facts" data-stagger>${facts}
  </div>
</section>

<section class="section section--close wrap">
  <div class="measure" data-reveal>
    <h2 class="h2">${v.ancrage.titre}</h2>
${v.ancrage.paragraphes.map((t) => `    <p class="body-lg mute" style="margin-top:20px">${t}</p>`).join('\n')}
  </div>
${img('hero', ' illus--large')}
</section>

<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(24px,5vw,36px)">
    <h2 class="h2">${v.lieux.titre}</h2>
  </div>
  <div class="goals" data-stagger>${lieux}
  </div>
</section>

<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(24px,5vw,36px)">
    <h2 class="h2">Les quatre ateliers, à ${v.ville} comme ailleurs</h2>
  </div>
  <div class="related related--pair" data-stagger>${ateliers}
  </div>
${img('atelier', '')}
</section>

<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(24px,5vw,36px)">
    <h2 class="h2">Avec qui je travaille à ${v.ville}</h2>
  </div>
  <div class="related" data-stagger>${publics}
  </div>
</section>

<section class="section section--close wrap" id="faq">
  <div data-reveal style="margin-bottom:clamp(20px,4vw,32px)">
    <h2 class="h2">Questions fréquentes sur les ateliers slam à ${v.ville}</h2>
  </div>
  <div class="faq" data-stagger>${faq}
  </div>
</section>
${coeur.length ? `
<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(20px,3.4vw,28px)">
    <p class="eyebrow">Sur le terrain</p>
    <h2 class="h2">Mes projets à ${v.ville} et dans la métropole</h2>
  </div>
  <div class="recits" data-stagger>${coeur.map(carte).join('')}
  </div>
</section>` : ''}
${autour.length ? `
<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(20px,3.4vw,28px)">
    <h2 class="h2">Et ailleurs en ${v.departement}</h2>
  </div>
  <div class="recits" data-stagger>${autour.map(carte).join('')}
  </div>
</section>` : ''}

<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(20px,3.4vw,28px)">
    <h2 class="h2">${v.preuves.titre}</h2>
  </div>
  <div class="relais-liste" data-stagger>${preuves}
  </div>
  <div data-reveal style="margin-top:clamp(20px,3vw,28px)">
    <a class="btn btn--link" href="temoignages.html">Toute la revue de presse <span class="arrow" aria-hidden="true">→</span></a>
  </div>
</section>

<section class="section section--close wrap center">
  <div class="measure" data-reveal>
    <h2 class="h2">Un projet à ${v.ville} ou en ${v.departement} ?</h2>
    <p class="lead mute" style="margin-top:24px">Atelier slam en collège, en lycée, en structure
      jeunesse ou en établissement médico-social : décrivez-moi votre groupe, votre créneau et la
      période visée. Je réponds avec une proposition adaptée.</p>
    <div class="btn-row btn-row--center" style="margin-top:32px">
      <a class="btn btn--yellow" href="index.html#contact">Construire votre projet</a>
      <a class="btn btn--link" href="projets.html">Voir tous les projets <span class="arrow" aria-hidden="true">→</span></a>
    </div>
  </div>
</section>

</main>

${footer.replace(/app\.js\?v=\d+/, `app.js?v=${assetVersion}`)}`;

  writeFileSync(join(root, v.file), html);
  console.log(`→ ${v.file}  (${coeur.length} récits au cœur, ${autour.length} alentour)`);
}
