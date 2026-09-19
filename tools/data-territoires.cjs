/**
 * Les pages de territoire : France, départements, villes.
 *
 * RÈGLE D'OR, à ne pas contourner. On ne crée une page que là où il y a de la
 * matière réelle. Une grille de pages identiques où seul le nom du lieu change
 * est un « doorway page » au sens de Google, sanctionné comme tel — jusqu'à la
 * désindexation du site entier, pages légitimes comprises. Ce qui fait ranker
 * une page locale, c'est précisément ce qu'un concurrent ne peut pas copier :
 * des noms d'établissements, des salles, des récits.
 *
 * Seuils retenus :
 *   ville        au moins trois récits ET un signal extérieur (presse, relais)
 *   département  au moins deux récits, dans deux communes différentes
 *   France       la page de tête, qui couvre les départements sous le seuil
 *
 * Un département à un seul récit ne mérite pas sa page : son unique projet est
 * déjà raconté dans son récit, et il est listé sur la page France. Il en
 * gagnera une le jour où un deuxième projet s'y ajoutera — le maillage se
 * remplit en publiant des récits, pas en générant des coquilles.
 *
 * Niveaux :
 *   'france'      agrège tout, liste les départements
 *   'departement' filtre les récits par communes, renvoie vers ses villes
 *   'ville'       filtre par communes, second cercle via rayon
 */

/* Les communes où un projet a réellement eu lieu, par département. Sert au
   filtrage des récits et à l'affichage : ce sont des faits vérifiables sur le
   site, pas une liste de villes visées. */
const DEPARTEMENTS = [
  { nom: 'Gironde', file: 'atelier-slam-gironde.html',
    communes: ['Bordeaux', 'Cenon', 'Bassens', 'Arveyres', 'Biganos', 'Lège-Cap-Ferret',
      'Saint-Denis-de-Pile', 'Étauliers', 'Carbon-Blanc', 'Lormont', 'Arès'] },
  { nom: 'Dordogne', file: 'atelier-slam-dordogne.html',
    communes: ['Périgueux', 'Brantôme'] },
  { nom: 'Hérault', file: 'atelier-slam-herault.html',
    communes: ['Béziers', 'Lunel'] },
  { nom: 'Charente', file: null, communes: ['Angoulême'] },
  { nom: 'Gard', file: null, communes: ['Beaucaire'] },
  { nom: 'Landes', file: null, communes: ['Parentis'] },
  { nom: 'Tarn', file: null, communes: ['Albi', 'Blaye-les-Mines'] },
  { nom: 'Bouches-du-Rhône', file: null, communes: ['Mallemort'] },
];

const territoires = [

  /* ------------------------------------------------------------------ FRANCE */
  {
    niveau: 'france',
    file: 'ateliers-slam-france.html',
    ville: 'France',
    watermark: 'France',
    color: 'yellow',
    departements: DEPARTEMENTS,

    seoTitle: 'Ateliers slam partout en France — Esope, champion de France de Slam',
    meta: "Ateliers slam, rap, éloquence et battle de compliments dans toute la France : collèges, lycées, structures jeunesse et médico-sociales. Animés par Esope, champion de France de Slam.",
    title: 'Ateliers slam partout en France',
    baseline: "Champion de France de Slam, j'interviens dans les établissements scolaires et les structures accueillant du public, de la Gironde aux Bouches-du-Rhône.",
    intro: "Je suis basé à <b>Bordeaux</b>, et j'interviens dans toute la France depuis 2016. Les pages ci-dessous ne listent pas des villes que je vise : elles recensent les <b>départements où j'ai réellement animé un atelier</b>, avec les établissements, les salles et les récits correspondants. Si votre commune n'y figure pas encore, ça ne change rien à la faisabilité — <b>un déplacement se chiffre et s'organise</b>, et plusieurs de ces projets ont commencé par un premier appel venu d'un département où je n'avais jamais mis les pieds.",

    facts: [
      ['Plus de 300 ateliers', 'Menés depuis 2016, du primaire au lycée professionnel'],
      ['Huit départements', 'Où un atelier slam, rap, éloquence ou battle a déjà eu lieu'],
      ['Agréé Éducation nationale', 'Interventions éligibles au pass Culture'],
      ['Déplacements partout', 'Chiffrés au projet, sur toute la France métropolitaine'],
    ],

    ancrage: {
      titre: 'Comment se monte une intervention hors de ma région',
      paragraphes: [
        "Un atelier slam à l'autre bout du pays ne se conduit pas comme une intervention à côté de chez moi : il se concentre. Plutôt que six séances de deux heures étalées sur un trimestre, on construit un format massé — une journée complète, deux journées consécutives, ou une semaine immersive. Les projets menés à Béziers, à Beaucaire, à Lunel ou à Mallemort ont tous pris cette forme, et ils vont aussi loin qu'un parcours filé.",
        "Le déplacement se chiffre dans la proposition, au même titre que les heures d'atelier. C'est souvent ce qui décide du format retenu : quand le budget est contraint, mieux vaut concentrer les heures sur un seul déplacement que les diluer. Décrivez-moi votre contexte et votre enveloppe, je construis la formule qui tient dedans.",
      ],
    },

    faq: [
      ['Intervenez-vous partout en France ?',
       "Oui. Je suis basé à Bordeaux, mais j'ai animé des ateliers en Dordogne, en Charente, dans les Landes, le Tarn, l'Hérault, le Gard et les Bouches-du-Rhône. Pour un département où je n'ai encore jamais travaillé, rien ne change sur le fond : le déplacement se chiffre et s'organise. Plusieurs des projets racontés sur ce site ont commencé exactement comme ça."],
      ['Les frais de déplacement sont-ils compris ?',
       "Ils sont chiffrés dans la proposition, distinctement des heures d'atelier, pour que vous voyiez ce que vous payez. C'est souvent ce qui oriente le format : à budget donné, concentrer les heures sur un seul déplacement rend le projet plus solide que de les étaler sur plusieurs venues."],
      ['Quel format pour un établissement éloigné de Bordeaux ?',
       "Un format massé : une journée complète, deux journées consécutives, ou une semaine immersive. Six heures d'atelier d'un coup permettent d'aller de l'initiation jusqu'à une restitution, comme au lycée Bertran de Born à Périgueux. Une semaine permet d'aller jusqu'à une scène devant tout l'établissement, comme dans un collège de Beaucaire."],
      ['Combien de temps à l’avance faut-il s’y prendre ?',
       "Pour un projet inscrit dans l'année scolaire, les demandes arrivent le plus souvent entre mai et septembre. Mais une intervention ponctuelle se cale parfois à quelques semaines, selon les créneaux disponibles. Le plus simple est de m'écrire avec la période visée, même approximative."],
      ['Quels ateliers proposez-vous ?',
       "Quatre formats : le slam, ma discipline mère ; le rap, jusqu'au clip vidéo ; l'éloquence, adossée à un concours ou au grand oral ; et le battle de compliments, une joute verbale positive. Le choix se fait selon le groupe et l'objectif, pas selon un catalogue."],
    ],

    images: {
      hero: { src: 'esope-scene-slam.webp', alt: 'Esope sur scène, souriant, le bras tendu vers le public',
        legende: 'Sur scène — c’est de là que vient tout ce que je transmets en atelier.' },
      atelier: { src: 'page-slam-2.jpg', alt: 'Un groupe en atelier d’écriture slam, penché sur ses feuilles' },
    },
  },

  /* ------------------------------------------------------------- DÉPARTEMENTS */
  {
    niveau: 'departement',
    file: 'atelier-slam-gironde.html',
    ville: 'Gironde',
    watermark: 'Gironde',
    color: 'turquoise',
    communes: DEPARTEMENTS[0].communes,
    villesLiees: ['atelier-slam-bordeaux.html'],

    seoTitle: 'Ateliers slam en Gironde — collèges, lycées et structures',
    meta: "Ateliers slam, rap et battle de compliments en Gironde : Bordeaux, Cenon, Bassens, Arveyres, Biganos, Lège-Cap-Ferret, Saint-Denis-de-Pile. Par Esope, champion de France de Slam.",
    title: 'Ateliers slam en Gironde',
    baseline: "Champion de France de Slam installé à Bordeaux, j'anime des ateliers d'écriture et d'oralité dans les établissements et les structures girondines depuis 2016.",
    intro: "La <b>Gironde</b> est mon département : c'est ici que je vis et que j'ai mené le plus de projets. De la <b>métropole bordelaise</b> — Bordeaux, Cenon, Bassens — jusqu'au <b>Libournais</b>, au <b>Bassin d'Arcachon</b> et au <b>Blayais</b>, les ateliers ont pris toutes les formes : deux heures ponctuelles à la Maison des adolescents, vingt heures avec tous les 4e d'un collège, ou une scène slam ouverte au Rocher de Palmer.",

    facts: [
      ['Collèges et lycées', 'Ateliers slam en collège, lycée et primaire, dans toute la Gironde'],
      ['Huit communes', 'Bordeaux, Cenon, Bassens, Arveyres, Biganos, Lège-Cap-Ferret, Saint-Denis-de-Pile, Étauliers'],
      ['Slam, rap, battle', 'Les trois formats déjà menés sur le département'],
      ['Faciles à organiser', 'Un créneau de cours, une demi-journée ou un parcours sur plusieurs séances'],
    ],

    ancrage: {
      titre: 'Un département où les projets s’inscrivent dans la durée',
      paragraphes: [
        "La particularité de la Gironde, dans mon activité, c'est la récurrence. Plusieurs structures m'ont fait revenir année après année : la Ferme Merlet à Saint-Denis-de-Pile reconduit son parcours depuis quatre ans, et L'Accordeur, dans la même commune, a accueilli deux projets très différents. Cette continuité change ce qu'on peut viser — un groupe qui sait qu'il y aura une suite écrit autrement.",
        "L'autre particularité, c'est la variété des cadres. Sur un même département, j'interviens en collège avec un niveau entier, en structure jeunesse avec une douzaine de volontaires, à la Maison des adolescents avec un groupe qui change à chaque séance, et sur la scène du Rocher de Palmer devant un public de festival. Ce sont quatre métiers dans le même métier.",
      ],
    },

    faq: [
      ['Intervenez-vous dans les collèges et lycées de Gironde ?',
       "Oui, c'est le cœur de mon activité : collèges et lycées de Bordeaux Métropole, du Libournais, du Bassin et du Blayais, du primaire au lycée professionnel. Je suis agréé par l'Éducation nationale et mes interventions sont éligibles au pass Culture."],
      ['Travaillez-vous en dehors de Bordeaux Métropole ?',
       "Régulièrement. Arveyres, Biganos, Lège-Cap-Ferret, Saint-Denis-de-Pile, Étauliers : plusieurs de mes projets girondins les plus longs se sont déroulés hors métropole. Étant basé à Bordeaux, une intervention dans le département reste facile à caler, y compris sur plusieurs séances."],
      ['Quels ateliers avez-vous déjà menés en Gironde ?',
       "Du slam, du rap et du battle de compliments, en scolaire comme en structure jeunesse et en médico-social. L'éloquence se propose aussi, même si les projets girondins racontés ici relèvent des trois premiers formats."],
      ['Peut-on organiser une restitution publique ?',
       "Oui, et c'est ce qui donne sa force à un parcours. En Gironde, les restitutions se sont jouées dans un gymnase de collège devant tout l'établissement, dans une salle de structure jeunesse lors de la Fête de l'avenir, et sur la scène du Rocher de Palmer à Cenon pendant le Nouveau Festival."],
    ],

    images: {
      hero: { src: 'page-slam-2.jpg', alt: 'Un groupe en atelier d’écriture slam, penché sur ses feuilles' },
      atelier: { src: 'photo-slam.jpg', alt: 'Une restitution d’atelier slam devant un groupe' },
    },
  },

  {
    niveau: 'departement',
    file: 'atelier-slam-dordogne.html',
    ville: 'Dordogne',
    watermark: 'Dordogne',
    color: 'green',
    communes: DEPARTEMENTS[1].communes,
    villesLiees: [],

    seoTitle: 'Ateliers slam et éloquence en Dordogne — collèges et lycées',
    meta: "Ateliers slam et éloquence en Dordogne : lycée Bertran de Born à Périgueux, collège de Brantôme. Animés par Esope, champion de France de Slam.",
    title: 'Ateliers slam et éloquence en Dordogne',
    baseline: "Champion de France de Slam, j'interviens en Dordogne dans les collèges et les lycées, en slam comme en éloquence.",
    intro: "Mes deux projets périgourdins montrent bien les deux extrémités de ce que je propose. Au <b>lycée Bertran de Born, à Périgueux</b>, six heures d'<b>éloquence</b> d'un seul coup, de l'initiation jusqu'à la déclamation, avant un concours et le bac. Au <b>collège de Brantôme</b>, un <b>atelier slam</b> logé directement dans le cours de musique, quatre heures d'écriture et quatre heures d'oralité. Deux formats opposés, un même travail de fond sur la parole.",

    facts: [
      ['Collèges et lycées', 'Ateliers slam et éloquence en Dordogne, du collège au lycée'],
      ['Périgueux et Brantôme', 'Les deux communes où un projet a déjà eu lieu'],
      ['Grand oral et concours', 'L’éloquence adossée à une échéance réelle'],
      ['Formats massés', 'Six heures d’un coup, ou deux fois quatre heures'],
    ],

    ancrage: {
      titre: 'Deux formats qui marchent loin de Bordeaux',
      paragraphes: [
        "La Dordogne est à deux heures de Bordeaux : un aller-retour dans la journée est possible, mais le format qui fonctionne le mieux reste le format massé. Six heures d'atelier d'un coup, comme au lycée Bertran de Born, permettent d'aller de la découverte jusqu'à une déclamation aboutie sans que le groupe perde le fil entre deux séances.",
        "Le projet de Brantôme montre l'autre voie : intégrer l'atelier à un cours existant plutôt qu'en faire un événement à part. L'atelier slam s'est glissé dans les heures de musique — un cadre qui parlait déjà de rythme et de voix, et où le slam n'avait rien à justifier.",
      ],
    },

    faq: [
      ['Intervenez-vous dans les établissements de Dordogne ?',
       "Oui. J'ai travaillé au lycée Bertran de Born à Périgueux et au collège de Brantôme, en éloquence comme en slam. Je suis agréé par l'Éducation nationale et mes interventions sont éligibles au pass Culture."],
      ['Peut-on préparer un concours d’éloquence ou le grand oral ?',
       "C'est exactement ce que nous avons fait à Périgueux : six heures d'atelier calées sur un concours d'éloquence à venir et sur les épreuves orales du bac. La déclamation de fin de journée reproduit les conditions du concours — passage individuel, temps limité, jury."],
      ['Quel format pour un établissement périgourdin ?',
       "Le format massé donne les meilleurs résultats : une journée complète, ou deux demi-journées rapprochées. Étaler un parcours sur plusieurs semaines reste possible, mais le déplacement se répercute alors sur le budget."],
    ],

    images: {
      hero: { src: 'page-eloquence-1.jpg', alt: 'Une prise de parole debout pendant un atelier d’éloquence' },
      atelier: { src: 'photo-eloquence.jpg', alt: 'Un atelier d’éloquence en cours' },
    },
  },

  {
    niveau: 'departement',
    file: 'atelier-slam-herault.html',
    ville: 'Hérault',
    watermark: 'Hérault',
    color: 'magenta',
    communes: DEPARTEMENTS[2].communes,
    villesLiees: [],

    seoTitle: 'Ateliers slam et éloquence dans l’Hérault — Béziers, Lunel',
    meta: "Ateliers slam et éloquence dans l'Hérault : collège Fénelon à Béziers, espace Castel à Lunel. Animés par Esope, champion de France de Slam.",
    title: 'Ateliers slam et éloquence dans l’Hérault',
    baseline: "Champion de France de Slam, j'interviens dans l'Hérault en établissement scolaire comme en structure jeunesse.",
    intro: "Dans l'<b>Hérault</b>, mes deux interventions se sont jouées dans des cadres opposés. Au <b>collège Fénelon, à Béziers</b>, un <b>atelier slam</b> de quatre heures pour clore la semaine du Printemps des poètes avec les classes de 3e — un établissement privé, ce qui reste rare parmi mes clients. À l'<b>espace Castel, à Lunel</b>, trois heures de renfort en <b>éloquence</b> juste avant qu'un groupe de 12-17 ans ne présente son concours.",

    facts: [
      ['Scolaire et jeunesse', 'Ateliers slam et éloquence dans l’Hérault, en collège comme en structure'],
      ['Béziers et Lunel', 'Les deux communes où un projet a déjà eu lieu'],
      ['Formats courts', 'Trois à quatre heures, calées sur un temps fort'],
      ['Printemps des poètes', 'Un atelier pensé pour un moment précis de l’année'],
    ],

    ancrage: {
      titre: 'Des interventions calées sur un temps fort',
      paragraphes: [
        "Les deux projets héraultais ont un point commun : ils s'accrochent à une échéance qui existait déjà. À Béziers, la semaine du Printemps des poètes, qui prolongeait une séquence de français sur la poésie. À Lunel, un concours d'éloquence que le groupe préparait depuis des semaines et sur lequel je suis intervenu en renfort, les textes déjà écrits.",
        "C'est souvent le meilleur usage d'un format court quand on vient de loin : plutôt que de créer un événement de toutes pièces, se greffer sur un moment que l'établissement ou la structure a déjà inscrit à son calendrier. Quatre heures bien placées valent mieux que dix heures qui flottent.",
      ],
    },

    faq: [
      ['Intervenez-vous dans les établissements de l’Hérault ?',
       "Oui, en scolaire comme en structure jeunesse. J'ai animé un atelier slam au collège Fénelon à Béziers et un atelier d'éloquence à l'espace Castel de Lunel. Je suis agréé par l'Éducation nationale et mes interventions sont éligibles au pass Culture."],
      ['Un format de quatre heures suffit-il ?',
       "Pour une découverte aboutie, oui : jeux oraux, écriture, puis partage des textes devant le groupe. C'est le format retenu à Béziers pour le Printemps des poètes. Pour une restitution publique ambitieuse, je recommande plutôt huit heures ou davantage."],
      ['Peut-on faire appel à vous en renfort d’un projet déjà lancé ?',
       "Oui, et c'est ce qui s'est passé à Lunel : le groupe avait déjà écrit ses textes pour un concours d'éloquence, je suis intervenu trois heures pour les rendre plus percutants et travailler le passage. C'est un format utile quand l'équipe a mené l'écriture et cherche un regard extérieur sur l'oral."],
    ],

    images: {
      hero: { src: 'page-slam-3.jpg', alt: 'Un atelier slam en établissement scolaire' },
      atelier: { src: 'photo-eloquence.jpg', alt: 'Un atelier d’éloquence en cours' },
    },
  },

  /* -------------------------------------------------------------------- VILLE */
  {
    niveau: 'ville',
    file: 'atelier-slam-bordeaux.html',
    ville: 'Bordeaux',
    watermark: 'Bordeaux',
    color: 'turquoise',
    communes: ['Bordeaux', 'Cenon', 'Bassens', 'Lormont', 'Carbon-Blanc'],
    rayon: ['Arveyres', 'Saint-Denis-de-Pile', 'Étauliers', 'Biganos', 'Lège-Cap-Ferret', 'Arès'],
    departement: 'Gironde',
    departementFile: 'atelier-slam-gironde.html',

    seoTitle: 'Ateliers slam à Bordeaux — Esope, champion de France de Slam',
    meta: "Ateliers slam à Bordeaux et en Gironde pour collèges, lycées, structures jeunesse et médico-sociales. Animés par Esope, champion de France de Slam, installé à Bordeaux depuis 2016.",
    title: 'Ateliers slam à Bordeaux',
    baseline: "Champion de France de Slam, bordelais, j'anime des ateliers d'écriture et d'oralité dans les établissements et les structures de la métropole depuis 2016.",
    intro: "Bordeaux est ma ville. C'est ici que j'ai commencé à écrire et ici que j'ai mené mes premiers ateliers en 2016. Depuis, j'interviens dans toute la France — mais <b>la majorité de mes projets se sont déroulés en Gironde</b> : au Rocher de Palmer à Cenon, à la Maison des adolescents de Bordeaux, à l'UEAJ, dans les collèges de la métropole et de la rive droite.",

    facts: [
      ['Collèges et lycées',
       'Ateliers slam en collège, en lycée et en primaire, à Bordeaux et dans toute la métropole'],
      ['Intervenant slam depuis 2016',
       'Champion de France de Slam, agréé Éducation nationale, éligible au pass Culture'],
      ['Bordeaux et la Gironde',
       'Cenon, Bassens, Lormont, Carbon-Blanc, Arveyres, Biganos, Lège-Cap-Ferret, Saint-Denis-de-Pile'],
      ['Faciles à organiser',
       'Un créneau de cours, une demi-journée banalisée ou un parcours filé sur plusieurs séances'],
    ],

    ancrage: {
      titre: 'Un intervenant slam installé à Bordeaux',
      paragraphes: [
        "Un atelier slam ne se joue pas seulement sur la qualité de l'intervenant : il se joue aussi sur l'organisation. Travailler depuis Bordeaux rend les interventions faciles à caler dans la métropole — un projet filé sur plusieurs séances plutôt qu'un passage unique, des dates qui se replacent sans tout reconstruire, et la possibilité de venir repérer une salle avant la restitution.",
        "Ça veut dire aussi connaître le terrain. Je sais ce que peut accueillir la salle du Rocher de Palmer, comment se passe une restitution dans un hall de collège de la rive droite, et à quel moment de l'année scolaire les équipes de Gironde montent leurs dossiers d'atelier d'écriture. Ce sont des détails qui ne se voient pas dans une plaquette, et qui font la différence entre un atelier qui s'ajoute au programme et un atelier qui s'y intègre — en français autour de la poésie, en EMC autour de l'oral, ou en préparation du grand oral au lycée.",
      ],
    },

    lieux: {
      titre: 'Les lieux qui m’ont accueilli, à Bordeaux et autour',
      items: [
        ['Rocher de Palmer, Cenon', 'Un stage de rap pour le projet OPUS, puis une scène slam ouverte pendant le Nouveau Festival.'],
        ['Maison des adolescents, Bordeaux Peyberland', 'Des séances d’écriture de deux heures, avec un groupe qui change à chaque fois.'],
        ['UEAJ, Bordeaux', 'Un atelier rap avec un petit groupe : d’où tu viens, où tu vas.'],
        ['Structure jeunesse de Bassens', 'Un battle de compliments monté pour la scène de la Fête de l’avenir.'],
        ['Collège d’Arveyres', 'Tous les 4e sur le thème de la solidarité, plus de vingt heures, restitution au gymnase.'],
        ['Médiathèques de Gironde', 'Des ateliers d’écriture relayés par Biblio.Gironde et la médiathèque d’Arès.'],
      ],
    },

    faq: [
      ['Intervenez-vous dans les collèges et lycées de Bordeaux Métropole ?',
       "Oui, c’est même le cœur de mon activité depuis 2016 : ateliers slam en collège et en lycée à Bordeaux, sur la rive droite et dans toute la Gironde, du primaire au lycée professionnel. Travaillant depuis Bordeaux, une intervention dans la métropole se cale facilement — y compris un parcours réparti sur plusieurs séances, ce qui est souvent plus difficile à organiser avec un intervenant venu de loin."],
      ['Quel est le tarif d’un atelier slam à Bordeaux ?',
       "Il n’y a pas de tarif au catalogue : le budget dépend du volume d’heures, du nombre de groupes et de la restitution envisagée. Un atelier de quatre heures pour une classe et un parcours de vingt heures avec scène finale n’ont rien à voir. Décrivez-moi votre contexte et je réponds avec une proposition chiffrée. Mes interventions sont éligibles au pass Culture et je suis agréé par l’Éducation nationale."],
      ['Combien de séances faut-il prévoir ?',
       "Quatre heures suffisent pour une découverte aboutie — jeux oraux, écriture, partage devant le groupe. Pour une restitution publique, je recommande au minimum huit heures, et idéalement un parcours de quinze à vingt heures réparti sur plusieurs séances. Les projets girondins que je raconte sur ce site vont de deux heures ponctuelles à quatre années de suite."],
      ['Travaillez-vous en dehors du cadre scolaire ?',
       "Oui. À Bordeaux et en Gironde, j’interviens autant en structure jeunesse — MJC, centres sociaux, dispositifs éducatifs — qu’en secteur médico-social : Maison des adolescents, foyers d’accueil, unités éducatives. Le cadre change, la technique aussi : un groupe qui vient librement le mercredi ne se mène pas comme une classe."],
      ['Proposez-vous autre chose que le slam ?',
       "Le slam est ma discipline mère, mais j’anime aussi des ateliers rap — jusqu’au clip vidéo —, des ateliers d’éloquence adossés au grand oral, et des battles de compliments. Sur Bordeaux, j’ai mené les quatre formats ; le choix se fait selon le groupe et l’objectif plutôt que selon un catalogue."],
      ['Peut-on organiser une restitution publique à Bordeaux ?',
       "Oui, et c’est ce qui donne sa force à un parcours. Selon les projets, la restitution s’est jouée dans un gymnase de collège, dans le hall d’un établissement, ou sur la scène du Rocher de Palmer à Cenon lors d’une scène ouverte pendant le Nouveau Festival. Le lieu se choisit avec l’équipe, en fonction du groupe et de ce qu’il est prêt à affronter."],
    ],

    preuves: {
      titre: 'Ce qu’on en a dit, localement',
      items: [
        ['Sud Ouest', 'Slam : le collège champion d’Aquitaine', 'Carbon-Blanc',
         'https://www.sudouest.fr/gironde/carbon-blanc/slam-le-college-champion-d-aquitaine-2605424.php'],
        ['Ville de Lormont', '« L’âme slam »', 'Lormont',
         'https://www.lormont.fr/actualites-109/l-ame-slam-2090.html'],
        ['Biblio.Gironde', 'Atelier slam avec Esope', 'Gironde',
         'https://biblio.gironde.fr/agenda/atelier-slam-avec-esope'],
        ['Médiathèque d’Arès', 'Atelier d’écriture slam', 'Arès',
         'https://www.mediatheque-ares.fr/index.php/component/icagenda/133-atelier-slam/2024-10-10-16-00'],
      ],
    },

    images: {
      hero: { src: 'esope-scene-slam.webp', alt: 'Esope sur scène, souriant, le bras tendu vers le public',
        legende: 'Sur scène à Bordeaux — c’est de là que vient tout ce que je transmets en atelier.' },
      atelier: { src: 'page-slam-2.jpg', alt: 'Un groupe en atelier d’écriture slam, penché sur ses feuilles' },
      restitution: { src: 'photo-slam.jpg', alt: 'Une restitution d’atelier slam devant un groupe' },
    },
  },
];

module.exports = territoires;
module.exports.DEPARTEMENTS = DEPARTEMENTS;
