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
