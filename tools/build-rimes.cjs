/**
 * Construit l'index de rimes du jeu 04 à partir d'un vrai lexique français.
 *
 *   npm install an-array-of-french-words
 *   node tools/build-rimes.cjs
 *
 * Le jeu n'embarque pas le lexique entier (640 Ko compressés) : il n'a besoin
 * que des mots qui riment avec les mots cibles. On indexe donc hors ligne, et
 * le jeu ne charge qu'un fichier de quelques dizaines de kilo-octets.
 */
const { writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { rime } = require('./phonetique-fr.cjs');

const TARGET_WORDS = [
  'soleil', 'nuit', 'rêve', 'liberté', 'sourire', 'maison', 'lumière', 'voiture',
  'amour', 'école', 'musique', 'voyage', 'planète', 'mémoire', 'colère', 'victoire',
  'famille', 'histoire', 'chemin', 'demain', 'silence', 'montagne', 'fenêtre',
  'regard', 'enfance', 'courage', 'danse', 'étoile', 'parole', 'miroir'
];

let mots;
try {
  mots = require('an-array-of-french-words');
} catch (e) {
  console.error("Lexique absent. Lancer d'abord : npm install an-array-of-french-words");
  process.exit(1);
}

const propre = (w) => /^[a-zà-öø-ÿ]{3,13}$/.test(w);
const lexique = mots.filter(propre);

// Une rime par mot cible ; plusieurs cibles peuvent partager la même.
const rimesCibles = new Map();
for (const cible of TARGET_WORDS) {
  const r = rime(cible);
  if (!r) throw new Error('Rime introuvable pour ' + cible);
  if (!rimesCibles.has(r)) rimesCibles.set(r, []);
  rimesCibles.get(r).push(cible);
}

const paniers = {};
for (const r of rimesCibles.keys()) paniers[r] = [];

for (const mot of lexique) {
  const r = rime(mot);
  if (paniers[r]) paniers[r].push(mot);
}

// Les mots courts sont les plus courants : on garde les plus accessibles en
// tête, et on plafonne pour ne pas embarquer des milliers de formes rares.
const PLAFOND = 4000;
const index = {};
for (const [r, liste] of Object.entries(paniers)) {
  liste.sort((a, b) => a.length - b.length || a.localeCompare(b, 'fr'));
  index[r] = liste.slice(0, PLAFOND);
}

const sortie = {
  cibles: TARGET_WORDS.map((mot) => ({ mot, rime: rime(mot) })),
  rimes: index
};

const chemin = join(__dirname, '..', 'assets', 'data', 'rimes.json');
writeFileSync(chemin, JSON.stringify(sortie));

const poids = JSON.stringify(sortie).length;
console.log('mots cibles :', TARGET_WORDS.length, '· rimes distinctes :', Object.keys(index).length);
for (const [r, l] of Object.entries(index)) {
  const noms = rimesCibles.get(r).join(', ');
  console.log('  ' + r.padEnd(6) + String(paniers[r].length).padStart(6) + ' mots' +
    (paniers[r].length > PLAFOND ? ' → ' + PLAFOND : '') + '   (' + noms + ')');
}
console.log('fichier :', (poids / 1024).toFixed(0) + ' Ko bruts');
