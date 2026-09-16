/* ==========================================================================
   Poetrip — Ateliers Slam
   Interactions : header, méga menu, tiroir mobile, révélations, compteurs,
   cercle au feutre, carrousel de témoignages, machine à consignes, chrono,
   filtres d'agenda, FAQ, formulaire. Aucune dépendance.
   ========================================================================== */

(function () {
  'use strict';

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = motionQuery.matches;
  motionQuery.addEventListener('change', function (e) { reduced = e.matches; });

  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ----------------------------------------------------------------------
     Méga menu « Les ateliers » (ordinateur)
     ---------------------------------------------------------------------- */

  var megaWrap = $('[data-mega]');
  var megaTrigger = $('#megaTrigger');
  var megaPanel = $('#megaAteliers');
  var megaTimer = null;

  function openMega() {
    if (!megaWrap) return;
    clearTimeout(megaTimer);
    megaWrap.classList.add('is-open');
    megaTrigger.setAttribute('aria-expanded', 'true');
  }

  function closeMega(immediate) {
    if (!megaWrap) return;
    clearTimeout(megaTimer);
    var apply = function () {
      megaWrap.classList.remove('is-open');
      megaTrigger.setAttribute('aria-expanded', 'false');
    };
    if (immediate) apply();
    else megaTimer = setTimeout(apply, 180);
  }

  if (megaWrap && megaTrigger) {
    // Survol réservé aux pointeurs fins : sur écran tactile, un appui déclenche
    // mouseenter puis click, ce qui ouvrirait et refermerait aussitôt.
    if (finePointer.matches) {
      megaWrap.addEventListener('mouseenter', openMega);
      megaWrap.addEventListener('mouseleave', function () { closeMega(); });
    }

    megaTrigger.addEventListener('click', function () {
      if (megaWrap.classList.contains('is-open')) closeMega(true);
      else openMega();
    });

    // Un focus arrivant DANS le panneau le maintient ouvert ; un focus sur le
    // déclencheur ne l'ouvre pas, sinon Échap refermerait puis rouvrirait.
    megaWrap.addEventListener('focusin', function (e) {
      if (megaPanel && megaPanel.contains(e.target)) openMega();
    });
    megaWrap.addEventListener('focusout', function (e) {
      if (!megaWrap.contains(e.relatedTarget)) closeMega(true);
    });

    $$('a', megaWrap).forEach(function (a) {
      a.addEventListener('click', function () { closeMega(true); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !megaWrap.classList.contains('is-open')) return;
      closeMega(true);
      megaTrigger.focus();
    });

    document.addEventListener('click', function (e) {
      if (!megaWrap.contains(e.target)) closeMega(true);
    });
  }

  /* ----------------------------------------------------------------------
     Tiroir mobile
     ---------------------------------------------------------------------- */

  var burger = $('#burger');
  var drawer = $('#drawer');
  var drawerAteliers = $('#drawerAteliers');

  function closeDrawer() {
    if (!burger || !drawer) return;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    drawer.classList.remove('is-open');
  }

  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      if (open) return closeDrawer();
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Fermer le menu');
      drawer.classList.add('is-open');
    });

    $$('a', drawer).forEach(function (a) { a.addEventListener('click', closeDrawer); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });
  }

  if (drawerAteliers) {
    drawerAteliers.addEventListener('click', function () {
      var open = drawerAteliers.getAttribute('aria-expanded') === 'true';
      drawerAteliers.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  }

  /* ----------------------------------------------------------------------
     Révélations au scroll
     ---------------------------------------------------------------------- */

  var revealTargets = $$('[data-reveal], [data-stagger]');

  if (!('IntersectionObserver' in window) || reduced) {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.hasAttribute('data-stagger')) {
          Array.prototype.forEach.call(el.children, function (child, i) {
            child.style.transitionDelay = Math.min(i * 90, 540) + 'ms';
          });
        }
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ----------------------------------------------------------------------
     Cercle tracé au feutre autour du titre
     ---------------------------------------------------------------------- */

  var circles = $$('[data-circled]');
  if (circles.length) {
    var circleObserver = ('IntersectionObserver' in window) && !reduced
      ? new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            circleObserver.unobserve(entry.target);
          });
        }, { threshold: 0.6 })
      : null;

    circles.forEach(function (circled) {
      var strokePath = $('path.is-draw', circled);
      if (strokePath && typeof strokePath.getTotalLength === 'function') {
        circled.style.setProperty('--len', strokePath.getTotalLength());
      }
      if (circleObserver) circleObserver.observe(circled);
      else circled.classList.add('is-visible');
    });
  }

  /* ----------------------------------------------------------------------
     Compteurs
     ---------------------------------------------------------------------- */

  function formatNumber(value, mode) {
    if (mode === 'space') return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return String(value);
  }

  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var mode = el.getAttribute('data-format');
    if (reduced) { el.textContent = formatNumber(target, mode); return; }

    var duration = 1700;
    var start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      el.textContent = formatNumber(Math.round(target * (1 - Math.pow(1 - t, 3))), mode);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var stat = entry.target.closest('.stat');
        if (stat) stat.classList.add('is-counting');
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ----------------------------------------------------------------------
     Carrousel de témoignages
     ---------------------------------------------------------------------- */

  var carousel = $('#carousel');
  var dotsBox = $('#dots');

  if (carousel && dotsBox) {
    var slides = $$('.quote', carousel);

    slides.forEach(function (slide, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Témoignage ' + (i + 1) + ' sur ' + slides.length);
      dot.addEventListener('click', function () {
        // Les vignettes sont centrées (scroll-snap-align: center) : viser leur
        // bord gauche ferait accrocher la vignette suivante.
        var left = slide.offsetLeft - carousel.offsetLeft
          - (carousel.clientWidth - slide.offsetWidth) / 2;
        carousel.scrollTo({ left: left, behavior: reduced ? 'auto' : 'smooth' });
      });
      dotsBox.appendChild(dot);
    });

    var dots = $$('button', dotsBox);

    function syncDots() {
      var max = carousel.scrollWidth - carousel.clientWidth;
      var best;

      if (carousel.scrollLeft <= 1) {
        // En butée, la première et la dernière vignette ne peuvent pas être
        // centrées : le plus proche du centre désignerait leur voisine.
        best = 0;
      } else if (carousel.scrollLeft >= max - 1) {
        best = slides.length - 1;
      } else {
        var mid = carousel.scrollLeft + carousel.clientWidth / 2;
        var bestGap = Infinity;
        best = 0;
        slides.forEach(function (slide, i) {
          var center = slide.offsetLeft - carousel.offsetLeft + slide.offsetWidth / 2;
          var gap = Math.abs(center - mid);
          if (gap < bestGap) { bestGap = gap; best = i; }
        });
      }
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === best);
        dot.setAttribute('aria-selected', i === best ? 'true' : 'false');
      });
    }

    var scrollTick = false;
    carousel.addEventListener('scroll', function () {
      if (scrollTick) return;
      scrollTick = true;
      requestAnimationFrame(function () { syncDots(); scrollTick = false; });
    }, { passive: true });

    window.addEventListener('resize', syncDots, { passive: true });
    syncDots();
  }

  /* ----------------------------------------------------------------------
     Machine à consignes
     ---------------------------------------------------------------------- */

  var OBJETS = [
    'une clé', 'un trajet de bus', 'une porte qui grince', 'le mot de ta grand-mère',
    'un carton jamais ouvert', 'la cour de récré', 'un numéro que tu ne composes plus',
    'une chaise vide', 'le dernier train', 'un prénom mal prononcé', 'une photo floue',
    'la cuisine à 6 h du matin', 'un manteau trop grand', 'une ville traversée sans t’arrêter'
  ];

  var CONTRAINTES = [
    'sans le mot « je »', 'en commençant chaque phrase par « peut-être »',
    'en dix lignes maximum', 'sans aucun adjectif', 'avec une question à la fin de chaque strophe',
    'en t’adressant à quelqu’un qui ne répondra pas', 'au présent uniquement',
    'en répétant trois fois la même phrase', 'sans jamais nommer le sujet',
    'en finissant par le mot qui t’a fait commencer'
  ];

  var COULEURS = [
    'en confidence', 'à voix basse', 'comme une colère polie', 'avec de l’humour malgré tout',
    'comme un aveu', 'sur un rythme rapide', 'comme si vous aviez dix ans',
    'avec beaucoup de silences', 'comme un remerciement', 'comme une lettre qu’on n’enverra pas'
  ];

  var dials = { objet: $('#dial-objet'), contrainte: $('#dial-contrainte'), emotion: $('#dial-emotion') };
  var machinePrompt = $('#machinePrompt');
  var rollBtn = $('#rollBtn');
  var copyBtn = $('#copyBtn');
  var current = { objet: OBJETS[0], contrainte: CONTRAINTES[0], emotion: COULEURS[0] };

  function pick(list, avoid) {
    if (list.length < 2) return list[0];
    var value = avoid;
    while (value === avoid) value = list[Math.floor(Math.random() * list.length)];
    return value;
  }

  function promptText() {
    return 'Écrivez sur ' + current.objet + ', ' + current.contrainte + ', ' + current.emotion +
      '. Sept minutes, sans vous relire.';
  }

  function renderPrompt() {
    if (!machinePrompt) return;
    machinePrompt.innerHTML = 'Écrivez sur <b>' + current.objet + '</b>, <b>' + current.contrainte +
      '</b>, <b>' + current.emotion + '</b>. Sept minutes, sans vous relire.';
  }

  function setDial(key, value) {
    current[key] = value;
    var dial = dials[key];
    if (!dial) return;
    var valueEl = $('[data-dial-value]', dial);
    if (valueEl) valueEl.textContent = value;
    dial.classList.remove('is-rolling');
    void dial.offsetWidth;
    dial.classList.add('is-rolling');
  }

  function roll() {
    [['objet', pick(OBJETS, current.objet)],
     ['contrainte', pick(CONTRAINTES, current.contrainte)],
     ['emotion', pick(COULEURS, current.emotion)]
    ].forEach(function (entry, i) {
      var apply = function () { setDial(entry[0], entry[1]); };
      if (reduced) apply(); else setTimeout(apply, i * 130);
    });
    if (reduced) renderPrompt(); else setTimeout(renderPrompt, 420);
  }

  if (rollBtn) rollBtn.addEventListener('click', roll);

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var done = function () {
        var label = copyBtn.innerHTML;
        copyBtn.innerHTML = 'Copié <span class="arrow" aria-hidden="true">✓</span>';
        setTimeout(function () { copyBtn.innerHTML = label; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(promptText()).then(done).catch(done);
      } else done();
    });
  }

  /* ----------------------------------------------------------------------
     Chrono de scène
     ---------------------------------------------------------------------- */

  var TOTAL = 180;
  var timerEl = $('#timer');
  var timerDisplay = $('#timerDisplay');
  var timerBar = $('#timerBar');
  var timerToggle = $('#timerToggle');
  var timerReset = $('#timerReset');
  var remaining = TOTAL;
  var timerId = null;

  function renderTimer() {
    if (!timerDisplay) return;
    var m = Math.floor(remaining / 60), s = remaining % 60;
    timerDisplay.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    if (timerBar) timerBar.style.transform = 'scaleX(' + (remaining / TOTAL) + ')';
    if (timerEl) timerEl.classList.toggle('is-over', remaining === 0);
  }

  function stopTimer() {
    if (timerId) { clearInterval(timerId); timerId = null; }
    if (timerToggle) timerToggle.textContent = remaining === 0 ? 'Terminé' : 'Reprendre';
  }

  function startTimer() {
    if (timerId || remaining === 0) return;
    if (timerToggle) timerToggle.textContent = 'Pause';
    if (timerDisplay) timerDisplay.setAttribute('aria-live', 'off');
    timerId = setInterval(function () {
      remaining = Math.max(remaining - 1, 0);
      renderTimer();
      if (remaining === 0) {
        stopTimer();
        if (timerDisplay) {
          timerDisplay.setAttribute('aria-live', 'polite');
          timerDisplay.textContent = '00:00';
        }
      }
    }, 1000);
  }

  if (timerToggle) timerToggle.addEventListener('click', function () { timerId ? stopTimer() : startTimer(); });
  if (timerReset) {
    timerReset.addEventListener('click', function () {
      stopTimer();
      remaining = TOTAL;
      renderTimer();
      if (timerToggle) timerToggle.textContent = 'Démarrer';
    });
  }
  renderTimer();

  /* ----------------------------------------------------------------------
     Agenda : fenêtre ouverte depuis le menu uniquement
     ---------------------------------------------------------------------- */

  function wireSheet(dialogId, closeId, triggerAttr) {
    var dialog = $('#' + dialogId);
    if (!dialog) return;

    function open() {
      closeDrawer();
      closeMega(true);
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');   // navigateurs sans <dialog>
      document.body.classList.add('is-locked');
    }

    function close() {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }

    $$('[' + triggerAttr + ']').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        open();
      });
    });

    var closeBtn = $('#' + closeId);
    if (closeBtn) closeBtn.addEventListener('click', close);

    // Un lien interne depuis la fenêtre doit la refermer avant de défiler.
    $$('a[href^="#"]', dialog).forEach(function (link) {
      link.addEventListener('click', close);
    });

    // Le verrou de défilement se lève quoi qu'il arrive : bouton, Échap ou clic
    // sur le fond, tous passent par l'événement close.
    dialog.addEventListener('close', function () {
      document.body.classList.remove('is-locked');
    });

    // Clic sur le fond : la cible est le dialog lui-même, pas son contenu.
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) close();
    });
  }

  wireSheet('agendaDialog', 'agendaClose', 'data-agenda');
  wireSheet('bioDialog', 'bioClose', 'data-bio');

  /* ----------------------------------------------------------------------
     FAQ
     ---------------------------------------------------------------------- */

  $$('.faq__q').forEach(function (button) {
    button.addEventListener('click', function () {
      var item = button.closest('.faq__item');
      var open = button.getAttribute('aria-expanded') === 'true';
      $$('.faq__item').forEach(function (other) {
        if (other === item) return;
        other.classList.remove('is-open');
        var otherBtn = $('.faq__q', other);
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });
      button.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (item) item.classList.toggle('is-open', !open);
    });
  });

  /* ----------------------------------------------------------------------
     Formulaire
     ---------------------------------------------------------------------- */

  var form = $('#bookingForm');
  var formStatus = $('#formStatus');

  function showError(field, show) {
    var wrapper = field.closest('.field');
    var message = $('[data-error-for="' + field.id + '"]');
    if (wrapper) wrapper.classList.toggle('field--error', show);
    if (message) message.hidden = !show;
  }

  if (form) {
    $$('input, select, textarea', form).forEach(function (field) {
      field.addEventListener('input', function () {
        if (field.value.trim()) showError(field, false);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstInvalid = null;

      $$('[required]', form).forEach(function (field) {
        var value = field.value.trim();
        var invalid = !value;
        if (!invalid && field.type === 'email') invalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        showError(field, invalid);
        if (invalid && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        if (formStatus) {
          formStatus.hidden = false;
          formStatus.textContent = 'Il manque encore quelques informations avant d’envoyer.';
        }
        return;
      }

      var data = new FormData(form);
      var subject = 'Demande d’atelier — ' + (data.get('format') || 'à définir');
      var body = [
        'Nom : ' + data.get('nom'),
        'E-mail : ' + data.get('email'),
        'Structure : ' + (data.get('structure') || 'non précisée'),
        'Atelier souhaité : ' + data.get('format'),
        '',
        'Contexte :',
        data.get('message')
      ].join('\n');

      if (formStatus) {
        formStatus.hidden = false;
        formStatus.textContent = 'Votre messagerie s’ouvre avec la demande pré-remplie. Si rien ne se passe, écrivez à slampoetrip@gmail.com.';
      }

      window.location.href = 'mailto:slampoetrip@gmail.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  /* ----------------------------------------------------------------------
     Année courante
     ---------------------------------------------------------------------- */

  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
