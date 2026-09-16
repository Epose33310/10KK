/**
 * Génère les PDF téléchargeables à partir des gabarits HTML de ce dossier.
 *
 *   npm install playwright      (ou une installation globale)
 *   node tools/build-pdf.cjs
 *
 * Chaque tools/<nom>.html produit assets/docs/<nom>.pdf, au format A4, en
 * conservant les aplats de couleur et les polices du site.
 */
const { chromium } = require('playwright');
const { readdirSync } = require('node:fs');
const { join } = require('node:path');

const here = __dirname;
const out = join(here, '..', 'assets', 'docs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const file of readdirSync(here).filter((f) => f.endsWith('.html'))) {
    const name = file.replace(/\.html$/, '.pdf');
    await page.goto('file://' + join(here, file), { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });
    await page.pdf({ path: join(out, name), format: 'A4', printBackground: true });
    console.log('→ assets/docs/' + name);
  }

  await browser.close();
})();
