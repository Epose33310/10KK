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
/* La couleur d'une carte peut être forcée : deux récits du même atelier se
   suivent souvent, et deux cartes identiques côte à côte font terne. */
const teinteDe = (a) => a.teinte || COULEUR[a.atelier] || 'yellow';

/* -------------------------------------------------------------------------
   Les récits, du plus récent au plus ancien (champ « ordre »).
   ------------------------------------------------------------------------- */
const ARTICLES = [
/* ====================================================================== 1 */
{
  slug: 'atelier-slam-adultes-etauliers-queskonfabrik',
  ordre: 180,
  atelier: 'slam',
  h1: 'Un atelier slam pour adultes à la Maison Baffort, à Étauliers',
  seo: 'Atelier slam pour adultes — Maison Baffort, Étauliers',
  meta: "Un atelier slam pour adultes à la Maison Baffort d'Étauliers, à l'invitation de l'association Queskonfabrik : trois heures d'écriture, une scène ouverte, et un maire qui s'est prêté au jeu.",
  chapo: "À la Maison Baffort d'Étauliers, l'association Queskonfabrik m'a invité à mener un atelier slam pour un groupe d'adultes. Trois heures d'écriture, une scène ouverte qui a rempli la petite salle, et une envie commune d'en refaire une tradition.",
  lieu: 'Maison Baffort, Étauliers (Gironde)',
  publics: 'Groupe d’adultes volontaires (7 participants), dont le maire de la commune',
  format: '3 h d’atelier, restitution en scène ouverte de 1 h 30',
  motCle: 'atelier slam pour adultes',
  secondes: ['atelier slam association', 'scène ouverte slam Gironde'],
  images: {
    principale: { src: 'scene-ouverte-slam-etauliers.jpg',
      alt: 'Un petit groupe assis en cercle autour d’une personne qui performe, dans une salle intimiste',
      legende: 'La scène ouverte a rempli la petite scène d’intérieur de la Maison Baffort.' },
    deux: { src: 'atelier-slam-petit-groupe-adultes.jpg',
      alt: 'Un intervenant s’adresse à un petit groupe assis, dans une ambiance de proximité' },
    trois: { src: 'carnet-mon-texte-atelier-slam.jpg',
      alt: 'Un carnet ouvert sur lequel est écrit : mon texte',
      legende: 'Chaque participant est reparti avec un texte qu’il a choisi de dire devant les siens.' },
  },
  corps: [
    ['p', `L'association <b>Queskonfabrik</b> m'a contacté pour animer un <b>atelier slam</b> à la Maison Baffort, à Étauliers. Un format resserré — trois heures d'écriture suivies d'une heure et demie de scène ouverte — pour un groupe d'adultes venus par curiosité, sans autre obligation que l'envie.`],

    ['h2', 'Le contexte : un public adulte, un cadre associatif'],
    ['p', `Les <a href="atelier-slam.html">ateliers slam</a> que je mène s'adressent le plus souvent à des scolaires ; celui-ci s'adressait à des adultes, réunis par une association locale plutôt que par un établissement. Le cadre change tout : personne n'est là par obligation, chacun vient avec son propre rapport à l'écriture, parfois abandonné depuis des années. Queskonfabrik cherchait précisément ce type de proposition — une activité culturelle accessible, ouverte à tous les habitants de la commune, sans prérequis.`],

    ['img', 'deux'],

    ['h2', 'Le déroulement de l’atelier'],
    ['p', `Sept participants se sont présentés, un nombre qui permet un accompagnement presque individuel. Parmi eux, le maire de la commune, venu comme n'importe qui d'autre et qui s'est prêté au jeu de l'écriture avec la même application que les autres — un détail qui a beaucoup contribué à l'ambiance générale : personne ne se sentait au-dessus ou en dessous de l'exercice.`],
    ['p', `Les trois heures d'atelier ont suivi une progression classique — jeux oraux, collecte d'images personnelles, écriture, premiers essais à voix haute — mais avec un rythme différent de celui d'une classe : plus de temps par personne, plus d'échanges informels entre les textes, une ambiance que je qualifierais volontiers de cosy. L'heure et demie de scène ouverte qui a suivi n'était pas réservée aux seuls participants : elle était annoncée comme ouverte à tous, ce qui a changé la nature de la restitution.`],

    ['h2', 'Les techniques travaillées'],
    ['p', `Avec des adultes, on peut aller plus vite sur certains aspects — la compréhension de la consigne, la lecture d'un texte à voix haute — mais le travail sur l'image et la construction reste identique à celui que je mène ailleurs : comparaison, détail concret, économie de mots. Ce qui change surtout, c'est la matière : les adultes puisent dans un passé plus long, ce qui donne des textes différents, parfois plus directement personnels.`],

    ['h2', 'Ce que les participants ont travaillé'],
    ['p', `L'atelier a offert un espace pour écrire sans enjeu scolaire ni professionnel — une rareté pour beaucoup d'adultes, qui n'ont plus l'occasion d'écrire un texte personnel depuis longtemps. Les participants ont aussi été amenés à prendre la parole devant un public qui dépassait le seul groupe de l'atelier, puisque la scène ouverte a attiré du monde venu de l'extérieur.`],

    ['img', 'trois'],

    ['h2', 'Le moment marquant'],
    ['p', `La scène ouverte a rempli la petite scène d'intérieur de l'établissement — bien au-delà des sept participants de l'atelier. Chacun d'entre eux est passé, sous le regard des familles venues assister, et la soirée a eu assez de succès pour que nous nous disions, sur place, que nous voulions en faire un rendez-vous récurrent.`],

    ['expert', {
      titre: 'Un atelier slam pour un public adulte, ce qui change',
      qr: [
        ['Un atelier slam fonctionne-t-il aussi bien avec des adultes qu’avec des scolaires ?',
         `Tout à fait, et parfois mieux : sans contrainte scolaire, l'engagement est spontané et les textes puisent dans une expérience de vie plus large. La seule différence notable est le rythme, plus posé, et le besoin de moins insister sur la légitimité à écrire — un frein plus fréquent chez l'adulte que chez l'adolescent, curieusement.`],
        ['Une association peut-elle organiser ce type d’atelier sans lien avec une école ?',
         `Oui, c'est même un cadre que j'apprécie particulièrement. Une association ou une municipalité peut très bien porter un atelier slam ouvert aux habitants, avec une restitution en scène ouverte plutôt qu'un spectacle formel. C'est un format léger à mettre en place et qui crée du lien à l'échelle d'une commune.`],
      ],
    }],

    ['h2', 'Ce que ce projet a permis d’explorer'],
    ['p', `Ce qui m'a marqué dans ce projet, c'est la vitesse à laquelle un groupe d'adultes venus par simple curiosité s'est transformé en une soirée de scène ouverte qui a rempli la salle. Si votre association ou votre commune veut proposer une activité d'écriture accessible à tous les habitants, <a href="index.html#contact">on peut construire ensemble un format comme celui-ci</a>.`],
  ],
},

/* ====================================================================== 2 */
{
  slug: 'atelier-rap-stage-opus-rocher-de-palmer',
  ordre: 170,
  atelier: 'rap',
  h1: 'Un stage de rap pour le projet OPUS, au Rocher de Palmer',
  seo: 'Atelier rap et masterclass — projet OPUS au Rocher de Palmer, Cenon',
  meta: "Un stage de rap de quatre heures pour de jeunes passionnés des métiers de la musique, dans le cadre du projet OPUS au Rocher de Palmer, à Cenon : conseils individuels et échange collectif sur le métier.",
  chapo: "Dans le cadre du projet OPUS, de jeunes stagiaires se formant aux métiers de la musique ont suivi un stage de rap au Rocher de Palmer, à Cenon. Conseils individuels sur leurs textes, échange collectif sur le métier.",
  lieu: 'Rocher de Palmer, Cenon',
  publics: 'Jeunes en stage, passionnés par les métiers de la musique (projet OPUS)',
  format: '4 h d’atelier et de masterclass',
  motCle: 'atelier rap masterclass',
  secondes: ['stage rap métiers de la musique', 'atelier rap Cenon'],
  images: {
    principale: { src: 'micro-profil-rap-masterclass.jpg',
      alt: 'Un jeune rappeur de profil, casquette vissée, au plus près du micro',
      legende: 'Le stage s’adressait à des jeunes déjà engagés dans une pratique musicale.' },
    deux: { src: 'horizon-avenir-metiers-musique.jpg',
      alt: 'Un groupe de jeunes assis face à un paysage urbain, regardant au loin' },
  },
  corps: [
    ['p', `Le <b>Rocher de Palmer</b>, à Cenon, m'a confié un <b>stage de rap</b> dans le cadre du projet OPUS : un dispositif qui permet à des jeunes passionnés par les métiers artistiques de se former aux métiers de la musique le temps d'un stage. Quatre heures d'atelier et de masterclass, entre conseils individuels et échanges collectifs sur le métier.`],

    ['h2', 'Le contexte : un public déjà engagé dans la musique'],
    ['p', `Contrairement à un <a href="atelier-rap.html">atelier rap</a> classique en milieu scolaire, ce stage s'adressait à des jeunes déjà tournés vers une pratique musicale, dans une logique de professionnalisation plutôt que de découverte. Le projet OPUS les réunit autour des métiers de la musique — technique, production, interprétation — et mon intervention portait spécifiquement sur le rap : l'écriture, mais aussi tout ce qui entoure la construction d'un projet artistique.`],

    ['h2', 'Le déroulement du stage'],
    ['p', `Le format s'est organisé en deux temps. D'abord, des conseils individuels très ciblés sur ce que chaque jeune apportait déjà : sa musique, sa direction artistique, ses ambitions. Ce n'était pas un atelier d'initiation — chacun avait un projet en cours, et le travail consistait à l'affiner plutôt qu'à le créer de zéro. Ensuite, un temps collectif consacré aux métiers de la musique : la réalité de l'intermittence, la question du rapport à la famille quand on choisit cette voie, les à-côtés du métier qu'on ne voit pas depuis l'extérieur.`],

    ['img', 'deux'],

    ['h2', 'Les techniques travaillées'],
    ['p', `Sur le plan artistique, le travail a porté sur la direction artistique du projet de chaque participant : cohérence entre le texte, l'image et l'ambition affichée. Sur le plan professionnel, l'échange a couvert des sujets que je n'aborde pas dans un atelier scolaire classique — le statut d'intermittent, la manière d'annoncer un choix de carrière artistique à sa famille, la patience que demande ce métier avant de pouvoir en vivre.`],

    ['h2', 'Ce que les participants ont travaillé'],
    ['p', `Les stagiaires ont été amenés à regarder leur pratique avec un peu de recul — un exercice difficile quand on est en plein dedans — et à mettre des mots sur leur ambition plutôt que de la laisser floue. L'échange collectif leur a aussi permis d'entendre que les questions qu'ils se posaient sur le métier étaient partagées par tout le groupe, ce qui a visiblement allégé certaines inquiétudes.`],

    ['h2', 'Le moment marquant'],
    ['p', `L'échange sur le rapport à la famille a pris plus de place que prévu dans le temps collectif. Plusieurs jeunes ont raconté la difficulté à faire accepter un choix de carrière artistique dans leur entourage, et le groupe s'est mis à se répondre entre eux plus qu'à m'écouter — signe, je crois, que la question les concernait tous directement.`],

    ['expert', {
      titre: 'Le rap comme formation professionnelle, ce que ça implique',
      qr: [
        ['En quoi un stage comme celui du projet OPUS diffère-t-il d’un atelier rap scolaire ?',
         `L'objectif change complètement : il ne s'agit plus de découvrir l'écriture, mais d'accompagner un projet déjà engagé. Les conseils sont individuels et techniques, et une partie du temps est consacrée à la réalité du métier plutôt qu'à l'exercice d'écriture lui-même.`],
        ['Peut-on aborder des sujets comme l’intermittence ou le rapport à la famille dans ce cadre ?',
         `Oui, et c'est même souvent ce que ces jeunes attendent le plus. Ils ont généralement déjà les bases techniques ; ce qui leur manque, c'est un espace pour parler concrètement de ce que ce métier implique au quotidien, avec quelqu'un qui l'a vécu.`],
      ],
    }],

    ['h2', 'Ce que ce projet a permis d’explorer'],
    ['p', `Ce stage a confirmé ce que je constate souvent avec un public déjà engagé dans la musique : le vrai besoin n'est pas toujours technique, il est aussi humain — être entendu sur les doutes qu'on n'ose pas formuler ailleurs. Si votre structure accompagne de jeunes artistes vers une professionnalisation, <a href="index.html#contact">parlons du format qui conviendrait</a>.`],
  ],
},

/* ====================================================================== 3 */
{
  slug: 'atelier-battle-de-compliments-college-beaucaire',
  ordre: 160,
  atelier: 'battle',
  h1: 'Une semaine de battle de compliments dans un collège de Beaucaire',
  seo: 'Atelier battle de compliments intensif — collège de Beaucaire',
  meta: "Douze heures de battle de compliments en une semaine, avec deux classes d'un collège de Beaucaire : un format immersif jusqu'à une restitution dans le hall, acclamée par des centaines d'élèves.",
  chapo: "En une semaine, deux classes d'un collège de Beaucaire ont vécu un format immersif de battle de compliments — environ douze heures au total — jusqu'à une restitution dans le hall, sous les acclamations de centaines d'élèves.",
  lieu: 'Beaucaire (Gard)',
  publics: 'Deux classes de collège',
  format: 'Environ 12 h en une semaine, restitution dans le hall du collège',
  motCle: 'atelier battle de compliments collège',
  secondes: ['atelier slam intensif une semaine', 'restitution battle de compliments collège'],
  images: {
    principale: { src: 'atelier-ecriture-classe-college-beaucaire.jpg',
      alt: 'Un intervenant s’adresse à une classe de collège devant le tableau',
      legende: 'Douze heures en une semaine : un format resserré qui a porté sa propre énergie.' },
    deux: { src: 'eleves-mains-levees-restitution.jpg',
      alt: 'Des élèves lèvent la main dans une salle de classe, pleins d’énergie' },
  },
  corps: [
    ['p', `Un collège de <b>Beaucaire</b>, dans le Gard, m'a confié une semaine de <b>battle de compliments</b> avec deux classes : environ douze heures d'atelier concentrées sur cinq jours, jusqu'à une restitution dans le hall du collège qui a rassemblé des centaines d'élèves.`],

    ['h2', 'Le contexte : un format resserré dans le temps'],
    ['p', `Répartir douze heures sur une semaine plutôt que sur plusieurs mois change complètement la dynamique d'un projet. Les élèves n'ont pas le temps d'oublier une séance avant la suivante, l'écriture reste en tête en dehors de l'atelier, et l'ensemble du collège finit par être au courant du projet avant même la restitution — l'effet d'annonce joue à plein.`],

    ['h2', 'Le déroulement de la semaine'],
    ['p', `Le <a href="atelier-battle.html">battle de compliments</a> se prête bien à ce format immersif : chaque séance nourrit directement la suivante, sans le temps mort qu'impose un rythme hebdomadaire habituel. Les deux classes ont travaillé en parallèle une bonne partie de la semaine, avant un dernier temps commun consacré aux répétitions et à la mise en place de la restitution dans le hall — un lieu de passage que tout le collège traverse plusieurs fois par jour, donc un choix loin d'être neutre pour l'ampleur de l'événement.`],

    ['h2', 'Les techniques travaillées'],
    ['p', `Le travail suit la progression habituelle du battle de compliments — observation, comparaison, rythme de la punchline — mais la concentration sur une semaine a permis d'aller plus vite sur chaque étape, les élèves gardant en mémoire fraîche ce qui avait été vu la veille. C'est un format qui demande de l'énergie, pour eux comme pour moi, mais qui produit des textes très aboutis en peu de temps.`],

    ['h2', 'Ce que les élèves ont travaillé'],
    ['p', `Ce format immersif permet de travailler l'écriture et la prise de parole dans une continuité que les emplois du temps scolaires classiques ne permettent pas. Les élèves ont aussi été amenés à gérer une forme de pression inhabituelle : savoir qu'ils allaient se produire devant tout le collège quelques jours seulement après avoir commencé à écrire.`],

    ['img', 'deux'],

    ['h2', 'Le moment marquant'],
    ['p', `La restitution dans le hall a rassemblé des centaines d'élèves venus acclamer les punchlines, dans une énergie que je qualifierais sans exagérer de folle. Un format aussi resserré dans le temps aurait pu jouer contre l'ampleur de l'événement ; il l'a au contraire renforcée, comme si toute la semaine avait construit une attente collective jusqu'à ce moment précis.`],

    ['expert', {
      titre: 'Organiser un atelier intensif sur une semaine',
      qr: [
        ['Pourquoi choisir un format resserré sur une semaine plutôt qu’étalé sur plusieurs mois ?',
         `Un format intensif crée une dynamique différente : les élèves gardent le projet en tête en continu, et l'ensemble de l'établissement finit par être au courant avant la restitution. C'est un choix pertinent quand on cherche un effet fédérateur rapide, par exemple pour marquer un temps fort dans l'année.`],
        ['Une restitution dans un lieu de passage comme un hall, est-ce risqué ?',
         `C'est au contraire souvent ce qui en fait la réussite. Un hall traversé par tout l'établissement transforme la restitution en événement collectif plutôt qu'en spectacle réservé à quelques classes invitées. Il faut simplement anticiper la logistique — l'acoustique, la circulation, les horaires de passage.`],
      ],
    }],

    ['h2', 'Ce que ce projet a permis d’explorer'],
    ['p', `Cette semaine a montré qu'un format intensif de battle de compliments peut produire une énergie collective qui dépasse largement les deux classes concernées. Si votre établissement cherche à marquer un temps fort sur une semaine plutôt que sur un trimestre, <a href="index.html#contact">on peut construire ce format ensemble</a>.`],
  ],
},

/* ====================================================================== 4 */
{
  slug: 'atelier-rap-accordeur-saint-denis-de-pile-rap-et-pizza',
  ordre: 150,
  atelier: 'rap',
  teinte: 'yellow',
  h1: 'Rap & Pizza : un atelier rap à l’Accordeur, à Saint-Denis-de-Pile',
  seo: 'Atelier rap « Rap & Pizza » — L’Accordeur, Saint-Denis-de-Pile',
  meta: "Un atelier rap de six heures dans le cadre de « Rap & Pizza », à l'Accordeur de Saint-Denis-de-Pile : de l'écriture à la présence scénique, avec des jeunes de 16 à 23 ans déjà habitués à écrire.",
  chapo: "À l'Accordeur, à Saint-Denis-de-Pile, j'ai animé la partie atelier rap d'un projet hybride baptisé « Rap & Pizza », de l'écriture à la présence scénique, avec des jeunes de 16 à 23 ans déjà habitués à écrire.",
  lieu: 'L’Accordeur, Saint-Denis-de-Pile (Gironde)',
  publics: 'Jeunes de 16 à 23 ans, déjà habitués à l’écriture',
  format: '6 h d’atelier, restitution lors d’un petit festival',
  motCle: 'atelier rap présence scénique',
  secondes: ['atelier rap Gironde', 'restitution rap festival'],
  images: {
    principale: { src: 'intervenant-petit-groupe-rap.jpg',
      alt: 'Un intervenant s’adresse à un petit groupe assis dans une salle informelle',
      legende: 'Une ambiance familiale, typique de l’Accordeur.' },
    deux: { src: 'bureau-carnets-stylos-ecriture.jpg',
      alt: 'Un bureau couvert de carnets et de stylos, prêt pour une séance d’écriture' },
  },
  corps: [
    ['p', `L'Accordeur, à <b>Saint-Denis-de-Pile</b>, m'a invité à animer la partie <b>atelier rap</b> d'un projet hybride baptisé « Rap & Pizza », construit avec plusieurs associations partenaires — vidéo, enregistrement, et pour ma part l'écriture et la présence scénique. Six heures d'atelier, avec des jeunes de 16 à 23 ans déjà habitués à écrire.`],

    ['h2', 'Le contexte : un projet à plusieurs mains'],
    ['p', `« Rap & Pizza » n'est pas un atelier isolé : c'est un format construit à plusieurs associations, chacune apportant sa spécialité — la vidéo, l'enregistrement studio, et pour la partie qui me concernait, l'écriture et le passage à la présence scénique. Ce type de montage change la place de l'intervenant : je ne suis qu'une des briques du projet, ce qui suppose de bien caler mon temps avec celui des autres intervenants.`],

    ['h2', 'Le déroulement de l’atelier'],
    ['p', `Le public de ce projet était différent de ce que je croise habituellement : des jeunes de 16 à 23 ans, déjà habitués à écrire de leur côté, venus avec une vraie appétence pour le <a href="atelier-rap.html">rap</a> plutôt qu'en découverte. Les six heures ont couvert l'écriture — affiner des textes parfois déjà entamés — puis la présence scénique : comment tenir un micro, occuper un espace, adresser un texte à un public plutôt que de le réciter les yeux baissés.`],

    ['img', 'deux'],

    ['h2', 'Les techniques travaillées'],
    ['p', `Avec un public déjà familier de l'écriture, le travail a porté moins sur les bases que sur l'incarnation du texte : placement de la voix, gestion du micro, occupation de l'espace scénique. C'est un temps qui manque souvent aux jeunes qui écrivent seuls chez eux et n'ont pas l'occasion de tester leurs textes devant un public avant une vraie scène.`],

    ['h2', 'Ce que les participants ont travaillé'],
    ['p', `L'atelier a permis de travailler le passage de l'écrit à la scène — une étape que beaucoup de jeunes rappeurs autodidactes n'ont jamais eu l'occasion de préparer avec un regard extérieur. Les participants ont aussi profité du cadre pluridisciplinaire du projet pour réfléchir à leur univers visuel et sonore, au-delà du seul texte.`],

    ['h2', 'Le moment marquant'],
    ['p', `La restitution s'est tenue lors d'un petit festival, dans une ambiance que je qualifierais de chic et bienveillante — familiale, comme l'est en général l'Accordeur, qui nous accueillait. Voir des jeunes qui écrivaient déjà depuis longtemps, seuls, présenter enfin leurs textes sur une vraie scène, avec le travail scénique qu'on avait mené ensemble, a donné à la soirée une justesse que je ne retrouve pas toujours.`],

    ['expert', {
      titre: 'Intervenir dans un projet associatif pluridisciplinaire',
      qr: [
        ['Comment un intervenant rap s’intègre-t-il dans un projet mené par plusieurs associations ?',
         `En se concentrant sur sa spécialité et en calant son temps avec celui des autres intervenants. Sur « Rap & Pizza », je n'avais pas à me soucier de la vidéo ou de l'enregistrement : mon rôle se limitait à l'écriture et à la présence scénique, ce qui m'a permis d'aller plus loin sur ce point précis.`],
        ['Un public déjà habitué à écrire demande-t-il une approche différente ?',
         `Oui, largement. Avec des jeunes qui écrivent déjà, le travail porte moins sur les bases de l'écriture que sur ce qui leur manque réellement : ici, la présence scénique et le passage du texte écrit à la scène.`],
      ],
    }],

    ['h2', 'Ce que ce projet a permis d’explorer'],
    ['p', `« Rap & Pizza » a confirmé qu'un projet associatif à plusieurs mains peut offrir à des jeunes déjà engagés dans l'écriture ce qui leur manque le plus souvent : un vrai temps de travail sur la scène. Si votre association construit un projet pluridisciplinaire autour du rap, <a href="index.html#contact">parlons de la partie qui pourrait me revenir</a>.`],
  ],
},

/* ====================================================================== 5 */
{
  slug: 'ateliers-slam-battle-compliments-college-parentis-en-born',
  ordre: 140,
  atelier: 'slam',
  teinte: 'periwinkle',
  h1: 'Battle de compliments et slam en demi-groupe au collège de Parentis-en-Born',
  seo: 'Ateliers slam et battle de compliments au collège de Parentis-en-Born',
  meta: "Quatre ans d'ateliers slam et battle de compliments au collège de Parentis-en-Born : les 5e en battle, les 4e en slam, une restitution en demi-groupe au CDI.",
  chapo: "Au collège de Parentis-en-Born, les 5e écrivent un battle de compliments et les 4e un texte slam. Une restitution en demi-groupe au CDI, et une intervention reconduite chaque année depuis quatre ans.",
  lieu: 'Collège de Parentis-en-Born (Landes)',
  publics: 'Classes de 5e (battle de compliments) et de 4e (slam)',
  format: 'Restitution en demi-groupe au CDI, intervention annuelle depuis 4 ans',
  motCle: 'ateliers slam et battle de compliments en collège',
  secondes: ['atelier slam Landes', 'restitution demi-groupe collège'],
  images: {
    principale: { src: 'atelier-slam-college-parentis-en-born.jpg',
      alt: 'Un intervenant slam sur scène sous un projecteur jaune, face à un public de collégiens',
      legende: 'Une intervention reconduite chaque année : le collège de Parentis-en-Born en est à sa quatrième édition.' },
    deux: { src: 'cercle-echange-atelier-ecriture.jpg',
      alt: 'Un groupe d’élèves assis en cercle avec leur intervenant pendant un atelier d’écriture' },
    trois: { src: 'micro-slam-eclat-jaune.jpg',
      alt: 'Un microphone éclairé de jaune, prêt pour une prise de parole',
      legende: 'Au CDI, chaque demi-groupe a son tour de micro — et son propre public.' },
  },
  corps: [
    ['p', `Depuis quatre ans, je retourne chaque année au <b>collège de Parentis-en-Born</b>, dans les Landes, pour mener des <b>ateliers slam et battle de compliments</b> avec deux niveaux à la fois. Les 5e travaillent le battle de compliments, les 4e le slam, et les deux groupes se retrouvent en fin de parcours pour une restitution au CDI — chacun dans son demi-groupe.`],

    ['h2', 'Le contexte : deux niveaux, deux formats, une même énergie'],
    ['p', `Le collège avait un besoin précis : proposer une activité d'écriture et d'oralité à deux niveaux simultanément, sans que l'un empiète sur le temps de l'autre. La réponse a été de séparer les formats : le <a href="atelier-battle.html">battle de compliments</a> pour les 5e, qui répond bien à un premier contact avec la prise de parole, et le <a href="atelier-slam.html">slam</a> pour les 4e, qui permet d'aller plus loin dans l'écriture personnelle. Revenir chaque année m'a aussi permis d'ajuster le dispositif au fil du temps — je connais désormais le CDI, les habitudes de l'équipe, et ce qui fonctionne le mieux avec chaque niveau.`],

    ['img', 'deux'],

    ['h2', 'Le déroulement en demi-groupe'],
    ['p', `Travailler en demi-groupe change beaucoup de choses. Avec la moitié d'une classe, chaque élève a plus de temps de parole, plus de retours individuels, et une restitution qui reste à taille humaine. Le CDI, avec ses rayonnages et son calme habituel, devient un lieu de scène inattendu — plus intime qu'un gymnase ou un amphithéâtre, ce qui convient bien à des formats qui reposent sur l'écoute autant que sur la performance.`],
    ['ul', [
      `<b>5e — battle de compliments.</b> On part d'un tour d'observation entre élèves, puis d'un travail de comparaison et de rythme, avant la confrontation en duos.`,
      `<b>4e — slam.</b> Le texte se construit sur plusieurs séances, avec un temps de réécriture avant la mise en voix.`,
      `<b>La restitution.</b> Chaque demi-groupe présente devant l'autre moitié de sa classe et quelques adultes du collège — un format resserré, jamais un grand raout.`,
    ]],

    ['h2', 'Les techniques travaillées'],
    ['p', `Le battle de compliments retravaille l'observation, la comparaison et le rythme de la punchline. Le slam, avec plus de temps devant lui, permet d'aller vers la construction d'un texte entier, des images plus élaborées et la respiration. Revenir chaque année sur les deux dispositifs m'a permis de les affiner l'un par rapport à l'autre : je sais désormais quels exercices du battle préparent bien le terrain pour le slam l'année suivante, quand les 5e passent en 4e.`],

    ['h2', 'Ce que les élèves ont travaillé'],
    ['p', `Ce format permet de travailler la prise de parole en petit comité, la capacité à recevoir un retour du groupe, et pour les 4e, une écriture plus construite. Les demi-groupes ont aussi été amenés à s'écouter davantage : quand la salle est plus petite, chaque intervention pèse plus, et les élèves s'en rendent compte vite.`],

    ['h2', 'Le moment marquant'],
    ['p', `Chaque année, il y a un moment où d'anciens élèves — devenus 4e après être passés par le battle en 5e — retrouvent les plus jeunes au CDI et leur donnent, sans que je le demande, des conseils sur la meilleure façon de tenir le micro. Cette transmission d'un niveau à l'autre, je ne l'avais pas prévue au départ ; elle s'est installée d'elle-même, au fil des quatre années.`],

    ['img', 'trois'],

    ['expert', {
      titre: 'Mener deux ateliers différents avec deux niveaux, ce qu’il faut savoir',
      qr: [
        ['Peut-on organiser deux formats différents dans le même établissement, la même semaine ?',
         `Oui, c'est même souvent une bonne solution quand un établissement a deux niveaux à occuper avec des besoins différents. Le battle de compliments et le slam se complètent bien : le premier ouvre la prise de parole, le second va plus loin dans l'écriture. Je cale les deux plannings ensemble pour que l'intervention reste cohérente sur la semaine.`],
        ['Une restitution au CDI, est-ce viable techniquement ?',
         `Tout à fait, à condition d'accepter un format sans sonorisation lourde. Le CDI a l'avantage d'être calme et à taille humaine, ce qui convient très bien à un texte dit sans micro. C'est un lieu que je recommande pour une restitution en demi-groupe, moins pour un rassemblement de plusieurs classes.`],
      ],
    }],

    ['h2', 'Ce que ce projet a permis d’explorer'],
    ['p', `Quatre ans d'ateliers au même collège, ce n'est pas une routine : c'est un dispositif qui s'affine chaque année, entre les 5e qui découvrent le battle de compliments et les 4e qui approfondissent le slam. Si votre établissement a plusieurs niveaux à occuper avec des formats différents, <a href="index.html#contact">on peut construire un dispositif sur mesure</a>, comme celui-ci.`],
  ],
},

/* ====================================================================== 6 */
{
  slug: 'scene-slam-ouverte-rocher-de-palmer-nouveau-festival',
  ordre: 130,
  atelier: 'slam',
  teinte: 'green',
  h1: 'Une scène slam ouverte au Rocher de Palmer, à Cenon, pendant le Nouveau Festival',
  seo: 'Scène slam ouverte au Rocher de Palmer, Cenon — animation du Nouveau Festival',
  meta: "Animer une scène slam ouverte au Rocher de Palmer, à Cenon, pendant le Nouveau Festival : d'anciens élèves qui reviennent, des textes repris, et des inconnus qui montent sur scène pour la première fois.",
  chapo: "Au Rocher de Palmer, à Cenon, pendant le Nouveau Festival, j'ai animé une scène slam ouverte à tout le monde. D'anciens lycéens croisés en atelier dans la région sont venus reprendre leurs textes, d'autres ont découvert la scène pour la première fois.",
  lieu: 'Rocher de Palmer, Cenon',
  publics: 'Public ouvert : anciens participants d’ateliers, spectateurs, nouveaux venus',
  format: 'Animation d’une scène slam ouverte, dans le cadre du Nouveau Festival',
  motCle: 'scène slam ouverte',
  secondes: ['animation scène ouverte slam', 'scène slam Cenon'],
  images: {
    principale: { src: 'scene-ouverte-slam-festival.jpg',
      alt: 'Un performeur bras ouverts sur une scène de festival, face à un public nombreux',
      legende: 'Une scène ouverte à tous, sans liste ni sélection : il suffisait d’avoir envie de monter.' },
    deux: { src: 'scene-slam-public-festival.jpg',
      alt: 'Un slameur debout sur scène, bras levé, sous des projecteurs jaunes, face à une foule dense' },
    trois: { src: 'micro-scene-ouverte-slam.jpg',
      alt: 'Un microphone sur pied, prêt pour une prise de parole',
      legende: 'Le même micro pour tout le monde : un ancien élève, un inconnu, ou un habitué de la scène.' },
  },
  corps: [
    ['p', `Le <b>Rocher de Palmer</b>, à <b>Cenon</b>, m'a confié l'animation d'une <b>scène slam ouverte</b> pendant le Nouveau Festival. Une scène ouverte, ça veut dire une chose simple : n'importe qui peut monter dire un texte, sans audition ni sélection. Ce jour-là, le public a mêlé des visages que je connaissais bien et d'autres que je découvrais.`],

    ['h2', 'Le contexte : animer, pas seulement écrire'],
    ['p', `Ce projet est différent des <a href="atelier-slam.html">ateliers slam</a> que je mène habituellement en milieu scolaire. Ici, pas de classe à accompagner sur plusieurs séances : mon rôle était d'animer une scène, de créer un climat où prendre la parole devient possible pour n'importe qui dans le public, et de tenir le rythme de la soirée. C'est un exercice qui demande une autre forme d'attention — moins la pédagogie d'un atelier, plus la présence d'un maître de cérémonie.`],

    ['h2', 'Le déroulement de la scène ouverte'],
    ['p', `Une scène ouverte se construit en direct. J'ouvre en général par un texte ou un mot d'accueil, puis je lance des appels au public par vagues, en gardant un œil sur le rythme : ne pas laisser de blanc trop long, ne pas enchaîner deux textes trop proches en intensité, garder de la place pour les hésitants qui se décident au dernier moment.`],
    ['ul', [
      `<b>Les habitués.</b> Certains sont venus avec un texte déjà prêt, écrit avant de venir.`,
      `<b>Les anciens élèves.</b> Plusieurs lycéens croisés en atelier dans la région sont montés reprendre d'anciens textes, parfois retravaillés depuis.`,
      `<b>Les nouveaux visages.</b> Des spectateurs venus sans intention de monter ont fini par prendre le micro, portés par l'ambiance du reste de la salle.`,
    ]],

    ['h2', 'Ce que ce format permet'],
    ['p', `Une scène ouverte n'apprend pas une technique au sens strict, mais elle offre un espace pour oser, pour tester un texte devant un vrai public, et pour observer ce que d'autres font de la même contrainte — dire un texte, debout, au micro. Pour les anciens élèves présents, c'est aussi l'occasion de mesurer le chemin parcouru depuis l'atelier.`],

    ['img', 'deux'],

    ['h2', 'Le moment marquant'],
    ['p', `Voir revenir des lycéens que j'avais eus en atelier, parfois plusieurs années plus tôt, et les voir remonter sur scène avec un texte qu'ils avaient écrit à l'époque — retravaillé, parfois presque méconnaissable — c'est exactement ce que je cherche à provoquer avec ces interventions : que le texte continue à vivre après l'atelier, sans moi.`],

    ['img', 'trois'],

    ['expert', {
      titre: 'Organiser une scène slam ouverte dans un lieu culturel',
      qr: [
        ['Une scène ouverte demande-t-elle une préparation particulière du lieu ?',
         `Assez peu techniquement : un micro, une sonorisation correcte et un espace scénique suffisent. Le vrai travail est humain — accueillir chaque personne qui se présente, créer un climat où monter sur scène paraît possible, et tenir un rythme de soirée qui ne s'essouffle pas.`],
        ['Ce format s’adresse-t-il aux médiathèques et lieux culturels autant qu’aux festivals ?',
         `Tout à fait. Une scène ouverte peut très bien exister à l'échelle d'une médiathèque ou d'un centre culturel, avec un public plus restreint. Le principe reste identique : un micro ouvert à qui veut le prendre, et une animation qui accompagne sans jamais imposer.`],
      ],
    }],

    ['h2', 'Ce que ce projet a permis d’explorer'],
    ['p', `Une scène slam ouverte ne se prépare pas comme un atelier, mais elle en prolonge l'esprit : donner à n'importe qui l'occasion de dire un texte, devant un public. Si votre structure organise un événement culturel et cherche une animation slam ouverte à tous, <a href="index.html#contact">on peut en discuter le format</a>.`],
  ],
},

/* ====================================================================== 7 */
{
  slug: 'atelier-slam-egalite-filles-garcons-college-lege-cap-ferret',
  ordre: 120,
  atelier: 'slam',
  h1: 'Un atelier slam sur l’égalité filles-garçons au collège de Lège-Cap-Ferret',
  seo: 'Atelier slam égalité filles-garçons — collège de Lège-Cap-Ferret',
  meta: "Un atelier slam sur l'égalité filles-garçons pour deux classes de 4e, et une heure de découverte pour tous les 5e, au collège de Lège-Cap-Ferret. Restitution sur scène, en pleine cour, lors de la fête du collège.",
  chapo: "Deux classes de 4e écrivent sur l'égalité filles-garçons, et tous les 5e découvrent le slam le temps d'une heure. Au collège de Lège-Cap-Ferret, la restitution se joue sur scène, en pleine cour, lors de la fête du collège.",
  lieu: 'Collège de Lège-Cap-Ferret (Gironde)',
  publics: 'Deux classes de 4e (thème imposé) et toutes les classes de 5e (découverte)',
  format: 'Projet thématique + initiation d’1 h, restitution sur scène en plein air',
  motCle: 'atelier slam égalité filles-garçons',
  secondes: ['atelier slam Bassin d’Arcachon', 'initiation slam collège'],
  images: {
    principale: { src: 'atelier-slam-egalite-college-lege-cap-ferret.jpg',
      alt: 'Un intervenant slam bras ouverts devant une classe, en pleine explication',
      legende: 'Cela fait quatre à cinq ans que ce projet se reconduit au collège de Lège-Cap-Ferret.' },
    deux: { src: 'eleves-participent-initiation-slam.jpg',
      alt: 'Des élèves lèvent la main pendant une séance de découverte du slam' },
    trois: { src: 'intervenant-slam-devant-classe-college.jpg',
      alt: 'Un intervenant en casquette s’adresse à une classe devant le tableau',
      legende: 'Avant la scène en plein air, un temps de répétition en classe pour choisir qui monte.' },
  },
  corps: [
    ['p', `Depuis quatre ou cinq ans, je reviens chaque année au <b>collège de Lège-Cap-Ferret</b> pour deux projets bien différents. Deux classes de 4e mènent un <b>atelier slam sur l'égalité filles-garçons</b>, un thème imposé par l'établissement, pendant que toutes les classes de 5e reçoivent une heure de découverte du slam, sans thème, simplement pour l'initiation.`],

    ['h2', 'Le contexte : un thème engagé, et une porte d’entrée pour tous'],
    ['p', `L'égalité filles-garçons est un sujet que l'Éducation nationale porte activement, et le collège avait envie d'un format qui dépasse le débat oral classique. Le <a href="atelier-slam.html">slam</a> permet de traiter un sujet de société sans tomber dans la leçon : chaque élève y apporte sa propre expérience, ce qui évite les généralités et les positions toutes faites. En parallèle, les 5e bénéficient d'une heure de découverte pure, sans enjeu thématique — une manière de familiariser tout un niveau avec l'exercice avant, éventuellement, de le retrouver l'année suivante sur un projet plus long.`],

    ['img', 'deux'],

    ['h2', 'Le déroulement du projet'],
    ['p', `Pour les 4e, le travail démarre par une collecte de situations vécues ou observées — à la maison, dans la cour, dans les médias — avant de les transformer en images et en vers. Le thème étant sensible, je veille à ce que chaque texte parte d'un vécu précis plutôt que d'une opinion générale, ce qui évite les textes moralisateurs et produit une écriture plus juste. Pour les 5e, l'heure de découverte suit un format condensé : jeux oraux, une première écriture rapide, une mise en voix collective. L'objectif n'est pas la performance, mais le contact.`],

    ['h2', 'Les techniques travaillées'],
    ['p', `Sur le projet des 4e, on retrouve un travail approfondi de l'image et de la construction, nécessaire pour traiter un sujet aussi vaste sans rester en surface. Sur l'heure de découverte des 5e, l'accent porte sur l'oralité immédiate : dire quelque chose, debout, devant les autres, sans viser un texte abouti.`],

    ['h2', 'Ce que les élèves ont travaillé'],
    ['p', `Les élèves de 4e ont été amenés à formuler un point de vue personnel sur un sujet de société, ce qui suppose à la fois de la réflexion et du courage — certains textes touchent à des situations vécues dans leur propre entourage. Les 5e, eux, ont surtout expérimenté la prise de parole devant leurs camarades, souvent pour la première fois dans ce cadre.`],

    ['h2', 'Le moment marquant'],
    ['p', `La restitution a lieu lors de la fête du collège, sur une scène installée en plein milieu de la cour. Je choisis moi-même la poignée d'élèves qui montent, en tenant compte à la fois de la qualité du texte et de l'envie de chacun — certains textes très forts restent parfois non dits parce que leur auteur préfère ne pas monter, et je respecte toujours ce choix. Voir un texte sur l'égalité filles-garçons résonner dans une cour de collège en pleine fête, entre les stands et les familles, donne au sujet une présence qu'aucune salle de classe ne peut offrir.`],

    ['img', 'trois'],

    ['expert', {
      titre: 'Traiter un sujet de société en atelier slam',
      qr: [
        ['Comment éviter qu’un atelier sur un thème comme l’égalité filles-garçons ne tourne au débat ou à la leçon de morale ?',
         `En partant systématiquement du vécu plutôt que de l'opinion. Je demande aux élèves une scène précise, un souvenir, un détail observé — jamais une position générale. C'est ce qui distingue un texte slam d'une dissertation : il montre plutôt qu'il ne démontre.`],
        ['Une heure de découverte a-t-elle un intérêt sans projet derrière ?',
         `Oui, à condition de ne rien attendre d'autre qu'un premier contact. Une heure permet de désamorcer les appréhensions et de donner à tout un niveau la même expérience de base. C'est souvent ce qui prépare le terrain pour qu'une partie de ces élèves s'engage plus tard dans un projet plus long, comme cela arrive régulièrement d'une année sur l'autre à Lège-Cap-Ferret.`],
      ],
    }],

    ['h2', 'Ce que ce projet a permis d’explorer'],
    ['p', `Faire cohabiter un projet thématique engagé et une simple heure de découverte, dans le même établissement et la même semaine, montre qu'un collège peut adapter le format du slam à des objectifs très différents. Si vous portez un projet sur un thème de société ou souhaitez simplement faire découvrir le slam à un niveau entier, <a href="index.html#contact">parlons du format qui conviendra le mieux</a>.`],
  ],
},

/* ====================================================================== 8 */
{
  slug: 'atelier-slam-college-brantome-cours-de-musique',
  ordre: 110,
  atelier: 'slam',
  teinte: 'yellow',
  h1: 'Un atelier slam intégré au cours de musique, au collège Brantôme',
  seo: 'Atelier slam en cours de musique — collège Brantôme',
  meta: "Huit heures d'atelier slam en cours de musique avec des 5e du collège Brantôme, sans thème imposé : quatre heures d'écriture, quatre heures d'oralité, et une scène finale dans la salle de classe.",
  chapo: "Au collège Brantôme, l'atelier slam a pris place directement dans le cours de musique. Quatre heures d'écriture, quatre heures d'oralité, et une scène finale dans la salle, sans thème imposé.",
  lieu: 'Collège Brantôme',
  publics: 'Classes de 5e, dans le cadre du cours de musique',
  format: '8 h d’atelier (écriture puis oralité), restitution dans la salle de classe',
  motCle: 'atelier slam en cours de musique',
  secondes: ['atelier slam collège 5e', 'atelier slam sans thème'],
  images: {
    principale: { src: 'atelier-slam-college-brantome-cours-musique.jpg',
      alt: 'Un intervenant en casquette anime un atelier slam devant une classe de collège',
      legende: 'Le slam pris en charge par le cours de musique : une autre porte d’entrée que le français.' },
    deux: { src: 'main-ecriture-atelier-slam.jpg',
      alt: 'Une main écrit au stylo pendant un atelier d’écriture, gros plan' },
    trois: { src: 'tabouret-scene-slam-classe.jpg',
      alt: 'Un tabouret seul, éclairé, sur une scène minimaliste',
      legende: 'Pas besoin d’une grande salle : un tabouret et un coin de classe suffisent à faire une scène.' },
  },
  corps: [
    ['p', `Le <b>collège Brantôme</b> a choisi d'intégrer l'<b>atelier slam</b> directement au cours de musique, avec des classes de 5e. Pas de thème imposé : huit heures au total, réparties en quatre heures d'écriture et quatre heures d'oralité, jusqu'à une scène slam finale organisée dans la salle de classe elle-même.`],

    ['h2', 'Le contexte : le slam comme matière musicale'],
    ['p', `Le slam est le plus souvent rattaché au cours de français, où il croise naturellement la poésie et l'argumentation. L'intégrer au cours de musique change la focale : on y entend davantage le rythme, le phrasé, la musicalité de la langue parlée, qui sont pourtant déjà au cœur de la pratique. Sans thème imposé, chaque élève choisit son sujet, ce qui demande un accompagnement plus individualisé dès le départ — il n'y a pas de porte d'entrée commune à proposer à toute la classe.`],

    ['img', 'deux'],

    ['h2', 'Le déroulement de l’atelier'],
    ['p', `Les quatre premières heures sont consacrées à l'écriture : trouver un sujet personnel, le travailler en images, construire le texte. Sans thème commun, une partie de ce temps sert justement à aider chaque élève à trouver le sien — certains partent d'une observation quotidienne, d'autres d'un ressenti plus intime. Les quatre heures suivantes basculent sur l'oralité : rythme, respiration, articulation, et surtout l'appropriation du texte à voix haute, avec une attention particulière portée au lien entre le texte et la musicalité qu'on lui donne — un pont naturel avec le reste du cours de musique.`],

    ['h2', 'Les techniques travaillées'],
    ['p', `L'absence de thème impose de travailler tôt la recherche de sujet, une étape qu'on peut parfois écourter quand un thème est donné. Le reste suit une progression classique : image, rythme, structure du texte, puis un travail de voix plus poussé qu'à l'accoutumée, porté par le cadre du cours de musique — accents toniques, variations de débit, silences.`],

    ['h2', 'Ce que les élèves ont travaillé'],
    ['p', `Cet atelier permet de travailler la formulation d'une idée personnelle sans consigne de départ — un exercice plus exigeant qu'il n'y paraît — ainsi qu'une forme d'oralité musicale, à la croisée du texte et du rythme. Plusieurs élèves ont pris conscience, par ce biais, que leur intérêt pour la musique et leur rapport aux mots pouvaient se rejoindre.`],

    ['h2', 'Le moment marquant'],
    ['p', `La scène finale n'a pas eu lieu dans une salle dédiée, ni sur une estrade : juste un coin dégagé de la salle de classe habituelle, avec les tables repoussées. Ce cadre minimal, très éloigné d'une vraie scène, n'a pourtant rien retiré à l'intensité du moment — plusieurs élèves ont dit leur texte avec une concentration que je ne leur avais pas vue pendant les séances de travail.`],

    ['img', 'trois'],

    ['expert', {
      titre: 'Le slam en cours de musique, ce que ça change',
      qr: [
        ['Pourquoi proposer un atelier slam dans le cadre du cours de musique plutôt que du français ?',
         `Les deux fonctionnent très bien, mais le cours de musique met davantage l'accent sur le rythme, le phrasé et la musicalité du texte dit, quand le français insiste plutôt sur l'écriture et l'argumentation. Le choix dépend surtout de ce que l'équipe pédagogique veut mettre en avant.`],
        ['Un atelier sans thème imposé est-il plus difficile à mener ?',
         `Il demande un accompagnement plus individualisé, surtout en début de parcours : sans thème commun, chaque élève doit d'abord trouver son sujet, ce qui prend du temps. En contrepartie, les textes sont souvent plus personnels et plus habités, parce que le sujet n'a jamais été imposé de l'extérieur.`],
      ],
    }],

    ['h2', 'Ce que ce projet a permis d’explorer'],
    ['p', `Faire atterrir le slam dans un cours de musique, sans thème et sans grande scène, montre qu'un atelier n'a pas besoin d'un cadre spectaculaire pour produire des textes habités. Si votre établissement veut explorer le slam depuis une matière autre que le français, <a href="index.html#contact">construisons ensemble le format qui convient</a>.`],
  ],
},


/* ====================================================================== 9 */
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
      `<b>La mise en voix.</b> Chacun dit son texte à une seule personne, puis à trois, puis au groupe. On ne passe jamais directement de la feuille à la scène.`,
    ]],
    ['p', `La seconde séance a été consacrée à la confrontation. On tire les duos au sort, on répète, on coupe. C'est presque toujours à ce moment-là que les textes gagnent : obligé de passer après quelqu'un, on comprend tout de suite ce qui fonctionne et ce qui traîne.`],

    ['h2', 'Les techniques travaillées'],
    ['p', `Sous le jeu, on a travaillé exactement ce qu'on travaille dans un <a href="atelier-slam.html">atelier slam</a> : la comparaison, la métaphore, l'économie de mots, le placement du souffle, l'adresse à quelqu'un. Le battle de compliments a ceci de pratique qu'il donne un destinataire clair. Écrire « pour » quelqu'un est infiniment plus facile qu'écrire « sur » un thème, surtout quand on n'a jamais écrit.`],

    ['h2', 'Ce que les participants ont travaillé'],
    ['p', `L'atelier permet de travailler la prise de parole devant un groupe, l'écoute — car pour complimenter précisément, il faut avoir regardé l'autre — et la capacité à formuler une idée en peu de mots. Les participants ont aussi été amenés à supporter le regard du groupe dans un cadre où ce regard est bienveillant par construction. Pour des jeunes qui se croisent sans se connaître, c'est un raccourci : à la fin de la première séance, ils ne se parlaient plus de la même façon.`],

    ['img', 'trois'],

    ['h2', 'Le moment marquant'],
    ['p', `Un garçon arrivé à la deuxième heure de la première séance, resté debout près de la porte, n'a rien écrit pendant quarante minutes. Je ne l'ai pas poussé. Au moment de la mise en voix, il a demandé s'il pouvait « juste essayer un truc » — et il a sorti quatre lignes qu'il avait manifestement tenues dans sa tête tout ce temps. Elles étaient meilleures que beaucoup de textes couchés sur le papier. Sur scène, à la Fête de l'avenir, c'est lui qui a déclenché la plus grosse réaction du public.`],

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

/* ====================================================================== 10 */
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

/* ====================================================================== 11 */
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

/* ====================================================================== 12 */
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

/* ====================================================================== 13 */
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
<section class="wrap" style="padding-block:clamp(24px,5vw,40px) clamp(20px,4vw,28px)">
  <a class="crumb" href="index.html"><span class="arrow" aria-hidden="true">←</span> Retour à l'accueil</a>
  <div class="center" style="margin-top:clamp(18px,3vw,26px)">
    <h1 class="h2" style="max-width:22ch;margin-inline:auto">Les derniers projets</h1>
    <p class="lead mute" style="margin-top:16px">Le journal de bord des interventions d'Esope</p>
  </div>
</section>

<section class="section section--close wrap">
  <div class="projets" data-paginate>${tries.map(carte).join('')}
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
