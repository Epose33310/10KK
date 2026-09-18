/**
 * Génère sitemap.xml et robots.txt pour l'ensemble du site.
 *
 *   node tools/build-sitemap.cjs
 *
 * Le fichier n'est pas tenu à la main : le script balaie les pages HTML de la
 * racine, ce qui évite qu'un récit publié plus tard soit oublié. La date de
 * dernière modification vient du dernier commit qui a touché le fichier — plus
 * fiable que la date du disque, qui change à chaque régénération.
 */
const { readdirSync, readFileSync, writeFileSync } = require('node:fs');
const { execFileSync } = require('node:child_process');
const { join } = require('node:path');

const root = join(__dirname, '..');
const SITE = 'https://slamesope.fr/';

/* Les pages hors sitemap : rien pour l'instant, mais l'entrée est là pour les
   pages de service (remerciement de formulaire, mentions…) à venir. */
const EXCLUES = new Set([]);

/* L'accueil d'abord, puis les ateliers, puis le reste. Une page absente de
   cette liste prend 0.6 : elle est référencée sans être poussée. */
const POIDS = {
  'index.html': ['', '1.0', 'monthly'],
  'atelier-slam.html': ['atelier-slam.html', '0.9', 'monthly'],
  'atelier-rap.html': ['atelier-rap.html', '0.8', 'monthly'],
  'atelier-battle.html': ['atelier-battle.html', '0.8', 'monthly'],
  'atelier-eloquence.html': ['atelier-eloquence.html', '0.8', 'monthly'],
  'public-education-nationale.html': ['public-education-nationale.html', '0.8', 'monthly'],
  'public-structures-jeunesse.html': ['public-structures-jeunesse.html', '0.8', 'monthly'],
  'public-sante-medico-social.html': ['public-sante-medico-social.html', '0.8', 'monthly'],
  'projets.html': ['projets.html', '0.8', 'weekly'],
  'temoignages.html': ['temoignages.html', '0.7', 'monthly'],
  'demo.html': ['demo.html', '0.6', 'yearly'],
};

const aujourdhui = new Date().toISOString().slice(0, 10);
const dateDe = (f) => {
  try {
    const d = execFileSync('git', ['log', '-1', '--format=%cs', '--', f],
      { cwd: root, encoding: 'utf8' }).trim();
    return d || aujourdhui;
  } catch { return aujourdhui; }
};

const fichiers = readdirSync(root)
  .filter((f) => f.endsWith('.html') && !EXCLUES.has(f));

/* Ordre : l'accueil, les pages listées dans POIDS, puis les récits par ordre
   alphabétique — l'ordre du sitemap n'a pas de valeur SEO, mais un fichier
   lisible se relit. */
const rang = (f) => {
  const cles = Object.keys(POIDS);
  const i = cles.indexOf(f);
  return i === -1 ? cles.length : i;
};
fichiers.sort((a, b) => rang(a) - rang(b) || a.localeCompare(b));

const urls = fichiers.map((f) => {
  const [chemin, prio, freq] = POIDS[f] || [f, '0.7', 'monthly'];
  return `  <url>
    <loc>${SITE}${chemin}</loc>
    <lastmod>${dateDe(f)}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${prio}</priority>
  </url>`;
});

writeFileSync(join(root, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`);
console.log('→ sitemap.xml  (' + urls.length + ' adresses)');

writeFileSync(join(root, 'robots.txt'),
  `# Tout est indexable sauf les sources des générateurs.
User-agent: *
Allow: /
Disallow: /tools/

Sitemap: ${SITE}sitemap.xml
`);
console.log('→ robots.txt');
