/**
 * Fabrique les images d'attente des pages d'atelier.
 *
 *   NODE_PATH=/opt/node22/lib/node_modules node tools/build-placeholders.cjs
 *
 * Chaque image porte son nom de fichier et le cadrage attendu : il suffit de
 * la remplacer par la vraie photo, au même nom et au même rapport.
 * Ne pas relancer une fois les vraies photos en place — cela les écraserait.
 */
const { chromium } = require('playwright');
const { existsSync } = require('node:fs');
const { join } = require('node:path');

const out = join(__dirname, '..', 'assets', 'img');

const COULEURS = {
  slam: '#55e7dd', rap: '#96b4fc', eloquence: '#88e2b3', battle: '#ff98ff',
};

const IMAGES = [
  ['page-slam-1.jpg', 'slam', "La salle pendant l'écriture", 'large'],
  ['page-slam-2.jpg', 'slam', 'Un passage sur scène', 'large'],
  ['page-slam-3.jpg', 'slam', 'Le groupe et son enseignant', 'large'],
  ['page-rap-1.jpg', 'rap', "L'enregistrement en cabine", 'large'],
  ['page-rap-2.jpg', 'rap', 'Le tournage du clip', 'large'],
  ['page-rap-3.jpg', 'rap', "L'écoute du titre terminé", 'large'],
  ['page-eloquence-1.jpg', 'eloquence', 'Une prise de parole debout', 'large'],
  ['page-eloquence-2.jpg', 'eloquence', 'La joute devant le jury', 'large'],
  ['page-eloquence-3.jpg', 'eloquence', 'Le groupe en cercle', 'large'],
  ['page-battle-1.jpg', 'battle', "L'écriture des punchlines", 'large'],
  ['page-battle-2.jpg', 'battle', 'Le face-à-face sur scène', 'large'],
  ['page-battle-3.jpg', 'battle', 'Le public qui encourage', 'large'],
  // Affiches des emplacements vidéo : visibles tant que la vidéo n'est pas déposée.
  ['video-slam.jpg', 'slam', 'Vidéo — atelier slam', 'video'],
  ['video-rap.jpg', 'rap', 'Vidéo — atelier rap', 'video'],
  ['video-eloquence.jpg', 'eloquence', 'Vidéo — atelier éloquence', 'video'],
  ['video-battle.jpg', 'battle', 'Vidéo — battle de compliments', 'video'],
];

const TAILLES = { large: [1600, 760], video: [1600, 900] };

const gabarit = (fichier, couleur, legende, L, H, video) => `<!doctype html>
<meta charset="utf-8">
<style>
  html, body { margin: 0; }
  body {
    width: ${L}px; height: ${H}px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 18px;
    background: ${couleur};
    font: 600 34px/1.3 -apple-system, "Segoe UI", Roboto, sans-serif;
    color: rgba(26,26,26,0.82); text-align: center;
  }
  b { font-size: 58px; letter-spacing: -0.03em; color: #1a1a1a; }
  code { font: 500 26px/1 ui-monospace, Menlo, monospace; color: rgba(26,26,26,0.6); }
  small { font-size: 22px; color: rgba(26,26,26,0.55); }
</style>
${video ? '<b style="font-size:76px">▶</b>' : ''}
<b>${legende}</b>
<code>assets/img/${fichier}</code>
<small>${L} × ${H} — remplacez ce fichier par ${video ? "l'affiche de la vidéo" : 'la vraie photo'}</small>`;

(async () => {
  const nav = await chromium.launch();
  const page = await nav.newPage({ viewport: { width: 1600, height: 900 } });
  for (const [fichier, cle, legende, forme] of IMAGES) {
    const chemin = join(out, fichier);
    if (existsSync(chemin) && process.argv[2] !== '--force') {
      console.log('· ' + fichier + ' existe déjà, on n\'y touche pas');
      continue;
    }
    const [L, H] = TAILLES[forme];
    await page.setViewportSize({ width: L, height: H });
    await page.setContent(gabarit(fichier, COULEURS[cle], legende, L, H, forme === 'video'));
    await page.screenshot({ path: chemin, type: 'jpeg', quality: 82 });
    console.log('→ assets/img/' + fichier);
  }
  await nav.close();
})();
