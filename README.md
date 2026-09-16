# Poetrip — site des ateliers slam

Site vitrine statique pour des ateliers de slam : formats d'intervention, méthode,
agenda, témoignages, FAQ et demande de devis. Aucune dépendance, aucun build,
aucun tracker — trois fichiers et c'est en ligne.

## Aperçu

Le visuel suit podia.com, relevé sur captures : header jaune fixe, canvas blanc
cassé, titres grotesques serrés, cartes gris clair, panneaux de couleur griffés
de traits fins, pied de page noir. Les couleurs sont échantillonnées au pixel.

| # | Module | Contenu |
|---|--------|---------|
| 1 | Header jaune fixe | Logo script, bouton noir, burger (mobile) / méga menu (ordinateur) |
| 2 | Hero | Titre géant centré, sous-titre, bouton jaune, collage papier |
| 3 | Chiffres | Trois nombres géants, empilés sur mobile, en ligne sur ordinateur |
| 4 | Collage + texte | Collage, puis titre, paragraphe long, bouton jaune + lien souligné |
| 5 | Titre entouré | « Découvre l'intérieur », cercle tracé au feutre à l'arrivée à l'écran |
| 6 | Cartes produit | Zone grise (titre, texte, bouton noir) + panneau coloré avec maquette |
| — | Atelier express | Machine à consignes + chrono de scène de 3 min |
| — | Agenda | Dates filtrables par catégorie |
| 7 | Témoignages | Carrousel de cartes colorées, pastilles de pagination |
| — | FAQ · Contact | Accordéon et formulaire de devis |
| 8 | CTA final | Collage, titre, sous-titre, bouton jaune |
| 9 | Pied de page noir | Logo script, quatre colonnes, réseaux, mentions |

### Palette relevée

| Rôle | Valeur |
|---|---|
| Jaune header et boutons | `#fdc837` |
| Canvas | `#fdfdfc` |
| Carte grise | `#f4f3f1` |
| Encre | `#1a1a1a` |
| Pied de page | `#1b1a18` |
| Turquoise / magenta / vert / pervenche | `#55e7dd` `#ff98ff` `#88e2b3` `#96b4fc` |

## Lancer en local

Ouvrir `index.html` dans un navigateur suffit. Pour un serveur local :

```bash
npx serve .
# ou
python3 -m http.server 8000
```

## Structure

```
index.html            Toute la page
assets/css/style.css  Jetons de design + composants
assets/js/app.js      Interactions (sans dépendance)
```

## Personnaliser

**Les photos.** Les collages contiennent des emplacements gris marqués « votre
photo d'atelier » (`.collage__center`). Remplacez le bloc par une balise `<img>`
pour que le collage prenne vie : les aplats de couleur autour sont conçus pour
encadrer une vraie photo.

**Le méga menu** est le bloc `.mega` dans `<header class="nav">`. Chaque entrée
pointe aujourd'hui vers une ancre de la page (`#atelier-slam`, `#atelier-rap`…) :
le jour où chaque atelier aura sa propre page, il suffit de remplacer l'ancre par
l'URL de la page, sans toucher au reste. Les mêmes entrées sont reprises dans le
menu mobile (`.nav__mobile-sub`) — pensez à modifier les deux.

**Le contenu** se modifie directement dans `index.html` : les dates de l'agenda sont
des blocs `<article class="event" data-category="…">`, les catégories disponibles
étant `scene`, `stage` et `jeunesse` (ajouter une catégorie = ajouter un bouton
`<button class="filter" data-filter="…">` correspondant).

**Les consignes d'écriture** de l'atelier express vivent en haut de `assets/js/app.js`,
dans les tableaux `OBJETS`, `CONTRAINTES` et `COULEURS`. Toute combinaison des trois
produit une consigne jouable.

**Les couleurs et la typographie** sont des variables CSS déclarées dans `:root`
(`assets/css/style.css`). La triade chromatique est associative : sky = scolaire,
terracotta = entreprises, lavender = tout public. Sur un fond coloré, les boutons
passent dans la variante sombre correspondante (deep-teal, graphite, plum).

**Le formulaire** ouvre la messagerie du visiteur avec une demande pré-remplie
(`mailto:`), sans serveur ni stockage. Pour recevoir les demandes directement,
remplacer le bloc `form.addEventListener('submit', …)` par un envoi vers un service
de formulaire (Formspree, Netlify Forms, etc.) — l'adresse de destination
`slampoetrip@gmail.com` apparaît dans `index.html` et `assets/js/app.js`.

## Parti pris de design

Surfaces mates, sans ombre ni dégradé : la hiérarchie vient des aplats de couleur et
des rayons (56 px pour les cartes de format, 24 px pour les cartes de contenu, 8 px
pour les boutons). Les formes organiques flottantes restent décoratives, en fond, à
opacité réduite, et ne sont jamais interactives.

## Accessibilité et mouvement

- Toutes les animations (révélations, parallaxe, défilé, compteurs, mot tournant)
  se coupent sous `prefers-reduced-motion: reduce` ; le contenu reste complet.
- La parallaxe des blobs est désactivée sous 720 px, où les formes sont aussi
  réduites et atténuées pour ne pas gêner la lecture.
- Navigation au clavier, focus visible, hiérarchie de titres continue, libellés de
  formulaire explicites et messages d'erreur reliés à leur champ.

## Mise en ligne

N'importe quel hébergement statique convient. Avec GitHub Pages : *Settings → Pages*,
puis publier depuis la branche souhaitée, dossier `/root`.
