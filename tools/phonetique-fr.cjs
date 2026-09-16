/**
 * Phonétique française, réduite à ce dont un jeu de rimes a besoin :
 * extraire la RIME d'un mot, c'est-à-dire la dernière voyelle prononcée et
 * tout ce qui la suit.
 *
 * Les erreurs en début de mot sont sans conséquence : seule la queue compte.
 * On ne cherche donc pas une transcription complète, mais une fin fiable.
 */

// Finales où « -er » se prononce /ɛʁ/ et non /e/.
const ER_OUVERT = new Set(['mer', 'fer', 'ver', 'cher', 'hier', 'hiver', 'amer',
  'enfer', 'cancer', 'super', 'winter', 'ver', 'ter', 'aster']);

// Mots où « -ill- » se prononce /il/ et non /ij/.
const ILL_DUR = new Set(['ville', 'villes', 'mille', 'milles', 'tranquille',
  'tranquilles', 'village', 'villages', 'million', 'millions', 'milliard',
  'milliards', 'billion', 'villa', 'villas', 'bacille', 'pupille']);

const VOYELLES = 'aeiouyàâäéèêëîïôöùûüœ';
const estVoyelle = (c) => VOYELLES.indexOf(c) !== -1;

/** Digrammes et trigrammes, du plus long au plus court. */
const REGLES = [
  ['ouill', 'uj'], ['euill', '2j'], ['ueill', '2j'], ['aill', 'aj'], ['eill', 'Ej'],
  ['eaux', 'o'], ['eau', 'o'],
  ['œu', '2'], ['oeu', '2'],
  ['ouil', 'uj'], ['euil', '2j'], ['ueil', '2j'], ['ail', 'aj'], ['eil', 'Ej'],
  ['ain', 'E~'], ['aim', 'E~'], ['ein', 'E~'], ['eim', 'E~'], ['oin', 'wE~'],
  ['ien', 'jE~'], ['ion', 'jO~'],
  ['ou', 'u'], ['oû', 'u'], ['oi', 'wa'], ['oî', 'wa'],
  ['au', 'o'], ['ai', 'E'], ['aî', 'E'], ['ei', 'E'], ['eu', '2'], ['eû', '2'],
  ['an', 'A~'], ['am', 'A~'], ['en', 'A~'], ['em', 'A~'],
  ['on', 'O~'], ['om', 'O~'],
  ['in', 'E~'], ['im', 'E~'], ['un', 'E~'], ['yn', 'E~'], ['ym', 'E~'],
  ['gn', 'N'], ['ch', 'S'], ['ph', 'f'], ['th', 't'], ['qu', 'k'],
  ['ss', 's'], ['cc', 'k'], ['ll', 'l'], ['mm', 'm'], ['nn', 'n'],
  ['tt', 't'], ['pp', 'p'], ['rr', 'R'], ['ff', 'f'], ['bb', 'b'], ['dd', 'd'], ['gg', 'g']
];

const SIMPLES = {
  a: 'a', 'à': 'a', 'â': 'a', 'ä': 'a',
  e: 'e', 'é': 'e', 'è': 'E', 'ê': 'E', 'ë': 'E',
  i: 'i', 'î': 'i', 'ï': 'i',
  o: 'o', 'ô': 'o', 'ö': 'o',
  u: 'y', 'û': 'y', 'ù': 'y', 'ü': 'y',
  y: 'i', 'œ': '2',
  b: 'b', d: 'd', f: 'f', h: '', j: 'Z', k: 'k', l: 'l', m: 'm', n: 'n',
  p: 'p', q: 'k', r: 'R', t: 't', v: 'v', w: 'w', z: 'z', 'ç': 's'
};

/** Une nasale n'en est une que si rien de vocalique ne suit. */
function nasaleValide(mot, i, motif) {
  const suivant = mot[i + motif.length];
  if (suivant === undefined) return true;
  return !estVoyelle(suivant) && suivant !== 'n' && suivant !== 'm';
}

function phonemes(motBrut) {
  let mot = String(motBrut || '').toLowerCase().trim();
  if (!mot) return [];

  const dur = ILL_DUR.has(mot);
  const out = [];
  let i = 0;

  // Finales traitées d'abord : elles échappent aux règles générales.
  let finale = null;
  let eFinalMuet = false;
  if (/[^aeiouyàâéèêëîïôùûü]ent$/.test(mot) && !/ment$/.test(mot)) {
    finale = [];                    // 3e personne du pluriel : muet
    mot = mot.slice(0, -3);
  } else if (/ment$/.test(mot)) {
    finale = ['m', 'A~'];
    mot = mot.slice(0, -4);
  } else if (/ers?$/.test(mot) && mot.length > 3 && !ER_OUVERT.has(mot.replace(/s$/, ''))) {
    finale = ['e'];
    mot = mot.replace(/ers?$/, '');
  } else if (/ez$/.test(mot) && mot.length > 2) {
    finale = ['e'];
    mot = mot.slice(0, -2);
  } else if (/et$/.test(mot) && mot.length > 2) {
    finale = ['E'];
    mot = mot.slice(0, -2);
  }

  if (/e$/.test(mot)) {
    eFinalMuet = true;              // la boucle saute déjà ce « e »
  } else if (/es$/.test(mot)) {
    mot = mot.slice(0, -1);         // pluriel : on retire le « s », pas le « e »
    eFinalMuet = true;
  }

  while (i < mot.length) {
    let trouve = false;

    if (!dur && mot.startsWith('ill', i) && i > 0) {
      out.push('i', 'j'); i += 3; continue;
    }

    for (const [motif, son] of REGLES) {
      if (!mot.startsWith(motif, i)) continue;
      const nasale = son.indexOf('~') !== -1;
      if (nasale && !nasaleValide(mot, i, motif)) continue;
      out.push(...son.split(/(?=[a-zA-Z2])/).filter(Boolean).length > 1 ? son.match(/[A-Za-z2]~?/g) : [son]);
      i += motif.length;
      trouve = true;
      break;
    }
    if (trouve) continue;

    const c = mot[i];
    const suivant = mot[i + 1];

    if (c === 'e') {
      // « e » final ou devant une finale muette : non prononcé.
      if (i === mot.length - 1) { i += 1; continue; }
      // Devant deux consonnes, le « e » est ouvert : « assiette » /ɛt/,
      // « belle » /ɛl/, et non /e/.
      const c1 = mot[i + 1];
      const c2 = mot[i + 2];
      const consonne = (x) => x !== undefined && !estVoyelle(x);
      out.push(consonne(c1) && consonne(c2) ? 'E' : 'e');
    } else if (c === 'c') {
      out.push('eiéèêy'.indexOf(suivant) !== -1 ? 's' : 'k');
    } else if (c === 'g') {
      out.push('eiéèêy'.indexOf(suivant) !== -1 ? 'Z' : 'g');
    } else if (c === 's') {
      const precedent = mot[i - 1];
      out.push(precedent && estVoyelle(precedent) && suivant && estVoyelle(suivant) ? 'z' : 's');
    } else if (c === 'x') {
      out.push('k', 's');
    } else if (SIMPLES[c] !== undefined) {
      if (SIMPLES[c]) out.push(SIMPLES[c]);
    }
    i += 1;
  }

  if (finale) out.push(...finale);

  // Consonnes finales muettes : en français, tout sauf c, r, f, l. On ne
  // touche à rien quand un « e » muet suivait : la consonne est prononcée.
  while (!eFinalMuet && out.length) {
    const dernier = out[out.length - 1];
    if ('stdxzpgnbm'.indexOf(dernier) !== -1 && dernier.length === 1) out.pop();
    else break;
  }

  return out;
}

const EST_VOYELLE_PHON = (p) => /^[aeEioyu2]$|~/.test(p);

/** La rime : dernière voyelle prononcée et tout ce qui suit. */
function rime(mot) {
  const p = phonemes(mot);
  for (let i = p.length - 1; i >= 0; i -= 1) {
    if (!EST_VOYELLE_PHON(p[i])) continue;
    let debut = i;
    if (debut > 0 && /^[wjH]$/.test(p[debut - 1])) debut -= 1;
    return p.slice(debut).join('');
  }
  return '';
}

module.exports = { phonemes, rime };
