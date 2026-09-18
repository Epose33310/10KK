/**
 * Les trois publics listés dans le méga-menu « Tous les publics » — source
 * commune à build-publics.cjs (qui génère leur page) et build-pages.cjs (qui
 * s'en sert pour renvoyer, depuis chaque page d'atelier, vers les publics
 * auxquels cet atelier convient le mieux).
 *
 * Champs :
 *   secteur   education | jeunesse | sante — identifiant court, partagé avec
 *             le champ `secteur` de data-projets.cjs et l'attribut
 *             data-public posé sur les témoignages de l'accueil.
 *   file      adresse de la page publics correspondante
 *   titre     nom affiché du public
 *   note      description courte, affichée sous le titre dans une carte
 *   color     couleur de bande partagée par la page et ses cartes de lien
 *   ateliers  { slam, rap, eloquence, battle } — pourquoi CET atelier
 *             convient à CE public, du point de vue du public. Réutilisé
 *             tel quel dans les deux sens : sur la page du public (les
 *             ateliers qui lui correspondent) et sur la page de l'atelier
 *             (les publics à qui il correspond).
 */
module.exports = [
  {
    secteur: 'education',
    file: 'public-education-nationale.html',
    titre: 'Éducation nationale',
    note: 'Primaire, collège, lycée, université.',
    color: 'yellow',
    ateliers: {
      slam: "Support direct du chapitre poésie : rimes, figures de style, prise de parole, dans l'ordre qui sert le texte plutôt que le manuel.",
      rap: "Un format qui embarque les élèves les plus éloignés de l'écrit, jusqu'à un titre enregistré qu'on peut faire écouter en classe.",
      eloquence: 'Prépare directement le grand oral et les épreuves orales certificatives : argumentaire, voix, gestion du trac.',
      battle: "Le format le plus demandé en médiation et cohésion de classe, en début d'année ou après un conflit.",
    },
  },
  {
    secteur: 'jeunesse',
    file: 'public-structures-jeunesse.html',
    titre: 'Structures jeunesse',
    note: 'Associations, MJC, dispositifs éducatifs.',
    color: 'magenta',
    ateliers: {
      slam: "Un espace d'expression libre, sans note ni évaluation, pour des jeunes qui viennent par envie plutôt que par obligation.",
      rap: "Le format qui parle immédiatement à des jeunes déjà familiers du genre — jusqu'à un titre et un clip qui existent après l'atelier.",
      eloquence: "Utile en amont d'un concours, d'une prise de parole publique ou d'une restitution associative.",
      battle: "Un excellent outil d'accroche avec un groupe mouvant ou qui ne se connaît pas encore.",
    },
  },
  {
    secteur: 'sante',
    file: 'public-sante-medico-social.html',
    titre: 'Santé et médico-social',
    note: "Hôpitaux, EHPAD, IME, foyers d'accueil.",
    color: 'green',
    ateliers: {
      slam: "Le format le plus installé dans ce secteur : un espace d'écriture personnelle, sur la vie, le passé, l'entourage, au rythme du groupe.",
      rap: "Peut convenir à un public déjà familier du genre, en petit groupe et avec un cadre très resserré.",
      eloquence: "À réserver à des groupes déjà à l'aise avec la prise de parole individuelle — rarement le premier format proposé ici.",
      battle: "Également solide dans ce secteur : on écrit pour l'autre, dans un principe qui valorise plutôt qu'il ne juge.",
    },
  },
];
