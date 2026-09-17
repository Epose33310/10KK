/**
 * Génère les pages d'atelier à partir des données ci-dessous, en réutilisant
 * le header, les fenêtres modales et le pied de page de index.html.
 *
 *   node tools/build-pages.cjs
 *
 * Éditer le contenu ici, puis relancer : les quatre pages restent cohérentes
 * entre elles et avec l'accueil.
 */
const { readFileSync, writeFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const index = readFileSync(join(root, 'index.html'), 'utf8');

const between = (start, end) => index.slice(index.indexOf(start), index.indexOf(end));
// Sur une sous-page, les ancres du header et du pied de page doivent repartir
// vers l'accueil : #contact seul ne mène nulle part ici.
const toHome = (html) =>
  html.replace(/href="#(?!top\b|main\b)([a-z0-9-]+)"/g, 'href="index.html#$1"');

// La version des assets est lue sur l'accueil : les pages générées ne peuvent
// pas se retrouver avec une feuille de style d'une autre génération.
const assetVersion = (index.match(/style\.css\?v=(\d+)/) || [, '1'])[1];

const header = toHome(between('<a class="skip-link"', '<main id="main">'));
const footer = toHome(index.slice(index.indexOf('<!-- ================= PARCOURS — fenêtre')));

// Cette question revient dans chaque dossier : elle est identique partout.
const FAQ_PASS = ['Vos interventions sont-elles éligibles au pass Culture ?',
  "Oui. Il vous suffit de me contacter pour discuter de votre projet : l'offre est disponible sur la plateforme ADAGE quelques heures après notre échange. Je suis également agréé par l'Éducation nationale."];

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
    seoTitle: "Ateliers slam pour collèges, lycées et structures — Esope",
    shots: [["page-slam-1.jpg", "Un groupe en train d'écrire pendant un atelier slam"], ["page-slam-2.jpg", "Une participante au micro lors de la restitution d'un atelier slam"], ["page-slam-3.jpg", "Le groupe réuni avec son enseignant à la fin d'un atelier slam"]],
    faq: [
      ["Un atelier slam, c'est quoi exactement ?",
       "Une séance d'écriture et d'oralité animée par un slameur professionnel. On y écrit un texte poétique personnel, puis on apprend à le dire debout, devant les autres. L'écriture et la mise en voix comptent autant l'une que l'autre : dans le slam, on écrit pour dire."],
      ["Faut-il déjà savoir écrire de la poésie pour participer ?",
       "Non, et c'est même le contraire : l'atelier slam s'adresse d'abord à ceux que le mot « poésie » fait fuir. Les jeux collectifs à voix haute passent avant la page blanche, et chaque étape de l'écriture est découpée et accompagnée. Personne ne se retrouve seul face à sa feuille."],
      ["Combien d'heures prévoir pour un projet slam ?",
       "Un projet tourne autour de 8 h en moyenne, en séances de 2 h. C'est le format où les participants produisent le plus. Cela dit, chaque projet se construit au cas par cas : il m'arrive de mener 20 h avec une classe puis 4 h avec une autre. Dites-moi votre volume, je vous dis ce qu'on peut viser."],
      ["L'atelier slam entre-t-il dans le programme de français ?",
       "Oui. Rimes, métrique, figures de style, rhétorique : toutes les notions du chapitre poésie sont abordées, mais par la pratique et dans l'ordre qui sert le texte de l'élève plutôt que celui du manuel. Beaucoup d'enseignants s'en servent comme porte d'entrée avant le cours, ou comme prolongement après."],
      ["Et si un élève refuse de monter sur scène ?",
       "Personne n'est forcé. Le passage se prépare progressivement — d'abord assis, puis debout, puis devant quelques-uns, puis devant le groupe — et celui qui ne veut pas lire peut faire lire son texte. Dans les faits, la grande majorité finit par passer, parce que le cadre a été posé dès la première heure."],
      FAQ_PASS,
    ],
    demo: ['slam', "écrire une métaphore", "Un verbe, un sujet qu’Esope tire au sort, et une phrase à finir. Deux minutes, directement dans votre navigateur — sans inscription."],
    color: 'turquoise',
    title: 'Ateliers slam',
    baseline: "Réconcilier les jeunes avec la langue française par un art actuel et accessible. Les élèves écrivent, puis montent sur scène.",
    meta: "Atelier slam en milieu scolaire et structures jeunesse : écriture poétique, mise en voix, restitution scénique. Agréé Éducation nationale, éligible pass Culture.",
    facts: [['Public', 'Tout public'], ['Format type', 'Projet de 8 h en moyenne'], ['Jauge', '30 personnes maximum'], ['Restitution', "Scène slam en fin de parcours + slam d'Esope"]],
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
    seoTitle: "Ateliers éloquence et préparation au grand oral — Esope",
    shots: [["page-eloquence-1.jpg", "Une prise de parole debout pendant un atelier d'éloquence"], ["page-eloquence-2.jpg", "Une joute oratoire devant un jury en fin de parcours"], ["page-eloquence-3.jpg", "Le groupe en cercle pendant un échauffement d'éloquence"]],
    faq: [
      ["Un atelier d'éloquence, c'est quoi ?",
       "Un entraînement à la prise de parole en public : construire un argumentaire, choisir ses mots, tenir sa voix, occuper le silence, gérer le trac. On s'adosse toujours à une échéance concrète — un grand oral, un concours, une soutenance, une prise de parole devant l'établissement."],
      ["L'atelier prépare-t-il au grand oral ?",
       "Directement. La structuration d'un propos, la gestion du temps, le regard, le souffle et la reprise après une hésitation sont exactement ce que l'épreuve évalue. Les passages sont minutés et, sur demande, filmés : voir sa propre prestation fait plus avancer qu'un long conseil."],
      ["Et les élèves paralysés par le trac ?",
       "On en parle explicitement dès la première heure. Un trac nommé est un trac qui rétrécit ; un trac tu devient un blocage. Les passages commencent très courts et en binôme, avant d'aller vers le groupe : la progression est conçue pour que personne ne se retrouve exposé trop tôt."],
      ["Faut-il un jury extérieur pour la restitution ?",
       "Ce n'est pas obligatoire, mais ça change tout. Un jury composé d'adultes de l'établissement, de parents ou de partenaires donne un enjeu réel au passage. À défaut, la restitution se fait devant le groupe, et je tiens le rôle de la tribune à convaincre."],
      ["Quelle différence avec un atelier de théâtre ?",
       "Au théâtre, on interprète un texte et un personnage. En éloquence, on défend sa propre pensée, avec ses propres mots, sans personnage derrière lequel s'abriter. Le travail du corps et de la voix est proche, l'enjeu est tout autre — et c'est celui des épreuves orales."],
      FAQ_PASS,
    ],
    demo: ['eloquence', "prendre la parole 60 secondes", "Un sujet tiré au sort, soixante secondes pour en parler à voix haute, puis un retour sur ce qui s’est joué. Directement dans votre navigateur — sans inscription."],
    color: 'green',
    title: 'Ateliers éloquence',
    baseline: "Argumenter, tenir sa voix, occuper le silence. La prise de parole appliquée à une échéance réelle.",
    meta: "Atelier éloquence : construction d'argumentaire, joutes oratoires, gestion du stress, préparation au grand oral. Pour lycées, universités et structures jeunesse.",
    facts: [['Public', 'Tout public. Idéal +15 ans'], ['Format type', 'Projet de 6 h en moyenne'], ['Jauge', '30 personnes maximum'], ['Restitution', 'Discours en public ou concours']],
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
    seoTitle: "Ateliers rap : écriture, enregistrement et clip — Esope",
    shots: [["page-rap-1.jpg", "Un participant en train d'enregistrer sa voix lors d'un atelier rap"], ["page-rap-2.jpg", "Le groupe réuni autour du montage du clip"], ["page-rap-3.jpg", "Les participants écoutent le titre terminé"]],
    faq: [
      ["Un atelier rap, c'est quoi ?",
       "Un parcours complet, de la page à la restitution : choix d'une instrumentale, écriture en mesures, travail du flow, enregistrement des voix, et selon le volume horaire, tournage d'un clip. À la fin, il existe un titre qu'on peut faire écouter."],
      ["Faut-il du matériel ou un studio dans la structure ?",
       "Non, je viens avec de quoi enregistrer. Une salle calme suffit pour les prises voix. Si votre structure dispose d'un studio ou d'un espace son, on s'en sert — mais ce n'est jamais une condition pour lancer le projet."],
      ["Que deviennent les textes et l'enregistrement ?",
       "Ils appartiennent aux participants et à la structure. Je vous remets les fichiers à la fin du parcours. Rien n'est diffusé sans votre accord et sans celui des familles quand il s'agit de mineurs : la question des autorisations se règle en amont, au moment de la convention."],
      ["Comment gérez-vous les textes qui dérapent ?",
       "Le cadre est posé dès la première séance, et il est artistique avant d'être disciplinaire : une insulte n'est pas une punchline, une provocation gratuite n'est pas une image. Chercher mieux que la facilité fait partie de l'exercice, et c'est souvent là que les participants progressent le plus."],
      ["L'atelier rap convient-il à un public éloigné de l'écrit ?",
       "C'est même sa force. Le rap fait entrer par la porte du son des compétences d'écriture exigeantes : compter ses syllabes devient désirable quand c'est le rythme qui l'impose. C'est régulièrement le format qui mobilise les jeunes les plus à distance de la feuille."],
      FAQ_PASS,
    ],
    demo: ['rap', "trouver des rimes", "Un mot, soixante secondes, et autant de rimes que vous pouvez en trouver. Directement dans votre navigateur — sans inscription."],
    color: 'periwinkle',
    title: 'Ateliers rap',
    baseline: "De la rédaction d'un texte à l'enregistrement et au clip. Une immersion artistique aux objectifs très concrets.",
    meta: "Atelier rap : écriture en rimes, placement sur instrumental, flow, enregistrement d'une maquette et réalisation d'un clip. Pour collèges, lycées et structures jeunesse.",
    facts: [['Public', 'Tout public. Idéal +15 ans'], ['Format type', 'Projet de 10 h en moyenne'], ['Jauge', '30 personnes maximum'], ['Restitution', 'Scène rap ou diffusion du clip']],
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
    video: 'esope',
    seoTitle: "Ateliers battle de compliments : écrire des punchlines — Esope",
    shots: [["page-battle-1.jpg", "L'écriture des punchlines pendant un atelier battle de compliments"], ["page-battle-2.jpg", "Un face-à-face sur scène lors d'un battle de compliments"], ["page-battle-3.jpg", "Le public qui encourage pendant un battle de compliments"]],
    faq: [
      ["Un battle de compliments, c'est quoi ?",
       "Un face-à-face verbal emprunté aux battles de rap, avec une seule inversion : au lieu de chercher à démolir l'autre, on cherche à le valoriser. Mêmes codes, même énergie, même public qui réagit — mais chaque punchline est un éloge."],
      ["Est-ce que les participants improvisent ?",
       "Non, et c'est la surprise de l'atelier : tout est écrit. On travaille le verbe, la verve et le mot fort, on réécrit, on resserre. C'est un atelier d'écriture avant d'être un exercice de scène, et c'est justement ce travail en amont qui rend la répartie vive le jour du passage."],
      ["Le battle ne risque-t-il pas de retomber en moqueries ?",
       "C'est exactement ce que la forme désamorce, en détournant les codes de la vanne. On apprend à peser ses mots : un compliment mal ajusté tombe à plat aussi sûrement qu'une vanne ratée. Le public n'est pas un jury — il encourage, et il crie à chaque punchline valorisante."],
      ["À partir de quel âge ?",
       "L'atelier fonctionne avec tout public. Il est particulièrement efficace avec les groupes où la moquerie tient une place, ce qui le rend souvent pertinent dès la fin du primaire et sur tout le collège — mais il marche aussi très bien avec des adultes, en cohésion d'équipe."],
      ["Peut-on faire un battle sur un format court ?",
       "Oui, une découverte tient en quelques heures. Le format complet, autour de 10 h, laisse le temps d'écrire vraiment, de réécrire et de préparer une scène de fin. Sur un format court, on garde l'écriture et le passage, sans la phase de réécriture."],
      FAQ_PASS,
    ],
    demo: ['battle', "faire une punchline", "Une qualité, une image, deux mots pour les relier, et le compliment devient imparable. Deux minutes, directement dans votre navigateur — sans inscription."],
    color: 'magenta',
    title: 'Battle de compliments',
    baseline: "Le battle de rue, retourné : deux artistes s'affrontent à coups d'éloges devant un public qui encourage.",
    meta: "Atelier battle de compliments : écrire des punchlines valorisantes, travailler le verbe et la verve, puis se lancer en face-à-face sur scène. Redoutable pour souder un groupe et détourner les codes de la moquerie.",
    facts: [['Public', 'Tout public'], ['Format type', 'Projet de 10 h en moyenne'], ['Jauge', '30 personnes maximum'], ['Restitution', "Scène de battle + battle d'Esope contre un·e collègue"]],
    intro: "Une discipline insolite qui met le verbe à l'honneur dans un exercice rhétorique positif. Le principe est simple, la mécanique redoutable : elle emprunte aux codes de la vanne et de la punchline pour les retourner en éloge. Et contrairement à ce qu'on imagine, rien ne s'improvise — les textes s'écrivent, se retravaillent et se resserrent avant de passer devant les autres.",
    steps: [
      ['Poser les règles', "Deux adversaires, un temps donné, un public qui encourage. Les mêmes codes que le battle de rap, avec une seule inversion : on ne cherche pas à démolir, on cherche à flatter."],
      ['Travailler le mot fort', "Le verbe, la verve, l'image qui frappe. On cherche l'adjectif juste plutôt que l'adjectif fort — et on apprend surtout à peser ses mots : un compliment mal ajusté tombe à plat aussi sûrement qu'une vanne ratée."],
      ['Écrire ses punchlines', "Chacun écrit, relit, resserre. C'est un atelier d'écriture avant d'être un exercice de scène : la répartie se prépare, et c'est ce travail en amont qui la rend vive le jour du passage."],
      ['Passer en binôme', "Les face-à-face s'enchaînent, courts et rythmés. Le public crie à chaque punchline valorisante : c'est lui qui porte l'énergie de la salle, et personne n'est noté."],
      ['Finir par un vrai battle', "Je clôture le parcours par un battle contre un·e collègue, devant le groupe. Voir des professionnels se prêter à l'exercice qu'on vient de vivre change le regard qu'on porte sur son propre passage."],
    ],
    goals: ['eloquence', 'confiance', 'partage', 'oralite'],
    definition: ["Le battle", "Le battle est un héritage direct de la culture hip-hop, où deux MC s'affrontent verbalement devant un public. Le battle de compliments en conserve la forme — le face-à-face, le rythme, l'énergie collective — en inversant l'intention. Les textes sont écrits et travaillés en amont : on y affine le verbe, la verve et le mot fort, et on apprend à peser ses mots."],
    school: "C'est le format le plus demandé en médiation et en cohésion de groupe. Il désamorce les moqueries en en détournant les codes, et fonctionne particulièrement bien en début d'année ou à la suite d'un conflit de classe. Le travail d'écriture qu'il demande en fait aussi un vrai support de français.",
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
      <div class="goal"><em aria-hidden="true"></em><b>${name}</b><span>${text}</span></div>`;
  }).join('');

  const steps = p.steps.map(([t, d]) => `
      <div class="step">
        <span class="step__n" aria-hidden="true"></span>
        <div class="step__body"><h3>${t}</h3><p>${d}</p></div>
      </div>`).join('');

  const facts = p.facts.map(([k, v]) => `
      <div class="fact"><b>${k}</b><span>${v}</span></div>`).join('');

  const slug = p.file.replace('.html', '');
  const faq = p.faq.map(([q, r], i) => `
      <div class="faq__item">
        <h3><button class="faq__q" type="button" aria-expanded="false" aria-controls="${slug}-faq-${i + 1}">
          ${q}<span class="faq__icon" aria-hidden="true">+</span></button></h3>
        <div class="faq__a" id="${slug}-faq-${i + 1}"><div><p>${r}</p></div></div>
      </div>`).join('');

  // Données structurées : la FAQ peut remonter telle quelle dans les résultats.
  const jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Course',
        name: p.title,
        description: p.meta,
        inLanguage: 'fr',
        teaches: p.goals.map((k) => OBJECTIFS[k][0]).join(', '),
        provider: { '@type': 'Person', name: 'Esope', jobTitle: 'Slameur et intervenant artistique' },
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

  /* Emplacement vidéo : dès qu'un fichier est déposé dans assets/video/, il
     remplace l'affiche. Tant qu'il n'y est pas, aucune requête en 404. */
  // L'affiche suit toujours la page ; le fichier vidéo peut être partagé.
  const cle = p.video || p.demo[0];
  const mp4 = existsSync(join(root, 'assets', 'video', `atelier-${cle}.mp4`));
  const webm = existsSync(join(root, 'assets', 'video', `atelier-${cle}.webm`));
  const affiche = `assets/img/video-${p.demo[0]}.jpg`;
  const altVideo = `${p.title} en vidéo`;
  const film = `
      <figure class="shot shot--video" style="--bande:var(--${p.color})" data-reveal>${mp4 ? `
    <video poster="${affiche}" autoplay muted loop playsinline preload="metadata"
           aria-label="${altVideo}" width="720" height="1280">${webm ? `
      <source src="assets/video/atelier-${cle}.webm" type="video/webm">` : ''}
      <source src="assets/video/atelier-${cle}.mp4" type="video/mp4">
    </video>` : `
    <img src="${affiche}" alt="${altVideo}" loading="lazy" width="720" height="1280">`}
      </figure>`;

  // Une respiration entre deux blocs de texte : la photo pose le regard.
  const shot = (i) => `
<div class="wrap">
  <figure class="shot" style="--bande:var(--${p.color})" data-reveal>
    <img src="assets/img/${p.shots[i][0]}" alt="${p.shots[i][1]}" loading="lazy" width="1600" height="760">
  </figure>
</div>`;

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
  <a class="crumb" href="index.html"><span class="arrow" aria-hidden="true">←</span> Toutes les interventions</a>
  <div class="page-hero__band band--${p.color}">
    <svg class="scribbles" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
      <path d="M-20 70 C120 10 260 130 420 50 M-20 200 C100 150 300 260 420 190 M90 -20 C120 120 60 200 130 320 M300 -20 C280 110 350 190 300 320"/>
    </svg>
    <span class="page-hero__watermark" aria-hidden="true">${p.title.split(' ').pop()}</span>
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
  <div class="parcours">
${film}
    <div class="steps" data-stagger>${steps}
    </div>
  </div>
</section>
${shot(0)}

<section class="section section--close wrap">
  <a class="tryout band--${p.color}" href="demo.html#demo-${p.demo[0]}" data-reveal>
    <span class="tryout__label">Démo en ligne · gratuite</span>
    <span class="tryout__title">Essayez l'exercice : ${p.demo[1]}</span>
    <span class="tryout__text">${p.demo[2]}</span>
    <span class="tryout__cta">Lancer la démo <span class="arrow" aria-hidden="true">→</span></span>
  </a>
</section>

<section class="section section--close wrap">
  <div data-reveal style="margin-bottom:clamp(24px,5vw,36px)">
    <h2 class="h2">Les objectifs travaillés</h2>
  </div>
  <div class="goals" data-stagger>${goals}
  </div>
</section>
${shot(1)}

<section class="section section--close wrap">
  <div class="def def--${p.color}" data-reveal>
    <h3>${p.definition[0]}</h3>
    <p>${p.definition[1]}</p>
  </div>
</section>

<section class="section section--close wrap">
  <div class="measure-wide" data-reveal>
    <h2 class="h2">Et côté équipe pédagogique</h2>
    <p class="body-lg mute" style="margin-top:24px">${p.school}</p>
    <div class="btn-row" style="margin-top:32px">
      <a class="btn btn--yellow" href="index.html#contact">Parler de votre projet</a>
    </div>
  </div>
</section>
${shot(2)}

<section class="section section--close wrap" id="faq">
  <div class="center measure" data-reveal style="margin-bottom:clamp(24px,5vw,40px)">
    <h2 class="h2">Questions fréquentes</h2>
    <p class="lead mute" style="margin-top:20px">Ce qu'on me demande le plus souvent avant de
      lancer un projet ${p.title.toLowerCase()}.</p>
  </div>
  <div class="faq" data-stagger>${faq}
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

${footer.replace(/app\.js\?v=\d+/, `app.js?v=${assetVersion}`)}`;

  writeFileSync(join(root, p.file), html);
  console.log('→ ' + p.file);
}
