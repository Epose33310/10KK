/**
 * Génère esope.html — une page à part sur Esope (bio, palmarès, valeurs,
 * vidéos), volontairement dans une DA sombre différente du reste du site.
 *
 * TEST EN COURS : cette page n'est encore reliée depuis nulle part ailleurs
 * sur le site (pas de lien dans le header, le footer, ni les mentions
 * « Esope » du texte courant), et porte un <meta name="robots" content=
 * "noindex, nofollow"> tant qu'elle n'est pas validée. Une fois validée,
 * retirer cette balise, retirer 'esope.html' de EXCLUES dans
 * build-sitemap.cjs, et brancher les liens voulus.
 *
 *   node tools/build-esope.cjs
 *
 * Feuille de style : assets/css/esope.css, autonome (ne dépend pas de
 * style.css). JS : un tout petit script en bas de page, propre à elle —
 * elle ne touche pas à assets/js/app.js.
 */
const { readFileSync, writeFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const index = readFileSync(join(root, 'index.html'), 'utf8');
const assetVersion = (index.match(/style\.css\?v=(\d+)/) || [, '1'])[1];
const ech = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* --- Icônes du palmarès — mêmes tracés que sur l'accueil ------------------ */
const ICONES = [
  'M7 3h10v2h3v3a4 4 0 0 1-4 4h-.3A5 5 0 0 1 13 15.9V18h3v3H8v-3h3v-2.1A5 5 0 0 1 7.3 12H7a4 4 0 0 1-4-4V5h4V3zM7 7H5v1a2 2 0 0 0 2 2V7zm10 0v3a2 2 0 0 0 2-2V7h-2z',
  'M8 2l2 4h4l2-4h3l-2.6 5.2A7 7 0 1 1 7.6 7.2L5 2h3zm4 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 1.6l1.1 2.2 2.4.4-1.7 1.7.4 2.4-2.2-1.1-2.2 1.1.4-2.4L8.5 13l2.4-.4L12 10.6z',
  'M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z',
  'M12 3 1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z',
  'M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3zM5 11h2a5 5 0 0 0 10 0h2a7 7 0 0 1-6 6.9V21h3v2H8v-2h3v-3.1A7 7 0 0 1 5 11z',
];

const PALMARES = [
  'Champion de France de Slam',
  'Champion Sud-Ouest de Slam',
  'Coach du Champion de France de Slam',
  'Juré d’événements nationaux',
  'Participant du Rap Contenders',
];

const VALEURS = [
  ['Atelier non conventionnel', "Bien que la forme soit scolaire, mon attitude est celle d'un intervenant extérieur."],
  ['Pratiquer pour comprendre', "L'élève devient auteur et orateur, mais aussi spectateur attentif des autres créations."],
  ['Plus aucune hiérarchie', "Les cartes sont redistribuées pour que la pression scolaire ne freine pas l'écriture."],
  ['Célébrer le courage', "Pas d'applaudissements, pas d'art. L'élève doit être conscient de la mission accomplie."],
];

/* --- Vidéos : chaque emplacement se branche tout seul dès que le fichier
   existe, comme pour les pages d'atelier — rien à modifier ici pour ajouter
   une vidéo, juste déposer assets/video/<clé>.mp4 (+ .webm si possible) et
   assets/img/<affiche>.jpg, puis relancer ce script. */
const VIDEOS = [
  { cle: 'esope-battle', titre: 'Un battle de compliments d’Esope', affiche: 'film-battle.jpg' },
  { cle: 'atelier-esope', titre: 'Esope en atelier', affiche: 'atelier-1.jpg' },
  { cle: 'esope-2', titre: 'Vidéo à venir' },
  { cle: 'esope-3', titre: 'Vidéo à venir' },
];

const video = (v) => {
  const mp4 = existsSync(join(root, 'assets', 'video', `${v.cle}.mp4`));
  if (!mp4) return `
      <div class="evideo evideo--soon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
        <span>${ech(v.titre)}</span>
      </div>`;
  const webm = existsSync(join(root, 'assets', 'video', `${v.cle}.webm`));
  return `
      <div class="evideo">
        <video preload="none" poster="assets/img/${v.affiche}" aria-label="${ech(v.titre)}">${webm ? `
          <source src="assets/video/${v.cle}.webm" type="video/webm">` : ''}
          <source src="assets/video/${v.cle}.mp4" type="video/mp4">
        </video>
        <button class="evideo__play" type="button" data-play-video aria-label="Lire : ${ech(v.titre)}">
          <span class="evideo__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
          <span class="evideo__label">${ech(v.titre)}</span>
        </button>
      </div>`;
};

const GALERIE = [
  ['assets/img/page-eloquence-2.jpg', 'Esope anime un atelier éloquence devant une classe, au tableau'],
  ['assets/img/page-rap-2.jpg', 'Esope penché sur la table, guide l’écriture d’un texte de rap'],
  ['assets/img/photo-slam.jpg', 'Esope au micro, debout devant un amphithéâtre de collégiens'],
];

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Esope — le parcours complet</title>
<meta name="description" content="Champion de France de Slam, pédagogue depuis 2016 : la bio complète d'Esope, son palmarès, ses valeurs et quelques vidéos.">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#050505">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%23050505'/%3E%3C/svg%3E">
<link rel="stylesheet" href="assets/css/esope.css?v=${assetVersion}">
</head>
<body>

<span id="top"></span>

<nav class="enav">
  <a class="enav__logo" href="#top">Esope</a>
  <a class="enav__back" href="index.html">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
    Retour au site
  </a>
</nav>

<header class="ehero" style="--photo:url('assets/img/portrait-esope.jpg')">
  <div class="ehero__bg" aria-hidden="true"></div>
  <div class="ehero__inner">
    <p class="ehero__eyebrow">Le parcours complet</p>
    <h1 class="ehero__title">Esope</h1>
    <p class="ehero__sub">Champion de France de Slam. Artiste, pédagogue, transmetteur de mots — depuis 2016.</p>
  </div>
  <span class="ehero__scroll">Découvrir</span>
</header>

<div class="wrap">
  <div class="estats" data-stagger>
    <div class="estat"><b>300+</b><span>ateliers menés</span></div>
    <div class="estat"><b>5 000+</b><span>participants rencontrés</span></div>
    <div class="estat"><b>2016</b><span>premiers ateliers</span></div>
  </div>
</div>

<section class="section wrap">
  <div class="erecit">
    <p data-reveal>Depuis l'adolescence, j'ai voulu construire des projets en lien avec le slam
      et le rap. Je ne savais pas quoi ni comment, mais je voulais faire des choses. Faire des
      choses non seulement pour alimenter et partager ma passion, mais également pour grandir et
      vivre avec elle.</p>
    <p data-reveal>Au cours de mon parcours, j'ai saisi toutes les opportunités qui s'offraient à
      moi. J'ai écumé les scènes slam, enregistré des chansons de rap, publié un recueil, organisé
      des visites en poésie de lieux culturels et même défendu ma verve au Rap Contenders.</p>
  </div>

  <figure class="ebreak wrap" data-reveal>
    <img src="assets/img/page-eloquence-2.jpg" alt="Esope anime un atelier éloquence devant une classe, au tableau" loading="lazy">
  </figure>

  <div class="erecit">
    <p data-reveal>Aujourd'hui, je trouve beaucoup de plaisir à faire des conférences, des ateliers
      slam ou des formations d'éloquence. J'essaye toujours de partager ce que je sais en étant le
      plus créatif et pertinent possible. À travers l'enseignement, j'ai aussi trouvé une façon de
      continuellement apprendre.</p>
    <p data-reveal>Transmettre est un mot qui pourrait définir la vision de mon métier. Via des
      ateliers slam ou des performances artistiques, c'est exactement ça que je fais : transmettre.</p>
  </div>
</section>

<section class="section section--tight wrap">
  <div data-reveal style="margin-bottom:clamp(28px,4vw,40px)">
    <p class="eyebrow">Palmarès</p>
    <h2 class="h2">Prix et distinctions</h2>
  </div>
  <div class="eawards" data-stagger>
    <div class="eaward eaward--feature">
      <div class="eaward__text">
        <b>Performance de l’année — Top Versos 2021</b>
        <span>Face à Rotka, sur la scène du média hip-hop Top Versos.</span>
      </div>
      <img src="assets/img/page-battle-3.jpg" alt="Affiche « Top Versos 2021, performance de l’année » avec Esope en contre-jour devant des feux d’artifice" loading="lazy">
    </div>${PALMARES.map((nom, i) => `
    <div class="eaward">
      <span class="eaward__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="${ICONES[i]}"/></svg></span>
      <b>${ech(nom)}</b>
    </div>`).join('')}
  </div>
</section>

<section class="section wrap">
  <div class="emanifeste-intro" data-reveal>
    <p class="eyebrow">Les valeurs</p>
    <h2 class="h2">Créer un espace bienveillant qui permet aux jeunes de s’exprimer en toute liberté</h2>
    <p class="lead" style="margin-top:20px">Très souvent, mes ateliers se déroulent dans une classe
      qui n'a jamais pratiqué l'écriture poétique. Pour beaucoup, réussir à écrire un texte de slam
      n'est même pas envisageable. L'ambition est une construction sociale, elle est liée à notre
      culture. La bonne nouvelle, c'est que si c'est culturel, c'est quelque chose qu'on peut
      apprendre, former et construire.</p>
  </div>
  <div class="evalues" data-stagger>${VALEURS.map(([titre, texte], i) => `
    <div class="evalue evalue--${i}">
      <div class="evalue__glow" aria-hidden="true"></div>
      <span class="evalue__n" aria-hidden="true">0${i + 1}</span>
      <div><b>${ech(titre)}</b><span>${ech(texte)}</span></div>
    </div>`).join('')}
  </div>
</section>

<section class="section section--tight wrap">
  <div data-reveal style="margin-bottom:clamp(24px,4vw,36px)">
    <p class="eyebrow">En vidéo</p>
    <h2 class="h2">Le voir en action</h2>
  </div>
  <div class="evideos" data-stagger>${VIDEOS.map(video).join('')}
  </div>
</section>

<section class="section section--tight wrap">
  <div data-reveal style="margin-bottom:clamp(24px,4vw,36px)">
    <p class="eyebrow">En images</p>
    <h2 class="h2">Sur le terrain</h2>
  </div>
  <div class="egallery" data-stagger>${GALERIE.map(([src, alt]) => `
    <figure><img src="${src}" alt="${ech(alt)}" loading="lazy"></figure>`).join('')}
  </div>
</section>

<section class="section ecta wrap">
  <div data-reveal>
    <h2 class="h2">Redonnez-leur l’envie des mots</h2>
    <p class="lead" style="margin-top:20px;max-width:52ch;margin-inline:auto">Décrivez-moi votre
      contexte, je réponds avec une proposition adaptée.</p>
    <div class="btn-row btn-row--center" style="margin-top:32px">
      <a class="btn btn--accent" href="index.html#contact">Construire votre projet</a>
      <a class="btn btn--ghost" href="assets/docs/dossier-esope.pdf" download>Télécharger le dossier</a>
    </div>
    <p class="ecta__note"><a href="index.html">← Retour au site</a></p>
  </div>
</section>

<footer class="efooter wrap">
  <div class="efooter__inner">
    <span class="efooter__logo">Esope</span>
    <p class="efooter__meta">
      <a href="mailto:slampoetrip@gmail.com">slampoetrip@gmail.com</a> · Disponible dans toute la France
    </p>
  </div>
</footer>

<script>
(function () {
  var els = document.querySelectorAll('[data-reveal], [data-stagger]');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (el) { io.observe(el); });

  document.querySelectorAll('[data-play-video]').forEach(function (bouton) {
    bouton.addEventListener('click', function () {
      var carte = bouton.closest('.evideo');
      var lecteur = carte.querySelector('video');
      carte.classList.add('is-playing');
      lecteur.controls = true;
      lecteur.play();
    });
  });
})();
</script>
</body>
</html>
`;

writeFileSync(join(root, 'esope.html'), html);
console.log('→ esope.html (test, noindex, non relié au reste du site)');
