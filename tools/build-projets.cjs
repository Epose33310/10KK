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
const footer = toHome(index.slice(index.indexOf('<!-- ================= PARCOURS — fenêtre')))
  .replace(/app\.js\?v=\d+/, `app.js?v=${v}`);

const COULEUR = { slam: 'turquoise', rap: 'periwinkle', eloquence: 'green', battle: 'magenta' };
/* La couleur d'une carte peut être forcée : deux récits du même atelier se
   suivent souvent, et deux cartes identiques côte à côte font terne. */
const teinteDe = (a) => a.teinte || COULEUR[a.atelier] || 'yellow';

/* -------------------------------------------------------------------------
   Les récits, du plus récent au plus ancien (champ « ordre »).
   ------------------------------------------------------------------------- */
const ARTICLES = [

/* ====================================================================== 1 */
{
  slug: 'atelier-battle-de-compliments-structure-jeunesse-bassens',
  ordre: 100,
  atelier: 'battle',
  h1: 'Un battle de compliments avec les jeunes de Bassens',
  seo: 'Atelier battle de compliments en structure jeunesse — Bassens',
  meta: "Huit heures d'atelier battle de compliments avec des jeunes volontaires de Bassens, jusqu'à la scène de la Fête de l'avenir. Le déroulé, les techniques, ce qu'on en retire.",
  chapo: "Deux séances de quatre heures avec une douzaine de volontaires, dans une structure jeunesse de Bassens. L'objectif : écrire un battle de compliments assez solide pour tenir devant le public de la Fête de l'avenir.",
  lieu: 'Bassens (Gironde)',
  publics: 'Jeunes d’une structure jeunesse, une douzaine de volontaires',
  format: 'Deux séances de 4 h, restitution à la Fête de l’avenir',
  motCle: 'atelier battle de compliments',
  secondes: ['atelier écriture structure jeunesse', 'atelier slam Bassens'],
  images: {
    principale: { src: 'atelier-battle-de-compliments-bassens.jpg',
      alt: 'Deux jeunes face à face lors d’un atelier battle de compliments, l’un applaudissant l’autre',
      legende: 'Le battle de compliments : deux jeunes face à face, et tout le monde autour.' },
    deux: { src: 'atelier-ecriture-groupe-structure-jeunesse.jpg',
      alt: 'Un groupe de jeunes assis en cercle autour d’un intervenant en atelier d’écriture' },
    trois: { src: 'micro-slam-restitution-scene.jpg',
      alt: 'Un micro tenu à bout de bras avant une prise de parole sur scène',
      legende: 'Ce qui se joue en atelier ne compte vraiment qu’une fois le micro pris.' },
  },
  corps: [
    ['p', `Une structure jeunesse de <b>Bassens</b>, en Gironde, m'a proposé un format que je connais bien et qui reste, à chaque fois, un vrai défi : deux séances de quatre heures, une douzaine de volontaires, et une scène à tenir au bout. Cet <b>atelier battle de compliments</b> devait aboutir à une restitution lors de la Fête de l'avenir, le 9 septembre. Il fallait donc que des jeunes qui ne se connaissaient pas tous écrivent, en huit heures, quelque chose d'assez tenu pour passer la rampe.`],

    ['h2', 'Le contexte : un groupe mouvant, un temps court'],
    ['p', `Le public était volontaire, ce qui change tout, mais il arrivait au compte-gouttes. Des jeunes poussaient la porte en cours de séance, d'autres repartaient plus tôt. C'est la réalité d'une structure jeunesse : on n'y travaille pas avec une classe fermée, on travaille avec un flux. Mon premier travail n'a donc pas été d'écrire, mais d'accrocher — trouver, dans les dix premières minutes d'un jeune qui vient d'entrer, une raison de rester.`],
    ['p', `Le <a href="atelier-battle.html">battle de compliments</a> est un excellent outil pour ça. C'est un format que j'ai développé avec le collectif Ta Mère La Mieux : deux personnes s'affrontent, mais au lieu de se démolir comme dans un battle de rap classique, elles cherchent la punchline la plus valorisante. Le principe se comprend en une phrase, il fait rire immédiatement, et il transforme le rapport au groupe. Personne n'a peur d'écrire un compliment.`],

    ['img', 'deux'],

    ['h2', 'Le déroulement de l’atelier'],
    ['p', `On a commencé debout, en cercle, sans feuille. Un tour de jeux oraux : on se lance des mots, on répond en rebondissant sur la sonorité, on prend l'habitude d'entendre sa propre voix devant les autres. C'est la partie que les nouveaux arrivants pouvaient rejoindre à n'importe quel moment sans se sentir en retard.`],
    ['ul', [
      `<b>L'inventaire.</b> Chacun observe un autre participant et note dix détails concrets : une façon de marcher, une manie, une couleur de veste. Pas d'adjectifs vagues, du précis.`,
      `<b>La montée en image.</b> On reprend un de ces détails et on le transforme en comparaison, puis en métaphore. « Tu ris fort » devient « ton rire, c'est le voisin qui perce un mur à sept heures du matin ».`,
      `<b>Le rythme.</b> On tape le texte à la main sur la table pour trouver où ça tombe juste. Une punchline qui n'a pas de rythme ne fait pas rire, même si elle est bien écrite.`,
      `<b>La mise en bouche.</b> Chacun dit son texte à une seule personne, puis à trois, puis au groupe. On ne passe jamais directement de la feuille à la scène.`,
    ]],
    ['p', `La seconde séance a été consacrée à la confrontation. On tire les duos au sort, on répète, on coupe. C'est presque toujours à ce moment-là que les textes gagnent : obligé de passer après quelqu'un, on comprend tout de suite ce qui fonctionne et ce qui traîne.`],

    ['h2', 'Les techniques travaillées'],
    ['p', `Sous le jeu, on a travaillé exactement ce qu'on travaille dans un <a href="atelier-slam.html">atelier slam</a> : la comparaison, la métaphore, l'économie de mots, le placement du souffle, l'adresse à quelqu'un. Le battle de compliments a ceci de pratique qu'il donne un destinataire clair. Écrire « pour » quelqu'un est infiniment plus facile qu'écrire « sur » un thème, surtout quand on n'a jamais écrit.`],

    ['h2', 'Ce que les participants ont travaillé'],
    ['p', `L'atelier permet de travailler la prise de parole devant un groupe, l'écoute — car pour complimenter précisément, il faut avoir regardé l'autre — et la capacité à formuler une idée en peu de mots. Les participants ont aussi été amenés à supporter le regard du groupe dans un cadre où ce regard est bienveillant par construction. Pour des jeunes qui se croisent sans se connaître, c'est un raccourci : à la fin de la première séance, ils ne se parlaient plus de la même façon.`],

    ['img', 'trois'],

    ['h2', 'Le moment marquant'],
    ['p', `Un garçon arrivé à la deuxième heure de la première séance, resté debout près de la porte, n'a rien écrit pendant quarante minutes. Je ne l'ai pas poussé. Au moment de la mise en bouche, il a demandé s'il pouvait « juste essayer un truc » — et il a sorti quatre lignes qu'il avait manifestement tenues dans sa tête tout ce temps. Elles étaient meilleures que beaucoup de textes couchés sur le papier. Sur scène, à la Fête de l'avenir, c'est lui qui a déclenché la plus grosse réaction du public.`],

    ['expert', {
      titre: 'Deux questions qu’on me pose souvent sur ce format',
      qr: [
        ['Le battle de compliments fonctionne-t-il avec un groupe qui ne se connaît pas ?',
         `C'est même un de ses meilleurs terrains. Le format oblige à observer l'autre avant d'écrire sur lui, ce qui crée en une heure une connaissance mutuelle que des semaines de côtoiement ne produisent pas toujours. Le risque, dans un groupe déjà très soudé, est plutôt l'inverse : les vannes internes prennent le dessus sur l'écriture.`],
        ['Huit heures, est-ce suffisant pour une restitution publique ?',
         `Oui, à condition que la scène soit annoncée dès la première minute. Un groupe qui sait qu'il va passer devant du public écrit autrement. En dessous de six heures, en revanche, je propose plutôt une restitution interne : la scène demande un temps de répétition qu'on ne peut pas comprimer sans fragiliser les participants.`],
      ],
    }],

    ['h2', 'Ce que ce projet a permis d’explorer'],
    ['p', `Ce projet a montré qu'un groupe instable n'est pas un obstacle si le format est assez rapide à comprendre et assez gratifiant pour donner envie de rester. En huit heures, une douzaine de jeunes sont passés d'un cercle de gens qui s'observent à une équipe capable de tenir une scène. Si vous accompagnez un public jeune en structure et que vous cherchez un projet qui produise vite du concret, <a href="index.html#contact">le cadre se construit avec vous</a>.`],
  ],
},

/* ====================================================================== 2 */
{
  slug: 'atelier-ecriture-maison-des-adolescents-bordeaux',
  teinte: 'yellow',
  ordre: 90,
  atelier: 'battle',
  h1: 'Deux heures d’écriture à la Maison des adolescents de Bordeaux',
  seo: 'Atelier d’écriture à la Maison des adolescents — Bordeaux Peyberland',
  meta: "Un atelier d'écriture de deux heures à la Maison des adolescents de Bordeaux Peyberland, avec des jeunes suivis par la Mission locale. Groupe différent à chaque séance : comment on écrit quand même.",
  chapo: "À la Maison des adolescents de Bordeaux Peyberland, le groupe change à chaque séance. Deux heures, une dizaine de participants, et un texte à écrire les uns pour les autres.",
  lieu: 'Maison des adolescents, Bordeaux Peyberland',
  publics: 'Adolescents et jeunes adultes, en lien avec la Mission locale',
  format: 'Séances de 2 h, groupe renouvelé à chaque fois',
  motCle: 'atelier d’écriture Maison des adolescents',
  secondes: ['atelier écriture Bordeaux', 'atelier battle de compliments'],
  images: {
    principale: { src: 'atelier-ecriture-maison-des-adolescents-bordeaux.jpg',
      alt: 'Une jeune femme lit son texte au micro lors d’un atelier d’écriture',
      legende: 'Deux heures suffisent pour qu’un texte existe — à condition de le dire à voix haute avant la fin.' },
    deux: { src: 'atelier-ecriture-table-jeunes-adultes.jpg',
      alt: 'Des jeunes adultes écrivent autour d’une table pendant un atelier d’écriture' },
    trois: { src: 'jeune-cherche-ses-mots-atelier-ecriture.jpg',
      alt: 'Un participant cherche ses mots, la main contre le menton, pendant un atelier d’écriture',
      legende: 'Le silence du milieu de séance : ce n’est pas un blocage, c’est le moment où ça travaille.' },
  },
  corps: [
    ['p', `La Maison des adolescents de <b>Bordeaux Peyberland</b> accueille des jeunes et des jeunes adultes, souvent orientés par la Mission locale. J'y anime un <b>atelier d'écriture</b> au format court : deux heures, une dizaine de participants, et un groupe qui n'est jamais le même d'une fois sur l'autre. Autant dire que rien ne se construit sur la durée : tout doit tenir dans la séance.`],

    ['h2', 'Le contexte : écrire sans connaître le groupe de la veille'],
    ['p', `Dans une classe, on peut s'appuyer sur ce qui a été fait la semaine précédente. Ici, non. Chaque séance recommence à zéro, avec des jeunes qui arrivent pour des raisons très différentes : certains sont là par curiosité, d'autres parce qu'un éducateur le leur a proposé, quelques-uns parce qu'ils écrivent déjà chez eux et n'osent pas trop le dire. C'est une contrainte, mais elle a un avantage : personne ne traîne d'étiquette.`],
    ['p', `J'ai choisi d'orienter ces séances vers le <a href="atelier-battle.html">battle de compliments</a>. Pour un public qui peut arriver sur la défensive, c'est le format le plus désarmant que je connaisse : on écrit les uns pour les autres, et la première chose qu'on reçoit du groupe, c'est du rire et de la reconnaissance.`],

    ['img', 'deux'],

    ['h2', 'Le déroulement de la séance'],
    ['p', `Le minutage est serré, donc il est toujours le même. Dix minutes debout pour casser la glace avec des jeux oraux, sans feuille ni stylo. Vingt minutes d'observation et de collecte : on note des détails concrets sur la personne qu'on aura en face. Quarante minutes d'écriture, pendant lesquelles je passe de table en table — c'est là que se fait le vrai travail, texte par texte. Puis trente minutes de mise en voix et de confrontation, et un quart d'heure de clôture.`],
    ['p', `La consigne d'écriture tient en une phrase : « trouve ce que cette personne fait mieux que toi, et dis-le de façon qu'on l'imagine ». Les participants ont été amenés à chercher du précis plutôt que du flatteur, ce qui est beaucoup plus difficile — et beaucoup plus efficace.`],

    ['h2', 'Les techniques travaillées'],
    ['p', `En deux heures, je concentre sur trois outils : la comparaison, la chute et le rythme. La comparaison parce qu'elle est immédiatement accessible et qu'elle fait tout le travail d'image. La chute parce qu'un texte court vit ou meurt sur sa dernière ligne. Le rythme parce que c'est ce qui sépare un texte lu d'un texte dit. Le reste — construction longue, jeux de rimes internes, souffle — appartient aux formats plus longs, comme un <a href="atelier-slam.html">projet slam</a> sur plusieurs séances.`],

    ['h2', 'Ce que la séance permet de travailler'],
    ['p', `Cette séance offre un espace pour formuler une idée devant des gens qu'on ne connaît pas, écouter avec attention, et recevoir un retour positif sans le désamorcer par une blague. Pour beaucoup de participants, l'exercice difficile n'est pas d'écrire un compliment, mais d'en entendre un jusqu'au bout. C'est souvent là que la séance devient intéressante.`],

    ['img', 'trois'],

    ['h2', 'Le moment marquant'],
    ['p', `Une participante a demandé, à la fin, si elle pouvait garder la feuille où quelqu'un avait écrit sur elle. Puis une deuxième. Puis tout le monde. On a terminé la séance à échanger les brouillons plutôt qu'à les ramasser. Je ne l'avais pas prévu, et je l'ai gardé depuis : les textes repartent avec ceux qu'ils décrivent.`],

    ['expert', {
      titre: 'Ce qu’il faut savoir avant de programmer ce format',
      qr: [
        ['Un atelier de deux heures a-t-il un intérêt si le groupe change à chaque fois ?',
         `Oui, à condition d'assumer que l'objectif est la séance elle-même et non un projet cumulatif. Chaque atelier est alors conçu comme une unité complète : une entrée, une production écrite, une prise de parole. Ce qui se transmet d'une séance à l'autre, ce n'est pas le texte, c'est la réputation de l'atelier dans la structure — et c'est ce qui fait revenir.`],
        ['Comment repérer les jeunes qui écrivent déjà ?',
         `Ils se signalent presque toujours de la même façon : ils écrivent vite, ils rient moins des consignes, et ils attendent la fin pour montrer. Je ne les désigne jamais devant le groupe. Je passe les voir individuellement pendant la phase d'écriture et je leur donne une contrainte supplémentaire. Ça les occupe, ça les respecte, et ça évite qu'ils s'ennuient.`],
      ],
    }],

    ['h2', 'Ce que ces séances permettent d’explorer'],
    ['p', `Ce qui m'intéresse dans ce format, c'est la démonstration qu'il fait : il ne faut pas beaucoup de temps pour qu'un jeune produise un texte dont il est fier, il faut un cadre clair et une raison d'écrire. Si votre structure accueille un public en flux — <a href="index.html#format">mission locale, accueil de jour, foyer</a> — ce format court se cale facilement dans une programmation existante.`],
  ],
},

/* ====================================================================== 3 */
{
  slug: 'atelier-slam-college-arveyres-solidarite',
  ordre: 80,
  atelier: 'slam',
  h1: 'Un projet slam sur la solidarité avec tous les 4e du collège d’Arveyres',
  seo: 'Atelier slam en collège : un projet sur la solidarité à Arveyres',
  meta: "Plus de vingt heures d'atelier slam avec tous les niveaux de 4e du collège d'Arveyres, sur le thème de la solidarité, jusqu'à une restitution dans le gymnase devant l'établissement entier.",
  chapo: "Tous les 4e du collège d'Arveyres ont écrit sur la solidarité. Plus de vingt heures d'atelier, puis une restitution dans le gymnase, à plus de quarante sur scène devant tout le collège.",
  lieu: 'Collège d’Arveyres (Gironde)',
  publics: 'Toutes les classes de 4e',
  format: 'Plus de 20 h de projet, restitution dans le gymnase',
  motCle: 'atelier slam collège',
  secondes: ['projet slam 4e', 'atelier slam Gironde'],
  images: {
    principale: { src: 'atelier-slam-college-arveyres.jpg',
      alt: 'Un intervenant slam anime une séance d’écriture devant une classe de collège',
      legende: 'Vingt heures d’atelier : le temps de passer de la consigne à un texte qu’on assume debout.' },
    deux: { src: 'eleves-solidarite-projet-slam-college.jpg',
      alt: 'Quatre élèves de dos, bras sur les épaules, après un atelier slam sur la solidarité' },
    trois: { src: 'carnet-ecriture-slam-eleves.jpg',
      alt: 'Un carnet d’atelier slam ouvert, portant les mots écrire, ressentir, oser, partager',
      legende: 'Les quatre étapes affichées au tableau pendant tout le projet.' },
  },
  corps: [
    ['p', `Le collège d'<b>Arveyres</b>, en Gironde, a monté un projet ambitieux : faire écrire <b>tous</b> ses niveaux de 4e sur le thème de la solidarité, et réunir l'établissement entier pour la restitution. Cet <b>atelier slam en collège</b> a représenté plus de vingt heures d'intervention au total — un volume qui change complètement ce qu'on peut viser.`],

    ['h2', 'Le contexte : un thème imposé, et c’est tant mieux'],
    ['p', `L'équipe pédagogique avait choisi la solidarité comme fil rouge. Un thème imposé effraie parfois, mais c'est en réalité un cadeau pour un atelier d'écriture : il évite la question qui bloque le plus les élèves, « sur quoi j'écris ? ». Reste à le rendre écrivable. « La solidarité » en soi ne produit que des platitudes. Ce qui produit un texte, c'est une scène : quelqu'un qui tend la main, quelqu'un qui ne la prend pas, une file d'attente, un banc, un couloir de collège.`],
    ['p', `Mon premier travail a donc été de descendre du concept au concret. Chaque élève devait arriver avec un souvenir précis — pas une opinion. À partir de là, le <a href="atelier-slam.html">slam</a> fait le reste : il autorise à parler de soi sans se raconter.`],

    ['img', 'deux'],

    ['h2', 'Le déroulement du projet'],
    ['p', `Avec vingt heures, on peut construire une vraie progression au lieu d'enchaîner des exercices. Le projet s'est déroulé en quatre temps.`],
    ['ul', [
      `<b>Entrer.</b> Jeux oraux collectifs, sans feuille. On installe le droit de parler fort, et l'idée que le texte se dit.`,
      `<b>Écrire.</b> Collecte de souvenirs concrets, puis travail d'image : comparaison, métaphore, anaphore. L'anaphore, en particulier, est une béquille formidable pour un premier texte — on donne un début de vers, l'élève le répète et le complète.`,
      `<b>Oser.</b> Passage au micro en petit groupe, puis devant la classe. On travaille le regard, le débit, les silences. C'est l'étape la plus longue et la moins spectaculaire.`,
      `<b>Partager.</b> Répétitions collectives en vue du gymnase, mise en ordre des textes, enchaînements, gestion des entrées et sorties.`,
    ]],
    ['p', `Le passage du texte individuel au collectif a été la vraie difficulté. Quarante textes mis bout à bout font un catalogue, pas un spectacle. On a donc cherché des échos : un vers d'un élève repris en chœur par cinq autres, des textes tuilés, un fil qui court d'une classe à l'autre.`],

    ['h2', 'Les techniques travaillées'],
    ['p', `Sur ce volume horaire, on va nettement plus loin que dans un atelier court : construction d'un texte entier, rimes et assonances employées sciemment plutôt qu'au hasard, rythme et respiration, adresse au public, et surtout réécriture. Vingt heures, c'est le temps qu'il faut pour qu'un élève accepte de couper une phrase dont il est amoureux parce qu'elle n'apporte rien.`],

    ['h2', 'Ce que les élèves ont travaillé'],
    ['p', `Le projet permet de travailler la maîtrise du langage — les élèves écrivent plus, et mieux, que dans un devoir noté — mais aussi l'écoute, la coopération et la prise de parole devant un grand groupe. J'observe souvent la même chose en collège : le classement scolaire se déforme. Un élève en difficulté sur l'écrit scolaire peut être excellent au micro, et l'établissement le découvre en même temps que lui.`],

    ['h2', 'Le moment marquant'],
    ['p', `La restitution avait lieu dans le gymnase, devant tout le collège. Plus de quarante participants sur scène. Au moment du premier passage, le silence est tombé d'un coup dans une salle où quelques centaines d'élèves venaient de s'installer — et il a tenu. C'est immense, un gymnase, et c'est le pire des lieux pour la voix ; mais l'attention du public a porté les élèves bien plus sûrement qu'une sonorisation.`],

    ['img', 'trois'],

    ['expert', {
      titre: 'Monter un projet slam sur un niveau entier : ce qu’il faut anticiper',
      qr: [
        ['Combien d’heures faut-il pour aboutir à une restitution publique ?',
         `Pour une classe, je vise entre 8 et 12 h si l'objectif est une restitution devant un autre groupe. Pour un niveau entier avec une scène commune, il faut passer les 20 h : le temps d'écriture ne change pas beaucoup, mais le temps de mise en scène collective, lui, est proportionnel au nombre d'élèves.`],
        ['Comment intégrer un projet slam au programme de français ?',
         `Le slam recoupe directement la poésie, l'argumentation et l'oral. En 4e, le travail sur l'image poétique et la prise de parole s'articule sans effort avec les attendus du cycle 4, et la restitution peut servir de support d'évaluation orale. Je cale toujours le déroulé avec l'équipe enseignante en amont plutôt que d'arriver avec un contenu fermé.`],
        ['Un thème imposé bride-t-il l’écriture des élèves ?',
         `L'inverse, en général. Ce qui bride, c'est un thème abstrait laissé tel quel. Un thème comme la solidarité devient moteur dès qu'on le traduit en situations concrètes à raconter. Le rôle de l'intervenant est précisément là : faire le passage entre l'intention pédagogique et une consigne d'écriture qui produise du texte.`],
      ],
    }],

    ['h2', 'Ce que ce projet a permis d’explorer'],
    ['p', `Un niveau entier qui écrit sur le même thème, c'est quarante angles différents sur une même question — et c'est exactement ce qu'un établissement peut en attendre. Le collège d'Arveyres a vu ses 4e se mettre debout devant lui. D'autres structures ont raconté ce type de projet dans la presse locale : on en trouve plusieurs dans les <a href="temoignages.html">témoignages et articles</a>. Si vous préparez un projet d'établissement de ce type, <a href="index.html#contact">dites-moi votre volume horaire et votre thème</a>.`],
  ],
},

/* ====================================================================== 4 */
{
  slug: 'atelier-rap-ueaj-bordeaux',
  ordre: 70,
  atelier: 'rap',
  h1: 'Atelier rap à l’UEAJ de Bordeaux : écrire son passé, écrire son avenir',
  seo: 'Atelier rap à Bordeaux : deux heures avec un petit groupe à l’UEAJ',
  meta: "Deux heures d'atelier rap à l'UEAJ de Bordeaux, avec quatre ou cinq jeunes. Écrire sur son passé et son avenir quand on pratique déjà, sans l'avoir dit à personne.",
  chapo: "Un petit groupe, deux heures, et une consigne en deux temps : d'où tu viens, où tu vas. À l'UEAJ de Bordeaux, plusieurs participants écrivaient déjà du rap sans le dire.",
  lieu: 'UEAJ, Bordeaux',
  publics: 'Petit groupe de quatre à cinq jeunes',
  format: 'Atelier de 2 h',
  motCle: 'atelier rap',
  secondes: ['atelier écriture rap Bordeaux', 'atelier rap jeunes'],
  images: {
    principale: { src: 'atelier-rap-ueaj-bordeaux.jpg',
      alt: 'Un jeune en casquette pose sa voix au micro pendant un atelier rap',
      legende: 'En atelier rap, le passage au micro arrive vite : c’est là que le texte se vérifie.' },
    deux: { src: 'jeune-ecrit-son-texte-rap.jpg',
      alt: 'Un participant écrit son texte de rap dans un carnet pendant l’atelier' },
    trois: { src: 'carnet-poesie-facon-de-se-battre.jpg',
      alt: 'Un carnet ouvert portant la phrase : la poésie c’est aussi une façon de se battre',
      legende: 'La phrase que je laisse au tableau quand un groupe se demande ce qu’il fait là.' },
  },
  corps: [
    ['p', `L'UEAJ de <b>Bordeaux</b> m'a proposé un <b>atelier rap</b> de deux heures avec un petit groupe : quatre à cinq jeunes. Un effectif réduit change la nature de la séance — on ne gère plus un groupe, on travaille texte par texte. La consigne tenait en deux temps : écrire sur son passé, puis sur son avenir.`],

    ['h2', 'Le contexte : un format qu’ils n’attendaient pas'],
    ['p', `Le rap n'est pas une activité neutre pour ce public. C'est une musique qu'ils écoutent, dont ils connaissent les codes mieux que moi sur certains points, et qu'ils n'ont pas l'habitude de voir proposée dans un cadre encadré. Le simple fait que l'atelier s'appelle « rap » et non « écriture » a suffi à installer une attente positive dès l'entrée.`],
    ['p', `Très vite, j'ai repéré les habitués. Il y en a presque toujours : des jeunes qui écrivent déjà chez eux, seuls, et qui ne l'annoncent pas — parce qu'écrire est un truc qu'on garde, et parce que dire qu'on rappe, c'est prendre le risque qu'on vous demande d'en faire la preuve. Ils se trahissent par des détails : le vocabulaire technique, la vitesse d'écriture, la façon de compter les syllabes sur les doigts.`],

    ['img', 'deux'],

    ['h2', 'Le déroulement de l’atelier'],
    ['p', `En deux heures et à cinq, on peut se permettre d'aller droit au texte. Après un temps d'échange sur ce qu'ils écoutent — qui n'est pas de la politesse, c'est là que je choisis mes exemples — on a attaqué la première moitié de la consigne.`],
    ['ul', [
      `<b>Le passé.</b> Non pas « raconte ta vie », mais « choisis un lieu où tu as passé du temps et décris-le sans dire ce que tu y ressentais ». L'émotion passe mieux par le décor que par l'adjectif.`,
      `<b>L'avenir.</b> Même règle : un lieu, une scène, un détail concret. Le piège de cette moitié est la déclaration d'intention. On la coupe systématiquement.`,
      `<b>Le placement.</b> On pose les textes sur une instrumentale simple pour trouver où tombent les accents. C'est ce que les habitués attendaient depuis le début.`,
    ]],

    ['h2', 'Les techniques travaillées'],
    ['p', `Le rap est exigeant sur des points que le <a href="atelier-slam.html">slam</a> laisse plus libres : le nombre de syllabes, la place de la rime, la tenue du flow sur une mesure. On a travaillé les rimes multiples, l'enjambement, et surtout la réécriture au service du placement — accepter de changer un mot juste parce qu'il tombe mal. Pour ceux qui écrivaient déjà, c'était souvent la première fois qu'on leur donnait le vocabulaire de ce qu'ils faisaient d'instinct.`],

    ['h2', 'Ce que les participants ont travaillé'],
    ['p', `Cet atelier offre un espace pour mettre des mots sur un parcours personnel sans avoir à l'expliquer, ce qui n'est pas rien pour un public habitué à être interrogé sur son histoire. Les participants ont été amenés à structurer un propos, à assumer une production devant un petit groupe, et à découvrir que leur pratique solitaire avait une technique — donc pouvait progresser. Le groupe est reparti plus léger qu'il n'était arrivé.`],

    ['img', 'trois'],

    ['h2', 'Le moment marquant'],
    ['p', `Un participant qui n'avait rien dit de la première heure a demandé, au moment de poser les textes sur l'instrumentale, s'il pouvait « en faire un autre à la place ». Il avait écrit le sien en entier, mentalement, pendant qu'on travaillait. Quand il l'a posé, les autres se sont regardés : ils ne savaient pas. Lui non plus ne savait pas qu'ils écrivaient.`],

    ['expert', {
      titre: 'Deux questions fréquentes sur l’atelier rap en structure',
      qr: [
        ['Faut-il savoir rapper pour animer ou accueillir un atelier rap ?',
         `Pour l'accueillir, non : l'équipe n'a rien à préparer sur le fond. Pour l'animer, il faut connaître la technique de l'intérieur, faute de quoi le public le repère en dix minutes et l'atelier perd sa légitimité. C'est la principale différence entre un atelier rap et un atelier d'écriture généraliste qui prendrait le rap comme prétexte.`],
        ['Un petit groupe est-il un bon format ?',
         `C'est le meilleur pour le rap. À quatre ou cinq, chacun passe plusieurs fois au micro et reçoit un retour individuel sur son texte. Au-delà d'une douzaine, le temps de passage devient le facteur limitant et il faut soit allonger la séance, soit accepter que tout le monde ne pose pas.`],
      ],
    }],

    ['h2', 'Ce que cet atelier a permis d’explorer'],
    ['p', `Proposer le <a href="atelier-rap.html">rap</a> dans un cadre éducatif, c'est reconnaître une pratique que les jeunes ont déjà et lui donner un espace légitime. En deux heures, ça suffit à changer le statut de ceux qui écrivaient en cachette. Si vous accompagnez un petit groupe et cherchez une activité qui parle immédiatement, <a href="index.html#contact">on peut caler un format court</a>.`],
  ],
},

/* ====================================================================== 5 */
{
  slug: 'atelier-slam-printemps-des-poetes-albi-blaye-les-mines',
  teinte: 'green',
  ordre: 60,
  atelier: 'slam',
  h1: 'Printemps des poètes : deux collèges, une scène commune',
  seo: 'Atelier slam et Printemps des poètes : deux collèges du Tarn sur scène',
  meta: "Quatre classes, deux collèges du Tarn, une restitution commune en amphithéâtre devant plus de 200 personnes. Comment se monte un projet slam dans le cadre du Printemps des poètes.",
  chapo: "Deux collèges du Tarn mènent le même projet slam pour le Printemps des poètes, se partagent les frais et se retrouvent sur une scène commune. C'est la quatrième année.",
  lieu: 'Collège Jean-Jaurès (Albi) et collège Augustin-Malroux (Blaye-les-Mines)',
  publics: 'Quatre classes, deux par établissement',
  format: 'Environ 5 h par classe, restitution commune en amphithéâtre',
  motCle: 'atelier slam Printemps des poètes',
  secondes: ['atelier slam collège Tarn', 'restitution slam amphithéâtre'],
  images: {
    principale: { src: 'restitution-slam-printemps-des-poetes-amphitheatre.jpg',
      alt: 'Un élève au micro sur la scène d’un amphithéâtre lors d’une restitution slam',
      legende: 'Plus de 200 personnes dans la salle : pour un collégien, la marche est haute.' },
    deux: { src: 'collegiens-slam-devant-albi.jpg',
      alt: 'Des collégiens assis face à une ville dominée par un clocher, avant un atelier slam' },
    trois: { src: 'scene-slam-college-restitution-publique.jpg',
      alt: 'Un participant bras ouverts sur scène pendant une restitution publique de slam',
      legende: 'La dernière séance ne sert plus à écrire : elle sert à tenir debout.' },
  },
  corps: [
    ['p', `Chaque année, deux collèges du Tarn — <b>Jean-Jaurès à Albi</b> et <b>Augustin-Malroux à Blaye-les-Mines</b> — mènent le même projet dans le cadre du <b>Printemps des poètes</b>. Deux classes dans chaque établissement, environ cinq heures par classe, et une restitution commune dans l'amphithéâtre du lycée de Blaye-les-Mines, devant plus de deux cents personnes. C'est la quatrième année que ce projet se monte.`],

    ['h2', 'Le contexte : deux établissements, un seul projet'],
    ['p', `Le montage est malin et mérite d'être connu, parce qu'il résout la question qui bloque le plus souvent les projets en zone rurale : les frais de déplacement. En se coordonnant sur les mêmes dates, les deux collèges se les partagent. Chacun paie ses heures d'atelier, mais un seul déplacement dessert quatre classes. Pour un établissement seul, le même projet aurait un coût sensiblement plus élevé.`],
    ['p', `Le Printemps des poètes offre par ailleurs un cadre idéal : il donne une échéance, un thème national, et une raison institutionnelle d'inviter un intervenant. Le <a href="atelier-slam.html">slam</a> y a toute sa place — c'est de la poésie qui se dit, et c'est souvent la porte d'entrée la plus efficace pour des élèves que le mot « poème » fait reculer.`],

    ['img', 'deux'],

    ['h2', 'Le déroulement du projet'],
    ['p', `Cinq heures par classe, c'est un format resserré : il faut que chaque élève reparte avec un texte qu'il peut dire. Le déroulé est donc très cadré.`],
    ['ul', [
      `<b>Séance 1.</b> Jeux oraux collectifs, puis première écriture guidée par anaphore. Tout le monde produit quelque chose dès la première heure — c'est la règle que je ne négocie pas.`,
      `<b>Séance 2.</b> Travail d'image : comparaison, métaphore, détail concret. On enrichit le texte de la séance 1 plutôt que d'en commencer un nouveau.`,
      `<b>Séance 3.</b> Mise en voix. Débit, silences, regard, placement du corps. Passage individuel devant la classe.`,
      `<b>Répétition générale.</b> Sur place, dans l'amphithéâtre, avec la sonorisation. Cette séance-là vaut toutes les autres pour la confiance.`,
    ]],
    ['p', `La coordination entre les quatre classes se fait sur l'ordre de passage et sur quelques moments collectifs — un vers repris en chœur, une ouverture à plusieurs voix. Les élèves des deux collèges ne se rencontrent que le jour même, ce qui ajoute un enjeu que je n'aurais pas su fabriquer autrement.`],

    ['h2', 'Les techniques travaillées'],
    ['p', `Sur cinq heures, je privilégie l'anaphore, la comparaison et le travail de la chute pour l'écrit ; le débit, le silence et l'adresse pour l'oral. Ce sont les outils qui donnent le plus de résultat par heure investie. La réécriture longue et la construction en parties relèvent des projets plus étendus, comme celui mené <a href="projet-atelier-slam-college-arveyres-solidarite.html">au collège d'Arveyres sur plus de vingt heures</a>.`],

    ['h2', 'Ce que les élèves ont travaillé'],
    ['p', `Le projet permet de travailler la prise de parole devant un très grand public — rare dans une scolarité —, la maîtrise du langage poétique, et la capacité à porter un texte personnel sans se cacher derrière. Les élèves ont été amenés à affronter une salle de deux cents personnes avec un texte qu'ils ont écrit eux-mêmes. C'est impressionnant pour eux, et c'est précisément pour ça que c'est valorisant : la tâche est difficile, et ils l'accomplissent.`],

    ['img', 'trois'],

    ['h2', 'Le moment marquant'],
    ['p', `Ce qui me frappe, année après année, c'est le moment juste avant l'entrée en scène. Les élèves qui ont le plus plaisanté pendant les séances sont les plus silencieux en coulisses. Et le moment juste après : une élève qui redescend de scène, encore essoufflée, qui ne dit rien et qui a l'air d'avoir grandi de dix centimètres. La quatrième année, je m'y attends, et ça me fait le même effet.`],

    ['expert', {
      titre: 'Monter un projet slam pour le Printemps des poètes',
      qr: [
        ['Quand faut-il s’y prendre pour le Printemps des poètes ?',
         `Le Printemps des poètes a lieu au printemps et les intervenants sont sollicités très en amont. Concrètement, un projet qui doit aboutir à cette période se cale à l'automne précédent, le temps de sécuriser le financement, les dates et la salle de restitution. Les demandes arrivées en février trouvent rarement une place.`],
        ['Deux établissements peuvent-ils vraiment mutualiser une intervention ?',
         `Oui, et c'est une piste trop peu utilisée. Il suffit que les établissements soient assez proches pour être desservis sur la même semaine. Chacun conserve son projet, ses classes et son budget d'heures ; seuls les frais de déplacement sont partagés. La restitution commune n'est pas obligatoire, mais elle donne au projet une ampleur qu'aucun des deux n'aurait atteinte seul.`],
        ['Cinq heures par classe, est-ce assez pour une restitution ?',
         `C'est le minimum viable pour une scène publique, et il faut alors accepter des textes courts et un déroulé très cadré. En dessous, je déconseille la restitution devant un large public : les élèves n'ont pas le temps de répéter, et une prise de parole ratée devant deux cents personnes laisse une trace inverse de celle qu'on cherche.`],
      ],
    }],

    ['h2', 'Ce que ce projet a permis d’explorer'],
    ['p', `Quatre ans que ce projet se reconduit, avec les mêmes établissements et des élèves différents. C'est sans doute le meilleur indicateur : un projet slam bien calé ne s'épuise pas, il devient un rendez-vous. D'autres établissements ont raconté leurs projets dans la <a href="temoignages.html">presse locale</a>. Si vous préparez une édition du Printemps des poètes, ou si vous cherchez un établissement voisin avec qui mutualiser, <a href="index.html#contact">parlons-en tôt dans l'année</a>.`],
  ],
},

];

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
   Ni date, ni étiquette. */
const carte = (a) => `
      <a class="projet band--${teinteDe(a)}" href="projet-${a.slug}.html">
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
<section class="page-hero wrap">
  <a class="crumb" href="index.html"><span class="arrow" aria-hidden="true">←</span> Retour à l'accueil</a>
  <div class="page-hero__band band--yellow">
    <svg class="scribbles" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
      <path d="M-20 70 C120 10 260 130 420 50 M-20 200 C100 150 300 260 420 190 M90 -20 C120 120 60 200 130 320 M300 -20 C280 110 350 190 300 320"/>
    </svg>
    <span class="page-hero__watermark" aria-hidden="true">Carnet</span>
    <div class="page-hero__inner">
      <h1>Les derniers projets</h1>
      <p>Le journal de bord des interventions : ce qu'on a écrit, comment le groupe s'en est
        emparé, et ce qu'il en reste une fois la scène démontée.</p>
      <div class="btn-row">
        <a class="btn btn--ink" href="index.html#contact">Construire mon projet</a>
        <a class="btn btn--link" href="temoignages.html">Témoignages &amp; médias <span class="arrow" aria-hidden="true">→</span></a>
      </div>
    </div>
  </div>
</section>

<section class="section section--close wrap">
  <div class="projets" data-stagger>${tries.map(carte).join('')}
  </div>
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

  const jsonld = [{
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: a.h1, description: a.chapo, inLanguage: 'fr',
    url: SITE + 'projet-' + a.slug + '.html',
    mainEntityOfPage: { '@type': 'WebPage', '@id': SITE + 'projet-' + a.slug + '.html' },
    image: SITE + 'assets/img/blog/' + a.images.principale.src,
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
    ogImage: a.images.principale.src,
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
      <div><dt>Lieu</dt><dd>${ech(a.lieu)}</dd></div>
      <div><dt>Public</dt><dd>${ech(a.publics)}</dd></div>
      <div><dt>Intervention</dt><dd>${ech(a.format)}</dd></div>
    </dl>
    <p class="article__signature">Auteur : Esope · Intervenants slam : Esope</p>
  </header>
${figure(a.images.principale, true)}

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
