# Vidéo d'ambiance de la page d'accueil

Le bloc photo principal de la page d'accueil (`.photoset__item--main`) lit la
vidéo de ce dossier, en boucle et sans son. Tant que le fichier n'y est pas,
c'est l'affiche `assets/img/atelier-1.jpg` qui s'affiche à sa place.

## Ce qu'il faut déposer

| Fichier | Rôle |
| --- | --- |
| `atelier-esope.mp4` | la vidéo, en H.264 (lue partout) |
| `atelier-esope.webm` | la même, en VP9 — facultatif, plus léger |

## Format attendu

- **Cadrage vertical**, rapport 1100 × 1300 (environ 5:6). Le cadre recadre au
  centre : gardez le sujet au milieu.
- **10 à 20 secondes**, bouclées proprement (la dernière image doit rejoindre
  la première).
- **Sans son** : la piste audio peut être retirée, elle ne sera jamais jouée.
- **Moins de 3 Mo** si possible : la vidéo se charge sur mobile aussi.
- Pensez à mettre à jour l'affiche `assets/img/atelier-1.jpg` avec une image
  de la vidéo, pour que le raccord soit invisible au chargement.

---

# Vidéos des pages d'atelier

Chaque page d'atelier a son emplacement vidéo, juste après le bloc de
description (public, format, jauge, restitution). Tant que le fichier n'est
pas là, c'est l'affiche `assets/img/video-<atelier>.jpg` qui s'affiche.

| Page | Fichier à déposer |
| --- | --- |
| `atelier-slam.html` | `atelier-slam.mp4` (et `.webm` si possible) |
| `atelier-rap.html` | `atelier-rap.mp4` |
| `atelier-eloquence.html` | `atelier-eloquence.mp4` |
| `atelier-battle.html` | `atelier-battle.mp4` |

## Format attendu

- **Cadrage vertical** — c'est le format des quatre vidéos en place, tournées
  au téléphone ; le cadre s'y adapte (largeur maximale 560 px sur ordinateur).
- 5 à 30 secondes, bouclées proprement.
- Sans son : la piste audio ne sera jamais jouée.
- Moins de 4 Mo si possible.
- Pensez à remplacer aussi l'affiche `assets/img/video-<atelier>.jpg` par une
  image tirée de la vidéo.

## Une fois les fichiers déposés

```
node tools/sync-video.cjs      # la vidéo de la page d'accueil
node tools/build-pages.cjs     # les vidéos des quatre pages d'atelier
```

---

# Le film de la page « Témoignages & médias »

Celui-là n'est ni muet ni en boucle : il se lance au clic, avec le son.

| Fichier | Rôle |
| --- | --- |
| `esope-battle.mp4` + `.webm` | « Un battle de compliments d'Esope » — 1 min 05, 640 × 360 |

Le même fichier sert au bouton discret de la fenêtre « Le parcours d'Esope ».
Son affiche (`assets/img/film-battle.jpg`) est extraite de la vidéo ; si vous
la remplacez, refaites l'affiche avec :

```
ffmpeg -ss 18 -i assets/video/esope-battle.mp4 -frames:v 1 -q:v 3 \
  -vf scale=1000:-2 assets/img/film-battle.jpg
```

Ici le mp4 est déclaré avant le webm : sur ces deux films il est le plus léger
et il est décodé par le matériel. Le webm ne sert qu'aux navigateurs livrés
sans décodeur H.264.

---

# État actuel (vidéos en place)

| Emplacement | Fichier | Poids |
| --- | --- | --- |
| Accueil (hero, vertical) | `atelier-esope.mp4` + `.webm` | 2,6 / 2,1 Mo |
| `atelier-slam.html` | `atelier-slam.mp4` + `.webm` | 2,0 / 2,4 Mo |
| `atelier-eloquence.html` | `atelier-eloquence.mp4` + `.webm` | 1,1 / 0,9 Mo |
| `atelier-rap.html` | `atelier-rap.mp4` + `.webm` | 0,7 / 0,9 Mo |
| `atelier-battle.html` | `atelier-battle.mp4` + `.webm` | 0,8 / 0,7 Mo |

Les sources envoyées (`Ateliers Battle.mp4`, `Ateliers Slam 2.mp4`,
`Esope Flex.MOV`, `atelier éloquenceh.mov`, `-4307615840185493331.MP4`) ont
été converties :

- piste audio retirée,
- `.mov` → `.mp4` H.264, plus un `.webm` VP9 en secours (certains navigateurs
  Chromium sont livrés sans décodeur H.264),
- largeur ramenée à 720 px, 30 images/seconde, `faststart` activé,
- affiches (`assets/img/video-*.jpg`) extraites d'une image de chaque vidéo.

Pour remplacer une vidéo : déposez le nouveau fichier ici, puis

```
node tools/sync-video.cjs && node tools/build-pages.cjs
```

`build-pages.cjs` détecte tout seul `atelier-<page>.mp4` : déposer le fichier
suffit à brancher la page, il n'y a rien à modifier dans les données.
