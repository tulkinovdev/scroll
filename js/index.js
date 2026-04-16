/* =============================================
   PRELOADER
   ============================================= */
(function () {
  'use strict';

  var preloader = document.getElementById('preloader');

  window.addEventListener('load', function () {
    setTimeout(function () {
      preloader.classList.add('hidden');
      triggerHeroReveal();
      // Remove preloader from DOM after transition
      setTimeout(function () {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 600);
    }, 1700);
  });

  /* =============================================
     HERO REVEAL (on page load)
     ============================================= */
  function triggerHeroReveal() {
    var heroEls = document.querySelectorAll('.reveal-hero');
    for (var i = 0; i < heroEls.length; i++) {
      heroEls[i].classList.add('visible');
    }
  }

  /* =============================================
     SCROLL PROGRESS BAR
     ============================================= */
  var scrollProgress = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
    scrollProgress.setAttribute('aria-valuenow', Math.round(progress));
  }

  /* =============================================
     NAVBAR — scroll-spy & sticky style
     ============================================= */
  var navbar = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('section[id]');

  function updateNavbar() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link (scroll-spy)
    var currentId = '';
    for (var i = 0; i < sections.length; i++) {
      var sectionTop = sections[i].offsetTop - (window.innerHeight / 3);
      if (scrollY >= sectionTop) {
        currentId = sections[i].id;
      }
    }

    for (var j = 0; j < navLinks.length; j++) {
      navLinks[j].classList.remove('active');
      if (navLinks[j].getAttribute('href') === '#' + currentId) {
        navLinks[j].classList.add('active');
      }
    }
  }

  /* =============================================
     MOBILE MENU
     ============================================= */
  var hamburger = document.getElementById('hamburger');
  var navLinksEl = document.getElementById('nav-links');
  var mobileOverlay = document.getElementById('mobile-overlay');

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
    navLinksEl.classList.add('open');
    mobileOverlay.classList.add('visible');
    mobileOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    navLinksEl.classList.remove('open');
    mobileOverlay.classList.remove('visible');
    mobileOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (hamburger.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileOverlay.addEventListener('click', closeMenu);

  // Close on nav link click (mobile)
  for (var k = 0; k < navLinks.length; k++) {
    navLinks[k].addEventListener('click', closeMenu);
  }

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* =============================================
     SMOOTH SCROLL for anchor links
     ============================================= */
  var anchors = document.querySelectorAll('a[href^="#"]');
  for (var a = 0; a < anchors.length; a++) {
    anchors[a].addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      var navH = 70;
      var style = getComputedStyle(document.documentElement);
      var navVal = parseInt(style.getPropertyValue('--nav-h'));
      if (navVal) navH = navVal;

      var targetPos = target.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop) - navH;

      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    });
  }

  /* =============================================
     REVEAL ON SCROLL — IntersectionObserver
     ============================================= */
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.classList.add('active');
          } else {
            entries[i].target.classList.remove('active');
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    var revealEls = document.querySelectorAll('.reveal');
    for (var r = 0; r < revealEls.length; r++) {
      revealObserver.observe(revealEls[r]);
    }
  } else {
    // Fallback: show all
    var fallbackEls = document.querySelectorAll('.reveal');
    for (var f = 0; f < fallbackEls.length; f++) {
      fallbackEls[f].classList.add('active');
    }
  }

  /* =============================================
     BACK TO TOP BUTTON
     ============================================= */
  var backToTop = document.getElementById('back-to-top');

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =============================================
     CARD — subtle tilt on mousemove (desktop only)
     ============================================= */
  function applyCardTilt() {
    if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
      var cards = document.querySelectorAll('.text-card');
      for (var c = 0; c < cards.length; c++) {
        (function (card) {
          card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width - 0.5;
            var y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = 'translateY(-8px) rotateX(' + (-y * 5).toFixed(2) + 'deg) rotateY(' + (x * 5).toFixed(2) + 'deg)';
          });

          card.addEventListener('mouseleave', function () {
            card.style.transform = '';
          });
        })(cards[c]);
      }
    }
  }

  applyCardTilt();

  /* =============================================
     SCROLL HANDLER — single rAF-throttled listener
     ============================================= */
  var ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateScrollProgress();
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Run once on init
  updateScrollProgress();
  updateNavbar();

})();
