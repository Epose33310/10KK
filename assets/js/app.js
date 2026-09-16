/* ==========================================================================
   Poetrip — Ateliers Slam
   Interactions : révélations au scroll, parallaxe des blobs, compteurs,
   machine à consignes, chrono de scène, filtres d'agenda, FAQ, formulaire.
   Aucune dépendance. Tout se désactive proprement en « mouvement réduit ».
   ========================================================================== */

(function () {
  'use strict';

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = motionQuery.matches;
  motionQuery.addEventListener('change', function (e) { reduced = e.matches; });

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  /* ----------------------------------------------------------------------
     Barre de progression de lecture
     ---------------------------------------------------------------------- */

  var progress = $('#progress');

  function updateProgress() {
    if (!progress) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    progress.style.transform = 'scaleX(' + ratio + ')';
  }

  /* ----------------------------------------------------------------------
     Navigation : masquage au défilement, état actif, menu mobile
     ---------------------------------------------------------------------- */

  var nav = $('#nav');
  var lastY = window.scrollY;

  function updateNav() {
    if (!nav) return;
    var y = window.scrollY;
    nav.classList.toggle('is-stuck', y > 8);

    var mobileOpen = navMobile && navMobile.classList.contains('is-open');
    if (!mobileOpen && y > 240 && y > lastY + 4) {
      nav.classList.add('is-hidden');
    } else if (y < lastY - 4 || y <= 240) {
      nav.classList.remove('is-hidden');
    }
    lastY = y;
  }

  var navToggle = $('#navToggle');
  var navMobile = $('#navMobile');

  function closeMobileMenu() {
    if (!navToggle || !navMobile) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Ouvrir le menu');
    navMobile.classList.remove('is-open');
    document.body.classList.remove('is-locked');
  }

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      if (open) {
        closeMobileMenu();
      } else {
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Fermer le menu');
        navMobile.classList.add('is-open');
        nav.classList.remove('is-hidden');
      }
    });

    $$('a', navMobile).forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }

  // Lien de navigation actif selon la section visible
  var navLinks = $$('.nav__links .nav__link');
  var sectionTargets = navLinks
    .map(function (link) {
      var id = link.getAttribute('href');
      return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sectionTargets.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sectionTargets.forEach(function (section) { navObserver.observe(section); });
  }

  /* ----------------------------------------------------------------------
     Révélations au scroll (+ décalage en cascade)
     ---------------------------------------------------------------------- */

  var revealTargets = $$('[data-reveal], [data-reveal-stagger]');

  if (!('IntersectionObserver' in window) || reduced) {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;

        if (el.hasAttribute('data-reveal-stagger')) {
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
     Compteurs animés
     ---------------------------------------------------------------------- */

  function formatNumber(value, mode) {
    if (mode === 'space') return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return String(value);
  }

  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var mode = el.getAttribute('data-format');

    if (reduced) {
      el.textContent = formatNumber(target, mode);
      return;
    }

    var duration = 1400;
    var start = null;

    function tick(timestamp) {
      if (start === null) start = timestamp;
      var t = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formatNumber(Math.round(target * eased), mode);
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  var counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ----------------------------------------------------------------------
     Rotateur de mots dans le titre
     ---------------------------------------------------------------------- */

  var rotator = $('[data-rotator]');
  if (rotator && !reduced) {
    var words;
    try {
      words = JSON.parse(rotator.getAttribute('data-rotator'));
    } catch (err) {
      words = null;
    }

    if (Array.isArray(words) && words.length > 1) {
      var index = 0;
      setInterval(function () {
        index = (index + 1) % words.length;
        var span = document.createElement('span');
        span.textContent = words[index];
        rotator.replaceChildren(span);
      }, 2600);
    }
  }

  /* ----------------------------------------------------------------------
     Bandeau défilant : duplication pour une boucle sans couture
     ---------------------------------------------------------------------- */

  var marqueeTrack = $('[data-marquee]');
  if (marqueeTrack) {
    var original = marqueeTrack.innerHTML;
    marqueeTrack.innerHTML = original + original + original + original;
  }

  /* ----------------------------------------------------------------------
     Parallaxe des blobs (scroll + souris)
     ---------------------------------------------------------------------- */

  var parallaxBlobs = $$('[data-parallax-field] .blob[data-speed]');
  var pointer = { x: 0, y: 0 };

  var parallaxIdle = false;

  function updateParallax() {
    if (reduced) return;

    // Sous 720px, les blobs restent immobiles : ils sont réduits et discrets.
    if (window.innerWidth < 720) {
      if (parallaxIdle) return;
      parallaxIdle = true;
      parallaxBlobs.forEach(function (blob) { blob.style.transform = ''; });
      return;
    }
    parallaxIdle = false;

    var viewport = window.innerHeight;

    parallaxBlobs.forEach(function (blob) {
      var field = blob.parentElement;
      var rect = field.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > viewport + 200) return;

      var speed = parseFloat(blob.getAttribute('data-speed')) || 0.2;
      var offset = (viewport - rect.top) * speed;
      var driftX = pointer.x * speed * 26;
      var driftY = pointer.y * speed * 18;
      blob.style.transform =
        'translate3d(' + driftX.toFixed(1) + 'px, ' + (offset * -0.12 + driftY).toFixed(1) + 'px, 0)';
    });
  }

  if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', function (e) {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }

  /* ----------------------------------------------------------------------
     Boucle de scroll unique (rAF)
     ---------------------------------------------------------------------- */

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateProgress();
      updateNav();
      updateParallax();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  if (!reduced) {
    setInterval(function () {
      if (pointer.x || pointer.y) updateParallax();
    }, 120);
  }
  updateProgress();

  /* ----------------------------------------------------------------------
     Inclinaison légère des cartes produit
     ---------------------------------------------------------------------- */

  if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('[data-tilt]').forEach(function (card) {
      var base = card.style.transform || '';

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          'translateY(-10px) rotateX(' + (-y * 6).toFixed(2) + 'deg) rotateY(' + (x * 8).toFixed(2) + 'deg)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = base;
      });
    });
  }

  /* ----------------------------------------------------------------------
     Boutons magnétiques
     ---------------------------------------------------------------------- */

  if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('[data-magnetic]').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.18).toFixed(1) + 'px, ' + (y * 0.24).toFixed(1) + 'px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
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
    'comme un aveu', 'sur un rythme rapide', 'comme si tu avais dix ans',
    'avec beaucoup de silences', 'comme un remerciement', 'comme une lettre qu’on n’enverra pas'
  ];

  var dials = {
    objet: $('#dial-objet'),
    contrainte: $('#dial-contrainte'),
    emotion: $('#dial-emotion')
  };
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
    return 'Écris sur ' + current.objet + ', ' + current.contrainte + ', ' + current.emotion +
      '. Sept minutes, sans te relire.';
  }

  function renderPrompt() {
    if (!machinePrompt) return;
    machinePrompt.innerHTML =
      'Écris sur <b>' + current.objet + '</b>, <b>' + current.contrainte + '</b>, <b>' +
      current.emotion + '</b>. Sept minutes, sans te relire.';
  }

  function setDial(key, value) {
    current[key] = value;
    var dial = dials[key];
    if (!dial) return;
    var valueEl = $('[data-dial-value]', dial);
    if (valueEl) valueEl.textContent = value;
    dial.classList.remove('is-rolling');
    void dial.offsetWidth; // relance l'animation
    dial.classList.add('is-rolling');
  }

  function roll() {
    var sequence = [
      ['objet', pick(OBJETS, current.objet)],
      ['contrainte', pick(CONTRAINTES, current.contrainte)],
      ['emotion', pick(COULEURS, current.emotion)]
    ];

    sequence.forEach(function (entry, i) {
      var apply = function () { setDial(entry[0], entry[1]); };
      if (reduced) apply();
      else setTimeout(apply, i * 130);
    });

    var finish = function () { renderPrompt(); };
    if (reduced) finish();
    else setTimeout(finish, 420);
  }

  if (rollBtn) rollBtn.addEventListener('click', roll);

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var text = promptText();
      var done = function () {
        var label = copyBtn.innerHTML;
        copyBtn.innerHTML = 'Consigne copiée <span class="arrow" aria-hidden="true">✓</span>';
        setTimeout(function () { copyBtn.innerHTML = label; }, 2000);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else {
        done();
      }
    });
  }

  /* ----------------------------------------------------------------------
     Chrono de scène — trois minutes
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
    var m = Math.floor(remaining / 60);
    var s = remaining % 60;
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

  if (timerToggle) {
    timerToggle.addEventListener('click', function () {
      if (timerId) stopTimer();
      else startTimer();
    });
  }

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
     Filtres de l'agenda
     ---------------------------------------------------------------------- */

  var filters = $$('.filter');
  var events = $$('#agendaList .event');
  var agendaEmpty = $('#agendaEmpty');

  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.getAttribute('data-filter');
      filters.forEach(function (f) { f.classList.toggle('is-active', f === button); });

      var visible = 0;
      events.forEach(function (event) {
        var match = value === 'tous' || event.getAttribute('data-category') === value;
        event.classList.toggle('is-filtered-out', !match);
        if (match) visible += 1;
      });

      if (agendaEmpty) agendaEmpty.hidden = visible !== 0;
    });
  });

  /* ----------------------------------------------------------------------
     FAQ — accordéon
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
     Formulaire de réservation
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

      var required = $$('[required]', form);
      var firstInvalid = null;

      required.forEach(function (field) {
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
      var subject = 'Demande d’atelier slam — ' + (data.get('format') || 'format à définir');
      var body = [
        'Nom : ' + data.get('nom'),
        'E-mail : ' + data.get('email'),
        'Structure : ' + (data.get('structure') || 'non précisée'),
        'Format souhaité : ' + data.get('format'),
        '',
        'Contexte :',
        data.get('message')
      ].join('\n');

      if (formStatus) {
        formStatus.hidden = false;
        formStatus.textContent =
          'Votre messagerie s’ouvre avec la demande pré-remplie. Si rien ne se passe, écrivez directement à slampoetrip@gmail.com.';
      }

      window.location.href =
        'mailto:slampoetrip@gmail.com?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });
  }

  /* ----------------------------------------------------------------------
     Année courante dans le pied de page
     ---------------------------------------------------------------------- */

  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
