/**
 * Génère les pages d'atelier à partir des données ci-dessous, en réutilisant
 * le header, les fenêtres modales et le pied de page de index.html.
 *
 *   node tools/build-pages.cjs
 *
 * Éditer le contenu ici, puis relancer : les quatre pages restent cohérentes
 * entre elles et avec l'accueil.
 */
const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const index = readFileSync(join(root, 'index.html'), 'utf8');

const between = (start, end) => index.slice(index.indexOf(start), index.indexOf(end));
// Sur une sous-page, les ancres du header et du pied de page doivent repartir
// vers l'accueil : #contact seul ne mène nulle part ici.
const toHome = (html) =>
  html.replace(/href="#(?!top\b|main\b)([a-z0-9-]+)"/g, 'href="index.html#$1"');

const header = toHome(between('<a class="skip-link"', '<main id="main">'));
const footer = toHome(index.slice(index.indexOf('<!-- ================= PARCOURS — fenêtre')));

const OBJECTIFS = {
  ecriture: ['Écriture', "Appréhender les techniques d'écriture et de musicalité : figures de style, rhétorique, rythme, schémas de rimes, jeux de mots."],
  oralite: ['Oralité', "Mettre en voix les textes et assurer une prise de parole en public : échange avec le public, appropriation de l'espace scénique, souffle."],
  eloquence: ['Éloquence', "Acquérir des compétences en diction, intonation et expression corporelle : se présenter, parler à un public, gérer le stress."],
  partage: ['Partage', "S'exprimer sur les plans personnel et émotionnel, extérioriser opinions et ressentis, libérer la parole."],
  confiance: ['Confiance', "Affirmer un point de vue, une création ou une idée, dans un climat qui renforce l'estime de soi en toute bienveillance."],
};

const pages = [
  {
    file: 'atelier-slam.html',
    color: 'turquoise',
    title: 'Ateliers slam',
    baseline: "Réconcilier les jeunes avec la langue française par un art actuel et accessible. Les élèves écrivent, puis montent au micro.",
    meta: "Atelier slam en milieu scolaire et structures jeunesse : écriture poétique, mise en voix, restitution scénique. Agréé Éducation nationale, éligible pass Culture.",
    facts: [['Public', 'Primaire à université'], ['Format type', '10 h en séances de 2 h'], ['Jauge', 'Classe entière'], ['Restitution', 'Scène en fin de parcours']],
    intro: "Dans le slam, on écrit pour dire. C'est la discipline mère de mes interventions : celle qui structure toutes les autres, et celle qui transforme le plus visiblement le rapport d'un élève à sa propre parole.",
    steps: [
      ['Poser le cadre', "Je présente le mouvement slam, les règles de l'atelier et ses valeurs : l'écoute, le courage, les applaudissements pour tous, le respect de l'autre. Puis une démonstration en live, pour montrer plutôt qu'expliquer."],
      ['Jouer avec la langue', "Des jeux collectifs à voix haute, créés spécifiquement pour le projet, portant chacun sur un thème ou une technique d'écriture. Personne n'écrit avant d'avoir entendu sa propre voix dans la salle."],
      ['Masterclass de poésie', "Sous forme interactive, je passe en revue rimes, métrique et figures de style. Tous les outils poétiques qui servent la rythmique orale autant que la forme écrite. C'est là que votre programme de français trouve son support."],
      ['Écrire sous contrainte', "Je décortique chaque étape de l'écriture pour que les élèves écrivent librement, tout en étant accompagnés. La contrainte lève la pression de la page blanche."],
      ['Mettre en bouche', "Souffle, regard, silences, appuis. La moitié du travail se joue au passage de la feuille à la voix — c'est aussi là que la plupart des ateliers d'écriture s'arrêtent."],
      ['Monter sur scène', "L'aboutissement de chaque parcours. Devant la classe, l'établissement ou les familles. Les applaudissements prennent une grande place : l'élève doit être conscient de la mission accomplie."],
    ],
    goals: ['ecriture', 'oralite', 'partage', 'confiance'],
    definition: ["Le slam", "En anglais, « slam » signifie claquer. Un slam de poésie est une restitution orale et scénique, sans musique, nourrie de textes poétiques. Né dans les bars de Chicago dans les années 1980, ce courant de la poésie contemporaine allie écriture, interprétation et gestuelle. C'est l'art littéraire et oratoire le plus complet qui soit : figures de style, storytelling, schémas de rimes, mémorisation, gestion du stress, prise de parole, musicalité."],
    school: "Pour l'enseignant, l'atelier slam est un support réel pour introduire la partie du programme consacrée à la poésie. Les notions sont abordées par la pratique, dans l'ordre qui sert le texte de l'élève plutôt que celui du manuel.",
  },
  {
    file: 'atelier-eloquence.html',
    color: 'green',
    title: 'Ateliers éloquence',
    baseline: "Argumenter, tenir sa voix, occuper le silence. La prise de parole appliquée à une échéance réelle.",
    meta: "Atelier éloquence : construction d'argumentaire, joutes oratoires, gestion du stress, préparation au grand oral. Pour lycées, universités et structures jeunesse.",
    facts: [['Public', 'Lycée, université, adultes'], ['Format type', '3 h à 6 séances'], ['Jauge', 'Classe ou demi-groupe'], ['Restitution', 'Joute devant un jury']],
    intro: "La parole est capitale dans l'expression publique, et elle s'apprend. Cet atelier s'adosse toujours à une échéance concrète : un grand oral, un concours, une soutenance, une prise de parole devant l'établissement.",
    steps: [
      ['Nommer le trac', "On en parle explicitement dès la première heure. Un trac nommé est un trac qui rétrécit ; un trac tu devient un blocage."],
      ['Construire un argumentaire', "Structurer une pensée, choisir ses mots, hiérarchiser ses arguments, anticiper la contradiction. Le fond avant la forme."],
      ['Travailler le corps et le souffle', "Ancrage, posture, respiration, regard. Où respirer, où couper, où ne rien dire du tout : le silence est un argument."],
      ['Joutes chronométrées', "Des passages courts et minutés, en binôme puis devant le groupe. Filmés sur demande, pour que l'élève se voie."],
      ['Restitution devant un jury', "Les thématiques travaillées en atelier sont restituées individuellement devant une tribune à convaincre, comme dans les concours."],
    ],
    goals: ['eloquence', 'oralite', 'confiance', 'partage'],
    definition: ["L'éloquence", "L'éloquence regroupe plusieurs aspects : se faire entendre, l'ancrage du corps, une parole structurée, le choix des mots. C'est à travers le reportage « À voix haute » du programme Eloquentia que les concours d'éloquence se sont popularisés. Des thématiques sont travaillées en atelier, puis restituées individuellement devant une tribune et un jury à convaincre."],
    school: "L'atelier prépare directement le grand oral et toute épreuve orale certificative. Outre la technique, il encourage les participants à se dépasser humainement à travers des objectifs communs — ce qui déborde largement l'examen.",
  },
  {
    file: 'atelier-rap.html',
    color: 'periwinkle',
    title: 'Ateliers rap',
    baseline: "De la rédaction d'un texte à l'enregistrement et au clip. Une immersion artistique aux objectifs très concrets.",
    meta: "Atelier rap : écriture en rimes, placement sur instrumental, flow, enregistrement d'une maquette et réalisation d'un clip. Pour collèges, lycées et structures jeunesse.",
    facts: [['Public', 'Dès le collège'], ['Format type', '10 h à 20 h'], ['Jauge', 'Classe ou groupe'], ['Restitution', 'Maquette audio ou clip']],
    intro: "C'est l'atelier qui attrape les groupes que le mot « poésie » fait fuir. Même exigence d'écriture, même travail d'oralité — mais avec un résultat tangible à la fin : un titre qui existe, qu'on peut faire écouter.",
    steps: [
      ['Choisir une instru', "Le tempo et l'ambiance orientent l'écriture. Le choix collectif engage le groupe dès la première heure."],
      ['Écrire en mesures', "Rimes, schémas, mesures, jeux de mots. La contrainte rythmique est une pédagogie en soi : elle rend le comptage des syllabes désirable."],
      ['Travailler le flow', "Placement, respiration, débit, accentuation. Dire le texte devient un exercice technique, observable et perfectible."],
      ['Enregistrer', "Prises voix, réécoutes, corrections. Les élèves entendent leur propre progression, ce qui est le meilleur des retours pédagogiques."],
      ['Réaliser un clip', "Sur demande et selon le volume horaire : tournage et montage, pour que le projet sorte de la salle."],
    ],
    goals: ['ecriture', 'oralite', 'confiance', 'partage'],
    definition: ["Le rap", "Le rap est l'une des cinq disciplines du hip-hop. Sur des paroles scandées sur une musique rythmée, les maîtres de cérémonie abordent, chacun dans son style et son flow, des sujets tour à tour engagés, drôles ou légers. Né dans le Bronx dans les années 70, popularisé en Europe à la fin des années 1980, il est devenu en France le courant musical le plus populaire."],
    school: "L'atelier rap fait entrer par la porte du son des compétences d'écriture exigeantes. Pour une équipe éducative, c'est souvent le format qui mobilise les élèves les plus éloignés de l'écrit.",
  },
  {
    file: 'atelier-battle.html',
    color: 'magenta',
    title: 'Battle de compliments',
    baseline: "La battle de rue, retournée : deux artistes s'affrontent à coups d'éloges devant un public qui départage.",
    meta: "Battle de compliments : un exercice rhétorique positif et physique, sans écriture préalable. Redoutable pour souder un groupe et détourner les codes de la moquerie.",
    facts: [['Public', 'Dès 10 ans'], ['Format type', '2 h, format court'], ['Jauge', 'Groupe ou classe'], ['Restitution', 'Battle devant le groupe']],
    intro: "Une discipline insolite qui met le verbe à l'honneur dans un exercice rhétorique positif. Le principe est simple, la mécanique redoutable : elle emprunte aux codes de la vanne et de la punchline pour les retourner en éloge.",
    steps: [
      ['Poser les règles', "Deux adversaires, un temps limité, un public qui vote. Les mêmes codes que la battle de rap, avec une seule inversion : on ne cherche pas à démolir, on cherche à flatter."],
      ['Chauffer le verbe', "Jeux d'échauffement à voix haute, en cercle. L'improvisation se travaille comme le reste : par la répétition et la prise de risque progressive."],
      ['Passer en binôme', "Les face-à-face s'enchaînent, courts, rythmés, applaudis. Personne ne prépare de texte : tout se joue dans l'instant."],
      ['Départager', "Le public note. Et comme dans le slam, le public a toujours tort : ce qui compte, c'est que chacun soit passé."],
    ],
    goals: ['eloquence', 'confiance', 'partage', 'oralite'],
    definition: ["La battle", "La battle est un héritage direct de la culture hip-hop, où deux MC s'affrontent verbalement devant un public arbitre. La battle de compliments en conserve la forme — le face-à-face, le rythme, le jury populaire — en inversant l'intention. L'exercice est court, très physique, et ne demande aucune écriture préalable."],
    school: "C'est le format le plus demandé en médiation et en cohésion de groupe. Il désamorce les moqueries en en détournant les codes, et fonctionne particulièrement bien en début d'année ou à la suite d'un conflit de classe.",
  },
];

const related = (current) => pages.filter((p) => p.file !== current).map((p) => `
      <a class="related__item band--${p.color}" href="${p.file}">
        <span><b>${p.title}</b><small>${p.baseline.split('.')[0]}.</small></span>
        <span class="arrow" aria-hidden="true">→</span>
      </a>`).join('');

for (const p of pages) {
  const goals = p.goals.map((k) => {
    const [name, text] = OBJECTIFS[k];
    return `
      <div class="goal"><b>${name}</b><span>${text}</span></div>`;
  }).join('');

  const steps = p.steps.map(([t, d]) => `
      <div class="step">
        <span class="step__n" aria-hidden="true"></span>
        <div><h3>${t}</h3><p>${d}</p></div>
      </div>`).join('');

  const facts = p.facts.map(([k, v]) => `
      <div class="fact"><b>${k}</b><span>${v}</span></div>`).join('');

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.title} — Esope</title>
<meta name="description" content="${p.meta}">
<meta name="theme-color" content="#fdc837">
<meta property="og:type" content="article">
<meta property="og:title" content="${p.title} — Esope">
<meta property="og:description" content="${p.meta}">
<meta property="og:locale" content="fr_FR">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%23fdc837'/%3E%3C/svg%3E">
<link rel="stylesheet" href="assets/css/style.css?v=10">
</head>
<body>

${header}<main id="main">
<span id="top"></span>

<section class="page-hero wrap">
  <a class="crumb" href="index.html"><span class="arrow" aria-hidden="true">←</span> Toutes les interventions</a>
  <div class="page-hero__band band--${p.color}">
    <svg class="scribbles" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
      <path d="M-20 70 C120 10 260 130 420 50 M-20 200 C100 150 300 260 420 190 M90 -20 C120 120 60 200 130 320 M300 -20 C280 110 350 190 300 320"/>
    </svg>
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
    <h2 class="h2">Comment se déroule un parcours</h2>
  </div>
  <div class="steps" data-stagger>${steps}
  </div>
</section>

<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(24px,5vw,36px)">
    <h2 class="h2">Les objectifs travaillés</h2>
  </div>
  <div class="goals" data-stagger>${goals}
  </div>
</section>

<section class="section section--close wrap">
  <div class="split" data-reveal>
    <div class="def def--${p.color}">
      <h3>${p.definition[0]}</h3>
      <p>${p.definition[1]}</p>
    </div>
    <div>
      <h2 class="h2">Et côté équipe pédagogique</h2>
      <p class="body-lg mute" style="margin-top:24px">${p.school}</p>
      <div class="btn-row" style="margin-top:32px">
        <a class="btn btn--yellow" href="index.html#contact">Parler de votre projet</a>
      </div>
    </div>
  </div>
</section>

<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(24px,5vw,36px)">
    <h2 class="h2">Les autres interventions</h2>
  </div>
  <div class="related" data-stagger>${related(p.file)}
  </div>
</section>

<section class="section section--close wrap center">
  <div class="measure" data-reveal>
    <h2 class="h2">Donnez à vos élèves l'envie des mots</h2>
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

${footer.replace(/app\.js\?v=\d+/, 'app.js?v=10')}`;

  writeFileSync(join(root, p.file), html);
  console.log('→ ' + p.file);
}
