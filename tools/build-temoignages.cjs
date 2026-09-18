/**
 * Génère temoignages.html — « Témoignages & médias ».
 * Réutilise le header, les fenêtres et le pied de page de index.html, et
 * reprend les témoignages de l'accueil sans les recopier : ils sont lus
 * directement dans index.html, donc les deux pages ne peuvent pas diverger.
 *
 *   node tools/build-temoignages.cjs
 */
const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const index = readFileSync(join(root, 'index.html'), 'utf8');
const toHome = (h) => h.replace(/href="#(?!top\b|main\b)([a-z0-9-]+)"/g, 'href="index.html#$1"');
const v = (index.match(/style\.css\?v=(\d+)/) || [, '1'])[1];

const header = toHome(index.slice(index.indexOf('<a class="skip-link"'), index.indexOf('<main id="main">')));
const footer = toHome(index.slice(index.indexOf('<!-- ================= MODULE 9 — PIED DE PAGE NOIR')))
  .replace(/app\.js\?v=\d+/, `app.js?v=${v}`);

/* Les témoignages viennent de l'accueil : une seule source de vérité. La
   mosaïque les affiche dans l'ordre inverse du carrousel — les deux pages ne
   présentent jamais le même témoignage en premier. */
const carousel = index.slice(index.indexOf('<div class="carousel"'), index.indexOf('<div class="dots"'));
const temoignages = carousel.slice(carousel.indexOf('>') + 1, carousel.lastIndexOf('</div>'))
  .replace(/^\n/, '').replace(/\s+$/, '');
const temoignagesMosaique = (temoignages.match(/<article class="quote[\s\S]*?<\/article>/g) || [])
  .reverse().join('\n');

/* --------------------------------------------------------------------------
   La presse. Les intitulés sont ceux des adresses des articles : à recouper
   avec les pages elles-mêmes avant toute réutilisation en dehors du site.
   -------------------------------------------------------------------------- */
const PRESSE = [
  { media: 'Sud Ouest', teinte: 'turquoise', atelier: 'Slam', lieu: 'Carbon-Blanc',
    titre: 'Slam : le collège champion d’Aquitaine',
    chapo: 'Des jeunes formés en atelier remportent le championnat d’Aquitaine de slam.',
    url: 'https://www.sudouest.fr/gironde/carbon-blanc/slam-le-college-champion-d-aquitaine-2605424.php',
    une: true },
  { media: 'Midi Libre', teinte: 'magenta', atelier: 'Slam & battle', lieu: 'Avril 2025',
    titre: 'Le collège Eugène-Vigne vibre au rythme du slam et des compliments',
    chapo: 'Un parcours qui mêle écriture slam et battle de compliments.',
    url: 'https://www.midilibre.fr/2025/04/01/le-college-eugene-vigne-vibre-au-rythme-du-slam-et-des-compliments-12607112.php' },
  { media: 'La Provence', teinte: 'periwinkle', atelier: 'Rap', lieu: 'Édition Salon',
    titre: 'Des apprentis initiés au rap avec le champion de France de slam',
    chapo: 'Un atelier rap mené auprès d’apprentis en formation.',
    url: 'https://www.laprovence.com/article/edition-salon/6940250/des-apprentis-inities-au-rap-avec-le-champion-de-france-de-slam.html' },
  { media: 'La Dépêche', teinte: 'magenta', atelier: 'Battle', lieu: 'Mézin · mars 2022',
    titre: 'Battle de compliments pour les collégiens d’Armand-Fallières',
    chapo: 'Tout un collège réuni autour des punchlines valorisantes.',
    url: 'https://www.ladepeche.fr/2022/03/21/mezin-battle-de-compliments-pour-les-collegiens-darmand-fallieres-10183795.php' },
  { media: 'Midi Libre', teinte: 'green', atelier: 'Slam', lieu: 'Béziers · avril 2022',
    titre: 'Une semaine du Printemps des poètes appréciée au collège Fénelon',
    chapo: 'Une semaine d’ateliers dans le cadre du Printemps des poètes.',
    url: 'https://www.midilibre.fr/2022/04/01/beziers-une-semaine-du-printemps-des-poetes-appreciee-au-college-fenelon-10207181.php' },
  { media: 'Le Tarn Libre', teinte: 'turquoise', atelier: 'Slam', lieu: 'Carmaux',
    titre: 'Des poètes slameurs au collège Augustin-Malroux',
    chapo: 'Un cycle d’ateliers slam et sa restitution devant l’établissement.',
    url: 'https://www.letarnlibre.com/actualite-12517-carmaux-des-poetes-slameurs-au-college-augustin-malroux-a-carmaux' },
  { media: 'Le Type', teinte: 'yellow', atelier: 'Battle', lieu: 'Portrait',
    titre: 'Focus : collectif Ta Mère La Mieux',
    chapo: 'Le portrait du collectif à l’origine des battles de compliments.',
    url: 'https://letype.fr/focus-collectif-ta-mere-la-mieux/' },
  { media: 'Sud Ouest', teinte: 'periwinkle', atelier: 'Slam', lieu: 'Orthez',
    titre: 'Le slam guide les lycéens vers l’art de la poésie',
    chapo: 'Le slam comme porte d’entrée vers l’écriture poétique, avec des lycéens.',
    url: 'https://www.sudouest.fr/premium/dans-vos-departements/orthez-le-slam-guide-les-lyceens-vers-l-art-de-la-poesie-4789670.php' },
];

const STRUCTURES = [
  ['Ville de Lormont', 'L’âme slam', 'https://www.lormont.fr/actualites-109/l-ame-slam-2090.html'],
  ['Biblio.Gironde', 'Atelier slam avec Esope', 'https://biblio.gironde.fr/agenda/atelier-slam-avec-esope'],
  ['Collège Saint-Louis Sainte-Thérèse', 'Les élèves de 3e rencontrent Esope', 'https://www.saintlouissaintetherese.com/actu/atelier-slam-les-eleves-de-3e-rencontrent-esope-champion-de-france'],
  ['Lycée du Pays de Soule', 'Atelier slam avec Esope', 'https://www.lyceedupaysdesoule.fr/activites/slam_2017-2018/02_atelier-avec-esope.pdf'],
  ['Médiathèque d’Arès', 'Atelier d’écriture slam', 'https://www.mediatheque-ares.fr/index.php/component/icagenda/133-atelier-slam/2024-10-10-16-00'],
];

const PALMARES = [
  ['Champion de France', 'de Slam'],
  ['Champion Sud-Ouest', 'de Slam'],
  ['Coach du champion', 'de France de Slam'],
  ['Juré', 'd’événements nationaux'],
  ['Performance de l’année', 'Top Versos 2021'],
  ['Participant', 'du Rap Contenders'],
];

/* --------------------------------------------------------------------------
   Fabrique
   -------------------------------------------------------------------------- */

/* Le bandeau défile : la piste est écrite deux fois pour que la boucle se
   referme sans saut. La seconde copie est masquée aux lecteurs d'écran. */
const noms = [...new Set(PRESSE.map((a) => a.media))].concat(STRUCTURES.map((s) => s[0]));
const piste = (cache) => noms.map((n) =>
  `<span class="marquee__item"${cache ? ' aria-hidden="true"' : ''}>${n}<i aria-hidden="true">✦</i></span>`).join('\n        ');

const carte = (a) => `
      <a class="presse${a.une ? ' presse--une' : ''} band--${a.teinte}" href="${a.url}"
         target="_blank" rel="noopener">
        <span class="presse__top">
          <span class="presse__media">${a.media}</span>
          <span class="presse__tag">${a.atelier}</span>
        </span>
        <span class="presse__titre">${a.titre}</span>
        <span class="presse__chapo">${a.chapo}</span>
        <span class="presse__foot">
          <span class="presse__lieu">${a.lieu}</span>
          <span class="presse__cta">Lire l’article <span class="arrow" aria-hidden="true">↗</span></span>
        </span>
      </a>`;

const relais = STRUCTURES.map(([nom, titre, url]) => `
      <a class="relais" href="${url}" target="_blank" rel="noopener">
        <span class="relais__nom">${nom}</span>
        <span class="relais__titre">« ${titre} » <span class="arrow" aria-hidden="true">↗</span></span>
      </a>`).join('');

const prix = PALMARES.map(([fort, suite]) => `
      <li class="palm"><b>${fort}</b><span>${suite}</span></li>`).join('');

const jsonld = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Esope',
  jobTitle: 'Slameur, intervenant en ateliers d’écriture et d’oralité',
  award: PALMARES.map(([a, b]) => a + ' ' + b),
  subjectOf: PRESSE.map((a) => ({
    '@type': 'NewsArticle', headline: a.titre, url: a.url,
    publisher: { '@type': 'Organization', name: a.media },
  })),
});

const meta = 'Revue de presse et témoignages : huit articles parus dans la presse régionale, cinq structures qui ont relayé les ateliers, et les retours des enseignants et coordinateurs qui ont fait intervenir Esope.';

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Témoignages et médias — Esope, champion de France de Slam</title>
<meta name="description" content="${meta}">
<meta name="author" content="Esope">
<meta name="theme-color" content="#fdc837">
<meta property="og:type" content="article">
<meta property="og:title" content="Témoignages et médias — Esope">
<meta property="og:description" content="${meta}">
<meta property="og:locale" content="fr_FR">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%23fdc837'/%3E%3C/svg%3E">
<link rel="stylesheet" href="assets/css/style.css?v=${v}">
<script type="application/ld+json">${jsonld}</script>
</head>
<body>

${header}<main id="main">
<span id="top"></span>

<section class="marquee" aria-label="Les médias et structures qui ont parlé des ateliers">
  <div class="marquee__track">
    <span class="marquee__group">
        ${piste(false)}
    </span>
    <span class="marquee__group">
        ${piste(true)}
    </span>
  </div>
</section>

<section class="section section--close wrap" id="presse">
  <div data-reveal style="margin-bottom:clamp(26px,5vw,40px)">
    <h1 class="h2">La presse en parle</h1>
  </div>
  <div class="presses" data-stagger>${PRESSE.map(carte).join('')}
  </div>
</section>

<section class="section section--close wrap">
  <div class="paire paire--def">
    <div class="def def--neutre" data-reveal>
      <h3>Mais encore...</h3>
      <p>Villes, médiathèques, réseaux de lecture publique et établissements qui ont annoncé ou
        raconté un atelier sur leurs propres canaux.</p>
      <div class="relais-liste">${relais}
      </div>
    </div>
    <div class="def def--yellow" data-reveal>
      <h3>Le palmarès</h3>
      <ul class="palms">${prix}
      </ul>
      <p style="margin-top:auto;padding-top:clamp(18px,3vw,26px)">Ce palmarès continue de
        s’écrire sur le terrain : découvrez <a href="projets.html" style="font-weight:700;text-decoration:underline;text-underline-offset:3px">les derniers projets d’Esope</a>.</p>
    </div>
  </div>
</section>

<section class="section section--close wrap">
  <div class="paire">
    <figure class="shot" data-reveal>
      <img src="assets/img/page-battle-3.jpg" alt="Affiche Top Versos 2021 : Ésope, performance de l’année"
           loading="lazy" width="720" height="720">
    </figure>
    <div class="def def--periwinkle def--centre" data-reveal>
      <h3>Vous êtes journaliste ?</h3>
      <p>Je réponds volontiers pour un article, un reportage en classe ou une interview. Le dossier
        de présentation contient le détail des ateliers, les chiffres et le déroulé d’un parcours ;
        photos en haute définition et captations de restitution sur demande.</p>
      <div class="btn-row btn-row--center" style="padding-top:clamp(20px,3vw,28px)">
        <a class="btn btn--ink" href="mailto:slampoetrip@gmail.com">slampoetrip@gmail.com</a>
        <a class="btn btn--link" href="assets/docs/dossier-esope.pdf" download>Le dossier (PDF) <span class="arrow" aria-hidden="true">↓</span></a>
      </div>
    </div>
  </div>
</section>

<section class="section section--close wrap" id="temoignages">
  <div data-reveal style="margin-bottom:clamp(26px,5vw,40px)">
    <h2 class="h2">Ils parlent de mes ateliers</h2>
    <p class="lead mute" style="margin-top:18px;max-width:640px">Enseignants, coordinateurs, équipes
      soignantes : celles et ceux qui m’ont fait intervenir racontent ce qui s’est passé dans leur
      groupe.</p>
  </div>
  <div class="mosaique">
${temoignagesMosaique}
  </div>
</section>

<section class="section section--close wrap center">
  <div class="measure" data-reveal>
    <h2 class="h2">Le prochain article parlera peut-être de votre structure</h2>
    <p class="lead mute" style="margin-top:24px">Décrivez-moi votre contexte et votre public : je
      réponds sous 48 h avec un déroulé et un devis.</p>
    <div class="btn-row btn-row--center" style="margin-top:32px">
      <a class="btn btn--yellow" href="index.html#contact">Je construis un projet</a>
      <a class="btn btn--link" href="demo.html">Essayer une démo <span class="arrow" aria-hidden="true">→</span></a>
    </div>
  </div>
</section>

</main>

${footer}`;

writeFileSync(join(root, 'temoignages.html'), html);
console.log('→ temoignages.html  (' + PRESSE.length + ' articles, ' + STRUCTURES.length +
  ' structures, ' + (temoignages.match(/class="quote /g) || []).length + ' témoignages)');
