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
demo.html             Démo en ligne : les outils d'atelier à essayer
assets/css/style.css  Jetons de design + composants
assets/js/app.js      Interactions (sans dépendance)
assets/fonts/         Inter Tight et Anton, servies depuis le dépôt
assets/img/           Photos (à remplacer)
assets/docs/          PDF générés
tools/                Gabarits des PDF, contenus des pages, scripts
```

## Les pages d'atelier sont générées

Les quatre pages `atelier-*.html` **ne se modifient pas à la main** : leur contenu
vit dans `tools/build-pages.cjs`, qui réutilise le header, les fenêtres modales et
le pied de page de `index.html`. Après toute modification du header ou du contenu
d'un atelier :

```bash
node tools/build-pages.cjs
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
