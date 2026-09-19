/**
 * Génère les pages de territoire : France, départements, villes.
 *
 *   node tools/build-territoires.cjs
 *
 * Ces pages ne figurent dans aucun menu : elles répondent à des requêtes
 * géographiques sans alourdir une navigation déjà dense. Elles restent
 * indexables, et surtout reliées — une page sans lien entrant n'est pas
 * seulement invisible pour le visiteur, elle ne se classe pas.
 *
 * Le maillage se fait en pyramide, dans les deux sens :
 *   France ↔ départements ↔ villes ↔ récits
 * Les liens montants viennent d'ici, les liens descendants aussi ; les récits
 * sont raccrochés par build-projets.cjs, qui transforme le lieu de chaque récit
 * en lien vers le territoire qui le couvre.
 *
 * Tout ce qui se compte — récits, communes, formats d'atelier — est dérivé de
 * data-projets.cjs : une page ne peut pas revendiquer plus qu'il n'existe.
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
const TERRITOIRES = require('./data-territoires.cjs');
const { DEPARTEMENTS } = TERRITOIRES;
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

const dansCommunes = (a, communes) => communes.some((c) => a.lieu.includes(c));

for (const t of TERRITOIRES) {
  const estFrance = t.niveau === 'france';

  /* Le cœur de cible, et pour une ville le second cercle affiché à part —
     mélanger les deux laisserait croire à une présence qui n'existe pas. */
  const coeur = estFrance ? PROJETS : PROJETS.filter((a) => dansCommunes(a, t.communes));
  const autour = t.rayon ? PROJETS.filter((a) => !dansCommunes(a, t.communes) && dansCommunes(a, t.rayon)) : [];
  const slug = t.file.replace('.html', '');

  const carte = (a) => `
      <a class="recit" href="projet-${a.slug}.html">
        <span class="recit__corps">
          <span class="recit__titre">${ech(a.h1)}</span>
          <span class="recit__chapo">${ech(a.chapo)}</span>
        </span>
        <span class="recit__cta">Lire le récit <span class="arrow" aria-hidden="true">→</span></span>
      </a>`;

  const facts = t.facts.map(([k, texte]) => `
      <div class="fact"><b>${k}</b><span>${texte}</span></div>`).join('');

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

  const faq = t.faq.map(([q, r], i) => `
      <div class="faq__item">
        <h3><button class="faq__q" type="button" aria-expanded="false" aria-controls="${slug}-faq-${i + 1}">
          ${q}<span class="faq__icon" aria-hidden="true">+</span></button></h3>
        <div class="faq__a" id="${slug}-faq-${i + 1}"><div><p>${r}</p></div></div>
      </div>`).join('');

  /* Page France : un bloc par département, avec ses communes réelles et ses
     récits. Les départements sans page à eux sont couverts ici — c'est leur
     seule place légitime tant qu'un seul projet s'y est déroulé. */
  const departements = estFrance ? DEPARTEMENTS.map((d) => {
    const r = PROJETS.filter((a) => dansCommunes(a, d.communes));
    const communes = [...new Set(d.communes.filter((c) => PROJETS.some((a) => a.lieu.includes(c))))];
    const compte = `${r.length} projet${r.length > 1 ? 's' : ''} raconté${r.length > 1 ? 's' : ''}`;
    const corps = `<b>${d.nom}</b><small>${communes.join(', ')} — ${compte}</small>`;
    return d.file ? `
      <a class="related__item" href="${d.file}">
        <span>${corps}</span>
        <span class="arrow" aria-hidden="true">→</span>
      </a>` : `
      <a class="related__item" href="projet-${r[0].slug}.html">
        <span>${corps}</span>
        <span class="arrow" aria-hidden="true">→</span>
      </a>`;
  }).join('') : '';

  /* Liens descendants d'un département vers ses villes, montants d'une ville
     vers son département : la pyramide se parcourt dans les deux sens. */
  const villesLiees = (t.villesLiees || []).map((file) => {
    const v = TERRITOIRES.find((x) => x.file === file);
    return `
      <a class="related__item band--${v.color}" href="${v.file}">
        <span><b>${v.title}</b><small>${v.communes.slice(0, 4).join(', ')}…</small></span>
        <span class="arrow" aria-hidden="true">→</span>
      </a>`;
  }).join('');

  const lieux = t.lieux ? t.lieux.items.map(([nom, quoi]) => `
      <div class="goal"><em aria-hidden="true"></em><b>${ech(nom)}</b><span>${ech(quoi)}</span></div>`).join('') : '';

  const preuves = t.preuves ? t.preuves.items.map(([media, titre, lieu, url]) => `
      <a class="relais" href="${url}" target="_blank" rel="noopener">
        <span class="relais__nom">${ech(media)} · ${ech(lieu)}</span>
        <span class="relais__titre">${ech(titre)} <span class="arrow" aria-hidden="true">↗</span></span>
      </a>`).join('') : '';

  const img = (cle, classe) => {
    const i = t.images[cle];
    if (!i) return '';
    return `
  <figure class="illus${classe}">
    <img src="assets/img/${i.src}" alt="${ech(i.alt)}" loading="lazy" decoding="async">${i.legende ? `
    <figcaption>${ech(i.legende)}</figcaption>` : ''}
  </figure>`;
  };

  /* Fil d'Ariane : chaque niveau remonte au précédent, ce qui donne aussi à
     Google la hiérarchie du maillage. */
  const parent = t.niveau === 'ville' && t.departementFile
    ? { file: t.departementFile, nom: TERRITOIRES.find((x) => x.file === t.departementFile).title }
    : t.niveau === 'departement'
      ? { file: 'ateliers-slam-france.html', nom: 'Ateliers slam partout en France' }
      : { file: 'atelier-slam.html', nom: 'Les ateliers slam' };

  const url = `https://slamesope.fr/${t.file}`;
  const fil = [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://slamesope.fr/' },
    { '@type': 'ListItem', position: 2, name: 'Ateliers slam', item: 'https://slamesope.fr/atelier-slam.html' },
  ];
  if (t.niveau !== 'france') {
    fil.push({ '@type': 'ListItem', position: 3, name: 'Ateliers slam partout en France', item: 'https://slamesope.fr/ateliers-slam-france.html' });
  }
  if (t.niveau === 'ville' && t.departementFile) {
    fil.push({ '@type': 'ListItem', position: fil.length + 1, name: `Ateliers slam en ${t.departement}`, item: `https://slamesope.fr/${t.departementFile}` });
  }
  fil.push({ '@type': 'ListItem', position: fil.length + 1, name: t.title, item: url });

  const zone = estFrance
    ? [{ '@type': 'Country', name: 'France' }]
    : t.niveau === 'departement'
      ? [{ '@type': 'AdministrativeArea', name: t.ville }]
      : [{ '@type': 'City', name: t.ville }, { '@type': 'AdministrativeArea', name: t.departement }];

  const jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: fil },
      {
        /* Service plutôt que LocalBusiness : il n'y a ni adresse d'accueil ni
           horaires d'ouverture, et déclarer un commerce local qui n'existe pas
           est le genre de balisage que Google finit par retenir contre le site. */
        '@type': 'Service',
        name: t.title,
        serviceType: 'Atelier d’écriture et d’oralité',
        description: t.meta,
        url,
        provider: {
          '@type': 'Person',
          name: 'Esope',
          jobTitle: 'Slameur, intervenant artistique et pédagogique',
          award: ['Champion de France de Slam'],
          email: 'slampoetrip@gmail.com',
        },
        areaServed: zone,
        audience: {
          '@type': 'Audience',
          audienceType: 'Établissements scolaires, structures jeunesse, structures de santé et médico-sociales',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: t.faq.map(([q, r]) => ({
          '@type': 'Question', name: q,
          acceptedAnswer: { '@type': 'Answer', text: r },
        })),
      },
    ],
  });

  const titreRecits = estFrance
    ? 'Tous les projets, département par département'
    : t.niveau === 'departement'
      ? `Mes projets en ${t.ville}`
      : `Mes projets à ${t.ville} et dans la métropole`;

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t.seoTitle}</title>
<meta name="description" content="${t.meta}">
<meta name="author" content="Esope">
<meta name="theme-color" content="#fdc837">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${t.seoTitle}">
<meta property="og:description" content="${t.meta}">
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
  <a class="crumb" href="${parent.file}"><span class="arrow" aria-hidden="true">←</span> ${parent.nom}</a>
  <div class="page-hero__band band--${t.color}">
    <svg class="scribbles" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
      <path d="M-20 70 C120 10 260 130 420 50 M-20 200 C100 150 300 260 420 190 M90 -20 C120 120 60 200 130 320 M300 -20 C280 110 350 190 300 320"/>
    </svg>
    <span class="page-hero__watermark" aria-hidden="true">${t.watermark}</span>
    <div class="page-hero__inner">
      <h1>${t.title}</h1>
      <p>${t.baseline}</p>
      <div class="btn-row">
        <a class="btn btn--ink" href="index.html#contact">Construire votre projet</a>
        <a class="btn btn--link" href="index.html#dossier">Le dossier en PDF <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </div>
  <p class="body-lg mute lede" data-reveal>${t.intro}</p>
</section>

<section class="section section--close wrap">
  <div class="facts" data-stagger>${facts}
  </div>
</section>

<section class="section section--close wrap">
  <div class="measure" data-reveal>
    <h2 class="h2">${t.ancrage.titre}</h2>
${t.ancrage.paragraphes.map((p) => `    <p class="body-lg mute" style="margin-top:20px">${p}</p>`).join('\n')}
  </div>
${img('hero', ' illus--large')}
</section>
${departements ? `
<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(24px,5vw,36px)">
    <h2 class="h2">Les départements où j’ai déjà animé un atelier</h2>
  </div>
  <div class="related" data-stagger>${departements}
  </div>
</section>` : ''}
${lieux ? `
<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(24px,5vw,36px)">
    <h2 class="h2">${t.lieux.titre}</h2>
  </div>
  <div class="goals" data-stagger>${lieux}
  </div>
</section>` : ''}

<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(24px,5vw,36px)">
    <h2 class="h2">Les quatre ateliers${estFrance ? '' : `, en ${t.ville} comme ailleurs`}</h2>
  </div>
  <div class="related related--pair" data-stagger>${ateliers}
  </div>
${img('atelier', '')}
</section>
${villesLiees ? `
<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(24px,5vw,36px)">
    <h2 class="h2">Par ville</h2>
  </div>
  <div class="related" data-stagger>${villesLiees}
  </div>
</section>` : ''}

<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(24px,5vw,36px)">
    <h2 class="h2">Avec qui je travaille</h2>
  </div>
  <div class="related" data-stagger>${publics}
  </div>
</section>

<section class="section section--close wrap" id="faq">
  <div data-reveal style="margin-bottom:clamp(20px,4vw,32px)">
    <h2 class="h2">Questions fréquentes</h2>
  </div>
  <div class="faq" data-stagger>${faq}
  </div>
</section>
${coeur.length && !estFrance ? `
<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(20px,3.4vw,28px)">
    <p class="eyebrow">Sur le terrain</p>
    <h2 class="h2">${titreRecits}</h2>
  </div>
  <div class="recits" data-stagger>${coeur.map(carte).join('')}
  </div>
</section>` : ''}
${autour.length ? `
<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(20px,3.4vw,28px)">
    <h2 class="h2">Et ailleurs en ${t.departement}</h2>
  </div>
  <div class="recits" data-stagger>${autour.map(carte).join('')}
  </div>
</section>` : ''}
${preuves ? `
<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(20px,3.4vw,28px)">
    <h2 class="h2">${t.preuves.titre}</h2>
  </div>
  <div class="relais-liste" data-stagger>${preuves}
  </div>
  <div data-reveal style="margin-top:clamp(20px,3vw,28px)">
    <a class="btn btn--link" href="temoignages.html">Toute la revue de presse <span class="arrow" aria-hidden="true">→</span></a>
  </div>
</section>` : ''}

<section class="section section--close wrap center">
  <div class="measure" data-reveal>
    <h2 class="h2">Un projet ${estFrance ? 'près de chez vous' : `en ${t.ville}`} ?</h2>
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

  writeFileSync(join(root, t.file), html);
  console.log(`→ ${t.file}  (${t.niveau}, ${coeur.length} récits${autour.length ? ` + ${autour.length} alentour` : ''})`);
}
