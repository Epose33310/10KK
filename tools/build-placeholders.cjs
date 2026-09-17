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
  ['page-slam-1.jpg', 'slam', "La salle pendant l'écriture"],
  ['page-slam-2.jpg', 'slam', 'Un passage au micro'],
  ['page-rap-1.jpg', 'rap', "L'enregistrement en cabine"],
  ['page-rap-2.jpg', 'rap', 'Le groupe et le clip'],
  ['page-eloquence-1.jpg', 'eloquence', 'Une prise de parole debout'],
  ['page-eloquence-2.jpg', 'eloquence', 'La joute devant le jury'],
  ['page-battle-1.jpg', 'battle', "L'écriture des punchlines"],
  ['page-battle-2.jpg', 'battle', 'Le face-à-face sur scène'],
];

const L = 1600, H = 760;

const gabarit = (fichier, couleur, legende) => `<!doctype html>
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
<b>${legende}</b>
<code>assets/img/${fichier}</code>
<small>${L} × ${H} — remplacez ce fichier par la vraie photo</small>`;

(async () => {
  const nav = await chromium.launch();
  const page = await nav.newPage({ viewport: { width: L, height: H } });
  for (const [fichier, cle, legende] of IMAGES) {
    const chemin = join(out, fichier);
    if (existsSync(chemin) && process.argv[2] !== '--force') {
      console.log('· ' + fichier + ' existe déjà, on n\'y touche pas');
      continue;
    }
    await page.setContent(gabarit(fichier, COULEURS[cle], legende));
    await page.screenshot({ path: chemin, type: 'jpeg', quality: 82 });
    console.log('→ assets/img/' + fichier);
  }
  await nav.close();
})();
