# Esope — site des ateliers slam, rap et éloquence

Site vitrine statique d'un intervenant culturel : ateliers slam, rap, éloquence et
battle de compliments, pour les établissements scolaires et les structures
accueillant un jeune public. Aucune dépendance, aucun build, aucun tracker.

## Aperçu

Le visuel suit podia.com, relevé sur captures : header jaune fixe, canvas blanc
cassé, titres grotesques serrés, cartes gris clair, panneaux de couleur griffés de
traits fins, pied de page noir. Les couleurs sont échantillonnées au pixel.

| Module | Contenu |
|---|---|
| Header jaune fixe | Logo Anton, bouton noir, burger (mobile) / méga menu (ordinateur) |
| Hero | Titre, accroche, boutons, collage photo à bords déchirés |
| Chiffres | Trois grands nombres, façon Podia |
| Interventions | Quatre cartes menant chacune à sa page dédiée |
| Témoignages | Carrousel — **citations à remplacer par de vrais retours** |
| L'intervenant | Bio courte, distinctions à icônes, fenêtre parcours complet |
| FAQ | Six questions |
| Contact | Formulaire de demande |
| CTA final | Appel et téléchargement du dossier |
| Agenda | Fenêtre modale, ouverte depuis le menu uniquement |

Le manifeste, « générer de l'ambition » et le détail des distinctions vivent dans
la **fenêtre parcours** plutôt que dans la page : ils y sont accessibles en un clic
sans occuper de place. Les modalités détaillées sont dans les PDF.

### Palette

| Rôle | Valeur |
|---|---|
| Jaune header et boutons | `#fdc837` |
| Canvas | `#fdfdfc` |
| Carte grise | `#f4f3f1` |
| Encre | `#1a1a1a` |
| Pied de page | `#1b1a18` |
| Turquoise / magenta / vert / pervenche | `#55e7dd` `#ff98ff` `#88e2b3` `#96b4fc` |

## Lancer en local

Ouvrir `index.html` suffit. Pour un serveur local :

```bash
npx serve .
```

## Structure

```
index.html            Page d'accueil
atelier-*.html        Une page par intervention (générées)
demo.html             Démo en ligne : quatre jeux d'atelier (générée)
assets/css/style.css  Jetons de design + composants
assets/js/app.js      Interactions (sans dépendance)
assets/fonts/         Inter Tight et Anton, servies depuis le dépôt
assets/img/           Photos (à remplacer)
assets/docs/          PDF générés
assets/css/arcade.css Styles de la page démo, chargés par elle seule
assets/js/arcade.js   Ouverture des bornes de jeu
assets/js/game-*.js   Un fichier par jeu, chargé par la page démo
tools/                Gabarits des PDF, contenus des pages, scripts
```

## Les pages d'atelier sont générées

Les quatre pages `atelier-*.html` **ne se modifient pas à la main** : leur contenu
vit dans `tools/build-pages.cjs`, qui réutilise le header, les fenêtres modales et
le pied de page de `index.html`. Après toute modification du header ou du contenu
d'un atelier :

```bash
node tools/build-pages.cjs   # les quatre pages d'atelier
node tools/build-demo.cjs    # la page démo
```

Les cinq pages restent ainsi cohérentes, sans étape de build côté visiteur : ce
sont de simples fichiers HTML statiques.

## Les PDF téléchargeables

Deux documents sont proposés au téléchargement : le **dossier de diffusion**
(5 pages) et la **fiche projet** (1 page recto).

Ils ne reprennent pas le texte du site. Ils sont écrits pour être lus par une
direction : modalités pratiques, objections courantes et réponses, calendrier
type, financement, cadre pédagogique évaluable. Le site donne envie, les
documents font décider.

Ils sont **générés**, pas écrits à la main. Pour les régénérer après modification :

```bash
npm install playwright     # une seule fois
node tools/build-pdf.cjs
```

Chaque `tools/<nom>.html` produit `assets/docs/<nom>.pdf`. Pour ajouter un
document, créez un gabarit HTML dans `tools/` qui charge `pdf-style.css`, puis
relancez le script.

## Personnaliser

**Les photos.** Quatre fichiers de `assets/img/` sont des images de substitution :
`atelier-1.jpg` (portrait, la plus visible), `atelier-2.jpg`, `atelier-3.jpg` et
`ecriture-1.jpg`. **Écrasez-les en gardant les mêmes noms** et tout se met en
place : bords déchirés, duotone et aplats colorés sont appliqués par le CSS.

**Les vidéos.** Deux emplacements `.media__slot` attendent une intégration :
remplacez le contenu du bloc par une `<iframe>` YouTube ou Vimeo.

**L'agenda** n'est pas dans le flux de la page : c'est un `<dialog class="sheet">`
en fin de `index.html`, ouvert par tout élément portant `data-agenda`. Même
mécanique pour le parcours complet, avec `data-bio`.

**Le formulaire** ouvre la messagerie du visiteur (`mailto:`), sans serveur. Pour
recevoir les demandes directement, remplacez le bloc `form.addEventListener('submit', …)`
de `assets/js/app.js` par un envoi vers Formspree, Netlify Forms ou équivalent.

## Typographie

**Inter Tight** pour le texte, **Anton** pour le logo, toutes deux servies depuis
`assets/fonts/`. Aucune requête vers Google Fonts : le site s'affiche correctement
même hors ligne ou derrière un filtre, et les PDF sont identiques au site.

## Accessibilité et mouvement

- Toutes les animations se coupent sous `prefers-reduced-motion: reduce`.
- Navigation au clavier, focus visible, hiérarchie de titres continue.
- Les fenêtres utilisent `<dialog>` natif : focus piégé, fermeture par Échap.
- Vérifié sans débordement horizontal de 320 à 1920 px.

## Mise en ligne

N'importe quel hébergement statique. Avec GitHub Pages : *Settings → Pages*, puis
publier depuis la branche, dossier `/root`.


## La page démo

Quatre jeux, présentés en bornes d'arcade : bord d'encre, ombre portée dure,
emblème géométrique et gros numéro, un fond de couleur par discipline. Chaque
borne ouvre une fenêtre contenant son jeu.

**Jeu 03, éloquence** (`assets/js/game-eloquence.js`) : tranche d'âge, tirage du
sujet dans la bibliothèque correspondante, compte à rebours, soixante secondes de
chrono, puis auto-évaluation. Les réponses déclenchent des techniques ciblées —
aucune note, aucun jugement. Sujets, critères, points forts et techniques sont
quatre constantes en tête de fichier, modifiables sans toucher à la mécanique.

**Jeu 04, rap** (`assets/js/game-rap.js`) : un mot, 60 secondes, une rime à
trouver. Bonne réponse, mot suivant ; mauvaise, le mot reste. Le chrono est
ancré sur l'horloge et ne dérive pas.

La validation ne compare **pas des lettres**. `tools/phonetique-fr.cjs` transcrit
la fin prononcée d'un mot français — digrammes, nasales, semi-voyelles, « e »
muet, consonnes finales muettes — et en extrait la rime. `tools/build-rimes.cjs`
s'en sert **hors ligne** pour indexer un vrai lexique de 276 000 mots et n'en
garder que ce dont le jeu a besoin :

```bash
npm install an-array-of-french-words
node tools/build-rimes.cjs
```

Le jeu ne charge donc pas un dictionnaire de 640 Ko mais `assets/data/rimes.json`
(97 Ko compressés), **et seulement à l'ouverture de la borne**. Un mot est accepté
s'il figure dans le panier de rimes du mot affiché : son existence et sa rime sont
vérifiées d'un coup, sans faux positif orthographique. Pour changer les mots
cibles, éditez `TARGET_WORDS` dans le script et relancez-le.

**Jeu 01, slam** (`assets/js/game-slam.js`) : un verbe choisi puis verrouillé,
un sujet tiré au sort parmi soixante-deux, et l'amorce s'assemble avec le bon
accord. Le participant écrit la suite ; le site ne propose jamais de phrase à sa
place et ne juge jamais ce qu'il écrit.

Les formes conjuguées sont **écrites, pas dérivées** : vingt-cinq verbes sûrs,
pronominaux compris, valent mieux que trois cents approximatifs. Les
1 525 combinaisons possibles ont été vérifiées. La fonction `composer()` nettoie
la ponctuation de la suite saisie — points de suspension recopiés, espace avant
une virgule, espaces multiples, point en double.

**Jeu 02, battle** (`assets/js/game-battle.js`) : une personne tirée au sort,
une qualité et une image écrites par le joueur, puis la comparaison s'assemble
en trois temps. Chaque personne porte un genre — non pour corriger le joueur,
mais pour lui poser la bonne question (« celui qui **la** décrit ») et lui
proposer des exemples accordés.

Les quatre jeux sont donc en place. Le contenu des bornes se trouve dans leurs fenêtres affichent pour l'instant
`tools/build-demo.cjs`, dans la constante `GAMES`.

Les styles et le script de cette page sont dans des fichiers séparés
(`arcade.css`, `arcade.js`) chargés uniquement par elle : le reste du site n'en
porte pas le poids.
