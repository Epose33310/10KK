/**
 * Génère une page par public cible (Éducation nationale, structures jeunesse,
 * santé et médico-social), listés dans le méga-menu « Tous les publics ».
 * Chaque page reprend le header/pied de page de index.html, comme les pages
 * d'atelier, et pioche ses récits et témoignages dans les mêmes sources —
 * data-projets.cjs (champ `secteur`) et le carrousel de l'accueil (attribut
 * `data-public` posé sur chaque témoignage).
 *
 *   node tools/build-publics.cjs
 */
const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const index = readFileSync(join(root, 'index.html'), 'utf8');

const between = (start, end) => index.slice(index.indexOf(start), index.indexOf(end));
const toHome = (html) =>
  html.replace(/href="#(?!top\b|main\b)([a-z0-9-]+)"/g, 'href="index.html#$1"');

const assetVersion = (index.match(/style\.css\?v=(\d+)/) || [, '1'])[1];

const header = toHome(between('<a class="skip-link"', '<main id="main">'));
const footer = toHome(index.slice(index.indexOf('<!-- ================= MODULE 9 — PIED DE PAGE NOIR')));

const PROJETS = require('./data-projets.cjs');
const ech = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Les témoignages du carrousel de l'accueil, filtrés par secteur grâce à
// l'attribut data-public posé sur chaque <article class="quote …">.
const carousel = index.slice(index.indexOf('<div class="carousel"'), index.indexOf('<div class="dots"'));
const temoignagesTous = carousel.match(/<article class="quote[\s\S]*?<\/article>/g) || [];
const temoignagesDe = (secteur, max) => temoignagesTous
  .filter((a) => a.includes(`data-public="${secteur}"`))
  .slice(0, max);

const recitsDe = (secteur) => PROJETS
  .filter((a) => (a.secteur || []).includes(secteur))
  .sort((a, b) => b.ordre - a.ordre)
  .slice(0, 4);

const ATELIERS = {
  slam: { file: 'atelier-slam.html', color: 'turquoise', nom: 'Ateliers slam' },
  battle: { file: 'atelier-battle.html', color: 'magenta', nom: 'Battle de compliments' },
  eloquence: { file: 'atelier-eloquence.html', color: 'green', nom: 'Ateliers éloquence' },
  rap: { file: 'atelier-rap.html', color: 'periwinkle', nom: 'Ateliers rap' },
};

const pages = [
  {
    file: 'public-education-nationale.html',
    secteur: 'education',
    color: 'yellow',
    watermark: 'École',
    seoTitle: "Ateliers slam, rap et éloquence pour l'Éducation nationale — Esope",
    meta: "Ateliers slam, rap, éloquence et battle de compliments en primaire, collège, lycée et université. Agréé Éducation nationale, éligible pass Culture via ADAGE, interventions calées sur l'emploi du temps et le programme.",
    title: 'Des interventions qui tiennent dans un emploi du temps et un programme',
    baseline: "Écriture, oralité, prise de parole : quatre ateliers pensés pour s'insérer dans une classe, un créneau, un projet d'établissement — sans improvisation ni temps mort.",
    facts: [
      ['Cadre', 'Agréé Éducation nationale'],
      ['Financement', 'Éligible pass Culture, via ADAGE'],
      ['Format', 'Créneau de cours, demi-journée ou projet filé sur l’année'],
      ['Jauge', 'Classe entière (30) ou demi-groupe'],
    ],
    intro: "Une classe a un emploi du temps qui ne se négocie pas au dernier moment, un programme à couvrir, une salle qui n'est pas toujours faite pour la scène, et parfois trente élèves à mobiliser en même temps. J'interviens dans ce cadre depuis 2016 : mes ateliers slam, rap, éloquence et battle de compliments se calent sur un créneau de cours, une demi-journée banalisée ou un projet filé sur plusieurs séances, et s'articulent avec le programme plutôt que de s'y ajouter — poésie et rhétorique en français, oral en histoire-géographie ou EMC, préparation du grand oral en lycée.",
    goalsTitre: 'Ce que ces ateliers travaillent, en classe',
    goals: [
      ['Le programme, par la pratique', "Rimes, figures de style, rhétorique, schémas de rimes : les notions du chapitre poésie ou de l'épreuve du grand oral sont abordées en écrivant, pas en les récitant."],
      ['La prise de parole de chacun', "Même l'élève le plus silencieux passe au micro, à son rythme — le cadre est posé dès la première heure pour que personne ne soit jamais forcé."],
      ["L'hétérogénéité, sans la subir", "Un même atelier absorbe un niveau de classe très inégal : chacun avance sur son texte à sa mesure, sans que le groupe n'attende personne."],
      ['Un moment fédérateur', "Une restitution en interne — CDI, hall, amphithéâtre, spectacle de fin d'année — qui redonne de la cohésion à une classe ou à un niveau entier."],
    ],
    defTitre: 'Vos réalités, je les connais',
    defTexte: "Une salle de classe n'est pas un studio, un emploi du temps ne se négocie pas au dernier moment, et une classe de trente élèves n'a rien à voir avec un groupe de dix volontaires. J'interviens en co-animation avec l'enseignant ou seul selon vos habitudes, je m'adapte à une salle de classe comme à un gymnase, et je cale toujours le déroulé avec l'équipe pédagogique en amont plutôt que d'arriver avec un contenu fermé.",
    concretTexte: "Chaque intervention se construit avec vous : volume horaire, nombre de séances, thème imposé ou non, restitution visée. Je suis agréé par l'Éducation nationale et mes interventions sont éligibles au pass Culture, disponibles sur ADAGE quelques heures après notre échange. Je me déplace dans toute la France.",
    ateliers: {
      slam: "Support direct du chapitre poésie : rimes, figures de style, prise de parole, dans l'ordre qui sert le texte plutôt que le manuel.",
      rap: "Un format qui embarque les élèves les plus éloignés de l'écrit, jusqu'à un titre enregistré qu'on peut faire écouter en classe.",
      eloquence: 'Prépare directement le grand oral et les épreuves orales certificatives : argumentaire, voix, gestion du trac.',
      battle: "Le format le plus demandé en médiation et cohésion de classe, en début d'année ou après un conflit.",
    },
    faq: [
      ['Une intervention s’articule-t-elle avec un programme précis (français, EMC, musique) ?',
       "Oui, systématiquement. Le slam recoupe la poésie et l'argumentation, l'éloquence prépare le grand oral et toute épreuve orale, le battle de compliments sert souvent de support en EMC ou en médiation, et le rap peut s'intégrer au cours de musique. Je cale le contenu avec l'enseignant plutôt que d'arriver avec un déroulé figé."],
      ['Peut-on intervenir sur une classe entière de 30 élèves ?',
       "Oui, c'est le format le plus courant. Certains établissements préfèrent un travail en demi-groupe pour un accompagnement plus individualisé — les deux fonctionnent, selon le volume horaire et l'objectif visé."],
      ["Faut-il que l'enseignant reste présent pendant l'atelier ?",
       "Ce n'est pas obligatoire mais souvent utile, en particulier pour la gestion du groupe et le lien avec le programme. Beaucoup d'enseignants profitent de l'atelier pour observer leurs élèves autrement — plusieurs m'ont dit avoir découvert un élève en difficulté à l'écrit scolaire, très à l'aise au micro."],
      ['Comment se passe une demande de devis ou de dossier ?',
       "Vous me décrivez votre contexte — niveau, volume souhaité, thème éventuel — et je réponds avec une proposition adaptée et un devis. Le dossier de diffusion, téléchargeable en PDF, détaille les formats et les tarifs pour préparer une demande de financement."],
      ['Vos interventions sont-elles éligibles au pass Culture ?',
       "Oui. Il vous suffit de me contacter pour discuter de votre projet : l'offre est disponible sur la plateforme ADAGE quelques heures après notre échange. Je suis également agréé par l'Éducation nationale."],
    ],
  },
  {
    file: 'public-structures-jeunesse.html',
    secteur: 'jeunesse',
    color: 'magenta',
    watermark: 'Jeunesse',
    seoTitle: 'Ateliers slam, rap et battle de compliments pour structures jeunesse — Esope',
    meta: "Ateliers d'écriture et d'oralité pour MJC, centres sociaux, associations et dispositifs éducatifs : slam, rap, éloquence, battle de compliments. Formats courts ou récurrents, hors cadre scolaire.",
    title: 'Un cadre qui donne envie de rester, même sans obligation',
    baseline: "Vos publics viennent par choix, pas par emploi du temps. Mes ateliers sont pensés pour accrocher vite, sans note ni évaluation, et pour tenir sur un groupe qui change parfois d'une séance à l'autre.",
    facts: [
      ['Public', 'Volontaires, souvent 8 à 15 personnes'],
      ['Horaires', 'Périscolaire, mercredi, vacances, soirée'],
      ['Format', 'Séance isolée, cycle court ou parcours à l’année'],
      ['Restitution', "Scène ouverte, événement de quartier, temps fort associatif"],
    ],
    intro: "Dans une structure jeunesse, personne n'est obligé d'être là — et c'est justement ce qui change tout. Un jeune qui pousse la porte d'une MJC, d'un centre social ou d'un dispositif éducatif un mercredi après-midi n'a rien à y gagner s'il s'ennuie : il faut le convaincre de rester dans les dix premières minutes. J'anime depuis 2016 des ateliers slam, rap, éloquence et battle de compliments dans ce type de structures, avec des groupes parfois fixes, parfois mouvants d'une séance à l'autre, en horaires périscolaires, le mercredi ou pendant les vacances.",
    goalsTitre: 'Ce que ces ateliers apportent à votre public',
    goals: [
      ['Accrocher vite', "Le format s'appuie sur des jeux oraux collectifs dès les dix premières minutes : ceux qui arrivent en cours de séance rejoignent le groupe sans se sentir en retard."],
      ['Un groupe qui ne se connaît pas encore', "Le battle de compliments, en particulier, transforme en une heure une bande de jeunes qui s'observent en un groupe qui se connaît vraiment."],
      ["Une restitution qui ne ressemble pas à une évaluation", "Scène ouverte, événement de quartier, temps fort associatif : la restitution valorise sans jamais noter."],
      ["Une pratique qui continue après l'atelier", "Certains jeunes redemandent le format pendant les vacances, ou reviennent avec un texte retravaillé de leur côté."],
    ],
    defTitre: 'Votre réalité, je la connais',
    defTexte: "Un groupe qui change d'une séance à l'autre, des jeunes qui arrivent au compte-gouttes, une salle qui sert à autre chose la moitié du temps : je ne construis jamais une séance qui suppose la présence de tout le monde depuis le début. Chaque temps fort — jeu oral, écriture, mise en voix — est pensé pour qu'on puisse le rejoindre en cours de route, sans avoir raté l'essentiel.",
    concretTexte: "Le format se cale sur votre fonctionnement : une séance isolée pour tester, un cycle de quelques semaines, ou un parcours à l'année comme j'en mène avec certaines structures depuis plusieurs saisons. On peut aussi évoquer ensemble, au moment du devis, les dispositifs de financement mobilisables par votre structure.",
    ateliers: {
      slam: "Un espace d'expression libre, sans note ni évaluation, pour des jeunes qui viennent par envie plutôt que par obligation.",
      rap: "Le format qui parle immédiatement à des jeunes déjà familiers du genre — jusqu'à un titre et un clip qui existent après l'atelier.",
      eloquence: "Utile en amont d'un concours, d'une prise de parole publique ou d'une restitution associative.",
      battle: "Un excellent outil d'accroche avec un groupe mouvant ou qui ne se connaît pas encore.",
    },
    faq: [
      ['Le format fonctionne-t-il si le groupe change d’une séance à l’autre ?',
       "Oui, c'est même une situation que je rencontre régulièrement. Chaque séance s'organise comme une unité complète — une entrée, une production, une prise de parole — plutôt que comme la suite obligée de la précédente. Ce qui se transmet d'une fois sur l'autre, c'est la réputation de l'atelier dans la structure, pas un contenu qu'il faudrait avoir suivi depuis le début."],
      ['Faut-il un engagement des jeunes sur toute la durée ?',
       "Non. Le format s'adapte à un public volontaire et parfois irrégulier : on peut viser une séance découverte, un cycle court, ou un parcours plus long si le groupe se stabilise. Rien n'empêche de commencer petit et d'ajuster ensuite."],
      ['Quel volume horaire prévoir pour une restitution ?',
       "Une découverte tient en quelques heures. Pour une restitution qui tient la route, je vise plutôt 6 à 10 h selon l'atelier — le temps d'écrire, de réécrire et de préparer un passage. En dessous, je propose une restitution interne plutôt que devant un public large."],
      ["Un animateur ou un éducateur doit-il rester présent pendant l'atelier ?",
       "Ce n'est pas obligatoire, mais c'est souvent un plus : la présence d'un visage familier rassure les jeunes les plus hésitants, et l'équipe peut ensuite prendre le relais entre deux séances."],
      ['Le financement est-il possible en dehors du pass Culture ?',
       "Oui, plusieurs structures jeunesse mobilisent d'autres dispositifs selon leur territoire et leur projet. Décrivez-moi votre contexte au moment du devis : on regarde ensemble ce qui est pertinent pour votre structure."],
    ],
  },
  {
    file: 'public-sante-medico-social.html',
    secteur: 'sante',
    color: 'green',
    watermark: 'Santé',
    seoTitle: 'Ateliers d’écriture et d’oralité en santé et médico-social — Esope',
    meta: "Ateliers slam et battle de compliments adaptés aux structures de santé et médico-sociales : hôpitaux, IME, EHPAD, foyers d'accueil. Petits groupes, rythme adapté, aucune obligation de résultat.",
    title: 'Une parole qui se construit au rythme du groupe',
    baseline: "Ni performance ni obligation de résultat : un cadre sécurisant, des petits groupes, et un rythme qui s'ajuste à ce que chacun peut donner ce jour-là.",
    facts: [
      ['Groupe', 'Petit groupe, 4 à 12 personnes'],
      ['Rythme', 'Séance isolée ou cycle, ajustable en cours de route'],
      ['Encadrement', "Un référent de l'équipe présent, en général"],
      ['Cadre', 'Aucune obligation de passage ni de résultat'],
    ],
    intro: "Un groupe en hôpital de jour, en IME, en EHPAD ou en foyer d'accueil ne se pilote pas comme une classe : la fatigue, la journée, l'état de chacun peuvent changer le programme d'une heure sur l'autre. C'est dans ce type de structures que j'interviens depuis plusieurs années — notamment à <a href=\"projet-atelier-slam-ferme-merlet-ceid.html\">la Ferme Merlet, un CEID</a>, où un atelier ponctuel de deux heures est devenu un parcours annuel de 20 h, puis toute une scène slam ouverte qui dépasse aujourd'hui largement le cadre de la structure. Le principe reste le même partout : un rythme plus lent, des groupes plus restreints, et un cadre qui ne demande jamais de résultat.",
    goalsTitre: 'Ce que je mets en place avec ce public',
    goals: [
      ['Aucune obligation de passage', "Écrire suffit. Dire son texte à voix haute reste toujours un choix, jamais une étape obligée du parcours."],
      ["Un rythme qui s'ajuste", "Une séance peut se raccourcir, se scinder ou changer de forme en cours de route selon l'énergie du groupe ce jour-là."],
      ['Un compliment plutôt qu’un jugement', "Le battle de compliments retourne le principe de la confrontation : on reçoit du groupe de la reconnaissance, jamais une évaluation."],
      ['Une équipe présente et associée', "Un référent de l'équipe soignante ou éducative reste dans la salle, et parfois y participe : à la Ferme Merlet, l'équipe encadrante écrit et passe au micro comme les autres, ce qui crée un vrai espace de confiance."],
    ],
    defTitre: 'Votre réalité, je la connais',
    defTexte: "Un participant qui ne veut pas écrire aujourd'hui, un autre qui quitte la salle en cours de séance, un groupe dont la composition change d'une fois sur l'autre : rien de tout cela ne fait échouer un atelier, à condition de l'avoir anticipé. Je ne construis jamais une séance sur l'hypothèse que tout le monde ira jusqu'au bout — et un partenariat dans ce secteur ne se construit pas non plus en une séance : il arrive qu'un atelier ponctuel donne, avec le temps, un rendez-vous annuel.",
    concretTexte: "Le format se pense avec l'équipe encadrante en amont : durée de séance plus courte que d'ordinaire, groupe réduit, objectif révisable en cours de parcours. Beaucoup de partenariats commencent par une séance test avant d'envisager un parcours plus long — c'est aussi bien ainsi. La restitution, quand elle a lieu, reste interne par défaut, devant l'équipe et les proches plutôt que devant un public large, sauf si le groupe et la structure souhaitent, avec le temps, aller plus loin.",
    ateliers: {
      slam: "Le format le plus installé dans ce secteur : un espace d'écriture personnelle, sur la vie, le passé, l'entourage, qui a par exemple donné lieu à un partenariat de plusieurs années avec un CEID.",
      rap: "Peut convenir à un public déjà familier du genre, en petit groupe et avec un cadre très resserré.",
      eloquence: "À réserver à des groupes déjà à l'aise avec la prise de parole individuelle — rarement le premier format proposé ici.",
      battle: "Également solide dans ce secteur : on écrit pour l'autre, on reçoit un compliment, jamais un jugement — utile avec un groupe qui a besoin d'une accroche immédiate.",
    },
    faq: [
      ['Ce format est-il adapté à un public en situation de handicap ou de souffrance psychique ?',
       "Il peut s'adapter, à condition de le construire avec l'équipe encadrante en amont — c'est elle qui connaît le groupe. Le battle de compliments, en particulier, convient bien à ce secteur : aucune obligation de résultat, un référent de l'équipe présent, et un principe qui ne peut pas mal tourner puisqu'il s'agit de valoriser l'autre."],
      ['Un participant qui refuse de parler peut-il rester dans le groupe ?',
       "Oui, sans aucune difficulté. Écrire suffit ; dire son texte à voix haute reste un choix. Personne n'est mis à l'écart pour ça, et rien n'empêche de changer d'avis en cours de séance."],
      ["Faut-il prévoir un référent de l'équipe pendant toute la séance ?",
       "C'est recommandé, autant pour la sécurité du groupe que pour le lien avec ce qui se passe en dehors de l'atelier. Je m'occupe du contenu artistique ; le cadre institutionnel reste celui de votre équipe."],
      ['Quelle durée prévoir pour une première séance ?',
       "Je pars en général sur un format court — autour de deux heures — pour une première séance, quitte à l'allonger ensuite si le groupe le porte bien. Mieux vaut une séance courte et réussie qu'un format trop ambitieux dès le départ."],
      ['Un atelier ponctuel peut-il devenir un partenariat plus long ?',
       "Oui, et c'est même arrivé plusieurs fois : un atelier de deux heures avec un CEID est devenu un parcours annuel de 20 h, puis <a href=\"projet-atelier-slam-ferme-merlet-ceid.html\">toute une scène slam ouverte</a>. Rien n'oblige à s'engager sur la durée dès le départ — beaucoup de partenariats commencent par un format court, quitte à grandir ensuite d'une saison sur l'autre."],
      ['Comment financer ce type d’intervention ?',
       "Cela dépend des dispositifs propres à votre secteur — budget animation, fondations, partenariats. Décrivez-moi votre projet : on regarde ensemble ce qui est réaliste pour votre structure."],
    ],
  },
];

const AUTRES_PUBLICS = {
  education: { titre: 'Éducation nationale', note: 'Primaire, collège, lycée, université.' },
  jeunesse: { titre: 'Structures jeunesse', note: 'Associations, MJC, dispositifs éducatifs.' },
  sante: { titre: 'Santé et médico-social', note: "Hôpitaux, EHPAD, IME, foyers d'accueil." },
};

const TITRE_RECITS = {
  education: 'Sur le terrain, en établissement scolaire',
  jeunesse: 'Sur le terrain, en structure jeunesse',
  sante: 'Sur le terrain, en santé et médico-social',
};

const TITRE_TEMOIGNAGES = {
  education: "Ce qu'en disent les équipes pédagogiques",
  jeunesse: "Ce qu'en disent les équipes éducatives",
  sante: "Ce qu'en dit une équipe soignante",
};

for (const p of pages) {
  const facts = p.facts.map(([k, v]) => `
      <div class="fact"><b>${k}</b><span>${v}</span></div>`).join('');

  const goals = p.goals.map(([t, d]) => `
      <div class="goal"><em aria-hidden="true"></em><b>${t}</b><span>${d}</span></div>`).join('');

  const slug = p.file.replace('.html', '');
  const faq = p.faq.map(([q, r], i) => `
      <div class="faq__item">
        <h3><button class="faq__q" type="button" aria-expanded="false" aria-controls="${slug}-faq-${i + 1}">
          ${q}<span class="faq__icon" aria-hidden="true">+</span></button></h3>
        <div class="faq__a" id="${slug}-faq-${i + 1}"><div><p>${r}</p></div></div>
      </div>`).join('');

  const ateliers = Object.keys(ATELIERS).map((k) => {
    const a = ATELIERS[k];
    return `
      <a class="related__item band--${a.color}" href="${a.file}">
        <span><b>${a.nom}</b><small>${p.ateliers[k]}</small></span>
        <span class="arrow" aria-hidden="true">→</span>
      </a>`;
  }).join('');

  const temoignages = temoignagesDe(p.secteur, 6).join('\n');

  const recits = recitsDe(p.secteur);
  const recitsHtml = recits.map((a) => `
      <a class="recit" href="projet-${a.slug}.html">
        <span class="recit__corps">
          <span class="recit__titre">${ech(a.h1)}</span>
          <span class="recit__chapo">${ech(a.chapo)}</span>
        </span>
        <span class="recit__cta">Lire le récit <span class="arrow" aria-hidden="true">→</span></span>
      </a>`).join('');

  const autres = Object.keys(AUTRES_PUBLICS)
    .filter((k) => k !== p.secteur)
    .map((k) => {
      const cible = pages.find((q) => q.secteur === k);
      return `
      <a class="related__item band--${cible.color}" href="${cible.file}">
        <span><b>${AUTRES_PUBLICS[k].titre}</b><small>${AUTRES_PUBLICS[k].note}</small></span>
        <span class="arrow" aria-hidden="true">→</span>
      </a>`;
    }).join('');

  const jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://slamesope.fr/' },
          { '@type': 'ListItem', position: 2, name: p.title, item: `https://slamesope.fr/${p.file}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: p.faq.map(([q, r]) => ({
          '@type': 'Question',
          name: q,
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
<title>${p.seoTitle}</title>
<meta name="description" content="${p.meta}">
<meta name="author" content="Esope">
<meta name="theme-color" content="#fdc837">
<meta property="og:type" content="article">
<meta property="og:title" content="${p.seoTitle}">
<meta property="og:description" content="${p.meta}">
<meta property="og:locale" content="fr_FR">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%23fdc837'/%3E%3C/svg%3E">
<link rel="stylesheet" href="assets/css/style.css?v=${assetVersion}">
<script type="application/ld+json">${jsonld}</script>
</head>
<body>

${header}<main id="main">
<span id="top"></span>

<section class="page-hero wrap">
  <a class="crumb" href="index.html"><span class="arrow" aria-hidden="true">←</span> Accueil</a>
  <div class="page-hero__band band--${p.color}">
    <svg class="scribbles" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
      <path d="M-20 70 C120 10 260 130 420 50 M-20 200 C100 150 300 260 420 190 M90 -20 C120 120 60 200 130 320 M300 -20 C280 110 350 190 300 320"/>
    </svg>
    <span class="page-hero__watermark" aria-hidden="true">${p.watermark}</span>
    <div class="page-hero__inner">
      <h1>${p.title}</h1>
      <p>${p.baseline}</p>
      <div class="btn-row">
        <a class="btn btn--ink" href="index.html#contact">Construire votre projet</a>
        <a class="btn btn--link" href="index.html#dossier">Le dossier en PDF <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </div>
</section>

<section class="section section--close wrap">
  <div class="facts" data-stagger>${facts}
  </div>
  <p class="body-lg mute" style="margin-top:clamp(28px,5vw,40px);max-width:760px" data-reveal>${p.intro}</p>
</section>

<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(24px,5vw,36px)">
    <h2 class="h2">${p.goalsTitre}</h2>
  </div>
  <div class="goals" data-stagger>${goals}
  </div>
</section>

<section class="section section--close wrap">
  <div class="paire paire--def">
    <div class="def def--${p.color}" data-reveal>
      <h3>${p.defTitre}</h3>
      <p>${p.defTexte}</p>
    </div>
    <div class="def def--neutre" data-reveal>
      <h3>Et concrètement</h3>
      <p>${p.concretTexte}</p>
      <div class="btn-row" style="margin-top:auto;padding-top:clamp(20px,3vw,28px)">
        <a class="btn btn--yellow" href="index.html#contact">Parler de votre projet</a>
      </div>
    </div>
  </div>
</section>

<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(24px,5vw,36px)">
    <h2 class="h2">Les ateliers qui leur correspondent le mieux</h2>
  </div>
  <div class="related" data-stagger>${ateliers}
  </div>
</section>

<section class="section section--close wrap" id="faq">
  <div data-reveal style="margin-bottom:clamp(20px,4vw,32px)">
    <h2 class="h2">Questions fréquentes</h2>
  </div>
  <div class="faq" data-stagger>${faq}
  </div>
</section>
${temoignages ? `
<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(20px,3.4vw,28px)">
    <h2 class="h2">${TITRE_TEMOIGNAGES[p.secteur]}</h2>
  </div>
  <div class="mosaique" data-stagger>${temoignages}
  </div>
</section>` : ''}
${recits.length ? `
<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(20px,3.4vw,28px)">
    <p class="eyebrow">Sur le terrain</p>
    <h2 class="h2">${TITRE_RECITS[p.secteur]}</h2>
  </div>
  <div class="recits" data-stagger>${recitsHtml}
  </div>
</section>` : ''}

<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(24px,5vw,36px)">
    <h2 class="h2">Vous accompagnez un autre type de public ?</h2>
  </div>
  <div class="related" data-stagger>${autres}
  </div>
</section>

<section class="section section--close wrap center">
  <div class="measure" data-reveal>
    <h2 class="h2">Construisons l'intervention qui convient à votre structure</h2>
    <p class="lead mute" style="margin-top:24px">Plus de 300 ateliers menés et 5 000 participants
      rencontrés, dans toute la France. Décrivez-moi votre contexte, je réponds avec une proposition
      adaptée.</p>
    <div class="btn-row btn-row--center" style="margin-top:32px">
      <a class="btn btn--yellow" href="index.html#contact">Construire votre projet</a>
      <a class="btn btn--link" href="index.html#dossier">Télécharger le dossier <span class="arrow" aria-hidden="true">→</span></a>
    </div>
  </div>
</section>

</main>

${footer.replace(/app\.js\?v=\d+/, `app.js?v=${assetVersion}`)}`;

  writeFileSync(join(root, p.file), html);
  console.log('→ ' + p.file);
}
