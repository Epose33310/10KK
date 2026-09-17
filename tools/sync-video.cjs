/**
 * Pose la vidéo d'ambiance de la page d'accueil — ou la retire.
 *
 *   node tools/sync-video.cjs
 *
 * Si assets/video/atelier-esope.mp4 existe, l'emplacement `data-video-slot`
 * de index.html reçoit une <video> en boucle et sans son, avec la photo en
 * affiche. Sinon il revient à la photo seule : aucune requête en 404 tant
 * que le fichier n'est pas là.
 */
const { readFileSync, writeFileSync, existsSync, readdirSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const video = join(root, 'assets', 'video');
/* On accepte le nom attendu, ou n'importe quel autre .mp4 déposé dans le
   dossier qui ne soit pas la vidéo d'une page d'atelier : pas besoin de
   renommer son fichier avant de le déposer. */
const ATELIERS = ['slam', 'rap', 'eloquence', 'battle'].map((k) => `atelier-${k}.mp4`);
const trouve = (ext) => {
  const attendu = `atelier-esope.${ext}`;
  if (existsSync(join(video, attendu))) return attendu;
  return readdirSync(video).find((f) =>
    f.toLowerCase().endsWith('.' + ext) && !ATELIERS.includes(f)) || null;
};
const mp4 = trouve('mp4');
const webm = trouve('webm');

const AFFICHE = 'assets/img/atelier-1.jpg';
const ALT = 'Esope en atelier slam dans une classe';

const photo = `
      <img src="${AFFICHE}" alt="${ALT}" width="1100" height="1300">
    `;

const lecteur = `
      <video class="photoset__video" poster="${AFFICHE}"
             autoplay muted loop playsinline preload="metadata"
             aria-label="${ALT}" width="1100" height="1300">${
  webm ? `\n        <source src="assets/video/${encodeURI(webm)}" type="video/webm">` : ''}
        <source src="assets/video/${encodeURI(mp4)}" type="video/mp4">
      </video>
    `;

const chemin = join(root, 'index.html');
const html = readFileSync(chemin, 'utf8');

const motif = /(<figure class="photoset__item photoset__item--main tear-b" data-video-slot>)[\s\S]*?(<\/figure>)/;
if (!motif.test(html)) {
  console.error('Emplacement `data-video-slot` introuvable dans index.html.');
  process.exit(1);
}

const sortie = html.replace(motif, (_, ouvre, ferme) => ouvre + (mp4 ? lecteur : photo) + ferme);
writeFileSync(chemin, sortie);
console.log(mp4
  ? `→ vidéo posée : ${mp4}` + (webm ? ` + ${webm}` : ' (un webm allégerait)')
  : '→ pas de vidéo dans assets/video/ : la photo reste en place');
