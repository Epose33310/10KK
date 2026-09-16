# Poetrip — site des ateliers slam

Site vitrine statique pour des ateliers de slam : formats d'intervention, méthode,
agenda, témoignages, FAQ et demande de devis. Aucune dépendance, aucun build,
aucun tracker — trois fichiers et c'est en ligne.

## Aperçu

| Section | Contenu |
|---|---|
| Bandeau | Annonce en haut de page, terracotta, défile avec la page |
| Navigation | Méga menu « Les ateliers » : par atelier + par public |
| Hero | Titre à mot tournant, blobs en parallaxe, trois cartes de format |
| Les ateliers | Slam (terracotta) · Battle de compliments (lavender) · Éloquence (sky) · Rap (cream) |
| Publics | Scolaire (sky) · Entreprises (terracotta) · Tout public (lavender) |
| Méthode | Les quatre temps d'un atelier, avec leur durée |
| Écrire / Dire / Monter sur scène | Trois blocs deux colonnes alternés |
| Atelier express | Machine à consignes (tirage aléatoire) + chrono de scène de 3 min |
| Agenda | Dates filtrables par catégorie |
| Témoignages · FAQ · Contact | Cartes, accordéon, formulaire validé côté client |

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

**Le bandeau d'annonce** est le bloc `.announce`, tout en haut de `index.html` :
un texte et un lien, à changer à chaque nouvelle annonce. Le supprimer entièrement
ne casse rien.

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
