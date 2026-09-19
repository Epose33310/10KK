/**
 * Les pages de ville.
 *
 * RÈGLE D'OR, à ne pas contourner : on ne crée une page de ville que là où il y
 * a de la matière réelle — des projets menés, des lieux nommés, de la presse ou
 * des relais locaux. Une grille de pages identiques où seul le nom de la ville
 * change est un « doorway page » au sens de Google, sanctionné comme tel. Ce
 * qui fait ranker une page locale, c'est précisément ce qu'un concurrent ne
 * peut pas copier : des noms d'établissements, des salles, des dates.
 *
 * Seuil retenu : au moins trois récits publiés dans le rayon de la ville, et au
 * moins un signal extérieur (article de presse ou relais institutionnel).
 * Bordeaux : 11 récits et 4 signaux. Périgueux ou Angoulême n'en ont qu'un —
 * elles attendront.
 *
 * Champs :
 *   file        nom du fichier, contenant le mot-clé visé
 *   ville       le nom qui sert aux titres
 *   communes    communes du cœur de cible, cherchées dans le champ « lieu »
 *               des récits ; sert aussi à poser les liens entrants
 *   rayon       communes du second cercle, listées à part pour rester honnête
 *   departement libellé cherché dans « lieu » pour le comptage départemental
 */

module.exports = [
  {
    file: 'atelier-slam-bordeaux.html',
    ville: 'Bordeaux',
    watermark: 'Bordeaux',
    color: 'turquoise',
    communes: ['Bordeaux', 'Cenon', 'Bassens', 'Lormont', 'Carbon-Blanc'],
    rayon: ['Arveyres', 'Saint-Denis-de-Pile', 'Étauliers', 'Biganos', 'Lège-Cap-Ferret', 'Arès'],
    departement: 'Gironde',

    seoTitle: 'Ateliers slam à Bordeaux — Esope, champion de France de Slam',
    meta: "Ateliers slam à Bordeaux et en Gironde pour collèges, lycées, structures jeunesse et médico-sociales. Animés par Esope, champion de France de Slam, installé à Bordeaux depuis 2016.",
    title: 'Ateliers slam à Bordeaux',
    baseline: "Champion de France de Slam, bordelais, j'anime des ateliers d'écriture et d'oralité dans les établissements et les structures de la métropole depuis 2016.",

    /* L'accroche de haut de page. Le gras ne se voit que sur mobile. */
    intro: "Bordeaux est ma ville. C'est ici que j'ai commencé à écrire, ici que j'ai <b>gagné mon titre de champion Sud-Ouest</b> avant celui de champion de France, et ici que j'ai mené mes premiers ateliers en 2016. Depuis, j'interviens dans toute la France — mais <b>plus de la moitié de mes projets racontés sur ce site se sont déroulés en Gironde</b> : au Rocher de Palmer à Cenon, à la Maison des adolescents de Bordeaux, à l'UEAJ, dans les collèges de la métropole et de la rive droite.",

    /* Chaque encart porte une grappe de mots-clés différente : établissement,
       métier, territoire, format. Aucun ne répète le même angle. */
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

    /* Chaque entrée est vérifiable sur le site : récit publié, article de presse
       ou relais institutionnel. Rien d'inventé. */
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

    /* Preuves extérieures : presse et relais institutionnels déjà cités sur la
       page témoignages. Ce sont les signaux que les concurrents ne peuvent pas
       fabriquer. */
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
