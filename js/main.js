/* ============================================
   KAMSI OKORO — Portfolio
   Main JavaScript — GSAP 3.12.5 + ScrollTrigger
   ============================================ */

(function () {
  'use strict';

  // ── Utility ──────────────────────────────────────────────
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function gsapReady() {
    return typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  }

  // ── 1. DOM READY ─────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    if (gsapReady()) {
      gsap.config({ force3D: true });
      gsap.registerPlugin(ScrollTrigger);
    }

    initNavigation();
    initAccessibility();
    initExperienceTimer();
    initContactModal();

    if (prefersReducedMotion) {
      revealAllImmediately();
    } else {
      initHeroAnimations();
      initScrollAnimations();
      initParallax();
      initDisciplineHovers();
      initMagneticButtons();
      initSmoothScrollIndicator(false);
    }
  });

  // ── Show everything for reduced-motion users ─────────────
  function revealAllImmediately() {
    document.querySelectorAll('.name-word, .role-line, .hero-tagline, .hero-btn, .hero-scroll').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });

    initScrollAnimations();
    initParallax();
    initDisciplineHovers();
    initMagneticButtons();
    initSmoothScrollIndicator(true);
  }

  // ── 2. NAVIGATION ────────────────────────────────────────
  function initNavigation() {
    const nav = document.querySelector('nav.nav');
    if (!nav) return;

    // Scroll class
    const onScroll = () => {
      if (window.scrollY > 80) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Hamburger
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('.mobile-menu-link') : [];

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';

        if (isOpen && !prefersReducedMotion && gsapReady()) {
          gsap.from(mobileLinks, {
            y: 60,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.15,
          });
        }
      });

      mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ── 3. HERO ANIMATIONS ───────────────────────────────────
  function initHeroAnimations() {
    if (prefersReducedMotion || !gsapReady()) return;

    const nameWords = document.querySelectorAll('.hero-name .name-word');
    const roleLines = document.querySelectorAll('.role-line');
    const tagline = document.querySelector('.hero-tagline');
    const heroBtn = document.querySelector('.hero-btn');
    const scrollIndicator = document.querySelector('.hero-scroll');

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.from(nameWords, {
      yPercent: 110,
      duration: 1,
      stagger: 0.1,
    });

    tl.from(roleLines, {
      y: 16,
      opacity: 0,
      duration: 0.6,
      stagger: 0.06,
    }, '-=0.4');

    if (tagline) {
      tl.from(tagline, {
        y: 16,
        opacity: 0,
        duration: 0.6,
      }, '-=0.25');
    }

    if (heroBtn) {
      tl.from(heroBtn, {
        y: 16,
        opacity: 0,
        duration: 0.5,
      }, '-=0.3');
    }

    if (scrollIndicator) {
      tl.from(scrollIndicator, {
        opacity: 0,
        duration: 0.6,
      }, '-=0.25');
    }
  }

  // ── 4. SCROLL ANIMATIONS (ScrollTrigger) ─────────────────
  function initScrollAnimations() {
    if (prefersReducedMotion || !gsapReady()) return;

    // Intro label & text
    gsap.utils.toArray('.intro-label').forEach((el) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      });
    });

    gsap.utils.toArray('.intro-text p').forEach((p) => {
      gsap.from(p, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: p, start: 'top 85%', toggleActions: 'play none none none' },
      });
    });

    // Intro visual parallax
    const introVisual = document.querySelector('.intro-visual');
    if (introVisual) {
      gsap.from(introVisual, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: introVisual, start: 'top 90%', toggleActions: 'play none none none' },
      });
    }

    // Discipline items
    const disciplineItems = gsap.utils.toArray('.discipline-item');
    disciplineItems.forEach((item, i) => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' },
      });

      tl.from(item, { x: -60, opacity: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.1 });

      const number = item.querySelector('.discipline-number');
      const name = item.querySelector('.discipline-name');
      const desc = item.querySelector('.discipline-desc');

      if (number) tl.from(number, { opacity: 0, duration: 0.4, ease: 'power2.out' }, '-=0.3');
      if (name) tl.from(name, { opacity: 0, x: 20, duration: 0.4, ease: 'power2.out' }, '-=0.25');
      if (desc) tl.from(desc, { opacity: 0, x: 20, duration: 0.4, ease: 'power2.out' }, '-=0.2');
    });

    // Selected work section header
    const workHeader = document.querySelector('.selected-work .section-header');
    if (workHeader) {
      gsap.from(workHeader, {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: workHeader, start: 'top 85%', toggleActions: 'play none none none' },
      });
    }

    // Featured collage
    gsap.utils.toArray('.collage-tile').forEach((tile) => {
      gsap.from(tile, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: tile, start: 'top 88%', toggleActions: 'play none none none' },
      });
    });

    // Experience counter
    gsap.utils.toArray('.cred-timer').forEach((item) => {
      gsap.from(item, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none none' },
      });
    });

    // CTA section
    const ctaHeading = document.querySelector('.cta-heading');
    const ctaLink = document.querySelector('.cta-link');
    if (ctaHeading) {
      gsap.from(ctaHeading, {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: ctaHeading, start: 'top 85%', toggleActions: 'play none none none' },
      });
    }
    if (ctaLink) {
      gsap.from(ctaLink, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
        scrollTrigger: { trigger: ctaLink, start: 'top 90%', toggleActions: 'play none none none' },
      });
    }
  }

  // ── 5. PARALLAX EFFECTS ──────────────────────────────────
  function initParallax() {
    if (prefersReducedMotion || !gsapReady()) return;

    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 50;
      gsap.to(el, {
        y: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });
  }

  // ── 6. DISCIPLINE HOVER EFFECTS ──────────────────────────
  function initDisciplineHovers() {
    if (isTouchDevice || prefersReducedMotion) return;

    document.querySelectorAll('.discipline-item').forEach((item) => {
      const number = item.querySelector('.discipline-number');

      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          backgroundColor: 'var(--clr-bg-lighter)',
          duration: 0.35,
          ease: 'power2.out',
        });
        if (number) {
          gsap.to(number, { scale: 1.1, duration: 0.3, ease: 'power2.out' });
        }
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          backgroundColor: 'transparent',
          duration: 0.35,
          ease: 'power2.out',
        });
        if (number) {
          gsap.to(number, { scale: 1, duration: 0.3, ease: 'power2.out' });
        }
      });
    });
  }

  // ── 7. MAGNETIC BUTTON EFFECT ───────────────────────────
  function initMagneticButtons() {
    if (isTouchDevice || prefersReducedMotion || !gsapReady()) return;

    const magneticElements = document.querySelectorAll('.cta-link');

    magneticElements.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(el, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)',
        });
      });
    });
  }

  // ── 8. SMOOTH SCROLL INDICATOR ──────────────────────────
  function initSmoothScrollIndicator(revealInstantly) {
    if (prefersReducedMotion) return;

    const scrollIndicator = document.querySelector('.hero-scroll');
    if (!scrollIndicator) return;

    const line = scrollIndicator.querySelector('.scroll-line');
    if (!line || !gsapReady()) return;

    if (revealInstantly) {
      gsap.set(scrollIndicator, { opacity: 1 });
    }

    if (!revealInstantly) {
      gsap.to(line, {
        scaleY: 1,
        duration: 0.8,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
        transformOrigin: 'top center',
      });

      gsap.to(scrollIndicator, {
        opacity: 0,
        scrollTrigger: {
          trigger: document.body,
          start: '100px top',
          toggleActions: 'play none none reverse',
        },
      });
    }
  }

  // ── 9. ACCESSIBILITY ─────────────────────────────────────
  function initAccessibility() {
    // Mark decorative elements as aria-hidden (reinforce HTML attributes via JS)
    document.querySelectorAll('.hero-visual, .scroll-line').forEach((el) => {
      el.setAttribute('aria-hidden', 'true');
    });

    // Ensure all interactive elements have visible focus styles
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') document.body.classList.add('using-keyboard');
    });
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('using-keyboard');
    });
  }

  // ── 10. EXPERIENCE TIMER ────────────────────────────────
  function initExperienceTimer() {
    const els = {
      years: document.getElementById('timerYears'),
      months: document.getElementById('timerMonths'),
      days: document.getElementById('timerDays'),
      hours: document.getElementById('timerHours'),
      minutes: document.getElementById('timerMinutes'),
      seconds: document.getElementById('timerSeconds'),
    };
    if (!els.years) return;

    const startDate = new Date(2023, 2, 11);

    function pad(n) {
      return String(n).padStart(2, '0');
    }

    function tick() {
      const now = new Date();
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();
      let hours = now.getHours() - startDate.getHours();
      let minutes = now.getMinutes() - startDate.getMinutes();
      let seconds = now.getSeconds() - startDate.getSeconds();

      if (seconds < 0) {
        seconds += 60;
        minutes -= 1;
      }
      if (minutes < 0) {
        minutes += 60;
        hours -= 1;
      }
      if (hours < 0) {
        hours += 24;
        days -= 1;
      }
      if (days < 0) {
        const prevMonthIdx = (now.getMonth() - 1 + 12) % 12;
        const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        days += new Date(prevYear, prevMonthIdx + 1, 0).getDate();
        months -= 1;
      }
      if (months < 0) {
        months += 12;
        years -= 1;
      }

      if (els.years) els.years.textContent = pad(years);
      if (els.months) els.months.textContent = pad(months);
      if (els.days) els.days.textContent = pad(days);
      if (els.hours) els.hours.textContent = pad(hours);
      if (els.minutes) els.minutes.textContent = pad(minutes);
      if (els.seconds) els.seconds.textContent = pad(seconds);
    }

    tick();
    setInterval(tick, 1000);
  }

  // ── 11. CONTACT MODAL ─────────────────────────────────
  function initContactModal() {
    const modal = document.getElementById('contactModal');
    if (!modal) return;

    const backdrop = modal.querySelector('.contact-modal-backdrop');
    const closeBtn = modal.querySelector('.contact-modal-close');
    const panel = modal.querySelector('.contact-modal-panel');
    const triggers = document.querySelectorAll('[data-contact-open]');

    function openModal(e) {
      if (e) e.preventDefault();
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (gsapReady() && !prefersReducedMotion && panel) {
        gsap.fromTo(panel, { scale: 0.94, opacity: 0, y: 16 }, { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' });
        gsap.fromTo(modal.querySelectorAll('.contact-item'), { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.3, delay: 0.05, ease: 'power2.out' });
      }

      if (closeBtn) window.setTimeout(() => closeBtn.focus(), 350);
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    triggers.forEach((trigger) => trigger.addEventListener('click', openModal));

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
        const opener = document.querySelector('[data-contact-open]');
        if (opener) opener.focus();
      }
    });
  }

  // ── 12. PERFORMANCE CLEANUP ──────────────────────────────
  window.addEventListener('beforeunload', () => {
    if (gsapReady()) {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf('*');
    }
  });

})();
