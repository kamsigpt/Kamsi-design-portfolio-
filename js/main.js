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
      initWorkFiltering();
      initProjectOverlay();
      initMagneticButtons();
      initTextScramble();
      initSmoothScrollIndicator(false);
    }
  });

  // ── Show everything for reduced-motion users ─────────────
  function revealAllImmediately() {
    document.querySelectorAll('.name-word, .role-line, .hero-tagline, .hero-btn, .hero-scroll').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });

    document.querySelectorAll('.work-item-image').forEach((el) => {
      el.style.transform = 'scaleY(1)';
    });

    initScrollAnimations();
    initParallax();
    initDisciplineHovers();
    initWorkFiltering();
    initProjectOverlay();
    initMagneticButtons();
    initTextScramble();
    initSmoothScrollIndicator(true);
  }

  // ── 4. NAVIGATION ────────────────────────────────────────
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

  // ── 5. HERO ANIMATIONS ───────────────────────────────────
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

  // ── 6. SCROLL ANIMATIONS (ScrollTrigger) ─────────────────
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

    // Work items
    gsap.utils.toArray('.work-item').forEach((item, i) => {
      const isLarge = item.classList.contains('size-large');
      const isFull = item.classList.contains('size-full');

      gsap.from(item, {
        y: isLarge || isFull ? 80 : 50,
        opacity: 0,
        scale: isFull ? 0.96 : 0.98,
        duration: isFull ? 1.2 : 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' },
      });
    });

    // Featured designs blocks
    gsap.utils.toArray('.featured-block').forEach((block) => {
      gsap.from(block, {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: block, start: 'top 85%', toggleActions: 'play none none none' },
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

  // ── 7. IMAGE REVEAL EFFECTS ──────────────────────────────
  function initImageReveals() {
    if (prefersReducedMotion || !gsapReady()) return;

    gsap.utils.toArray('.work-item-image').forEach((img) => {
      gsap.from(img, {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: img, start: 'top 85%', toggleActions: 'play none none none' },
      });
    });
  }

  // ── 8. PARALLAX EFFECTS ──────────────────────────────────
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

    initImageReveals();
  }

  // ── 9. DISCIPLINE HOVER EFFECTS ──────────────────────────
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

  // ── 10. WORK PAGE FILTERING ──────────────────────────────
  function initWorkFiltering() {
    const filtersContainer = document.querySelector('.filters');
    if (!filtersContainer || !gsapReady()) return;

    const buttons = filtersContainer.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter.toUpperCase();

        workItems.forEach((item) => {
          const category = (item.dataset.category || '').toUpperCase();
          const shouldShow = filter === 'ALL' || category.includes(filter);

          if (shouldShow) {
            gsap.to(item, {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: 'power2.out',
              onStart: () => { item.style.display = ''; },
            });
          } else {
            gsap.to(item, {
              opacity: 0,
              scale: 0.95,
              duration: 0.3,
              ease: 'power2.in',
              onComplete: () => { item.style.display = 'none'; },
            });
          }
        });
      });
    });
  }

  // ── 11. PROJECT OVERLAY / MODAL ──────────────────────────
  const projectData = {
    FORGE: {
      category: 'Graphic Design · Motion',
      year: '2024',
      role: 'Lead Designer & Motion Artist',
      challenge: 'FORGE needed a visual identity that communicated strength, precision and modernity — a brand that could sit comfortably in both digital and physical spaces without losing its edge.',
      direction: 'I developed a mark built from sharp geometric forms, paired with a type system that balances weight and openness. The color palette anchors on deep navy with warm metallic accents.',
      execution: 'The identity rolled out across stationery, digital templates and an animated logo reveal. Motion pieces followed the same structural logic — elements building and locking into place with deliberate rhythm.',
      result: 'FORGE now has a cohesive identity that scales from social avatars to large-format print, with motion assets ready for any screen.',
    },
    DRIFT: {
      category: 'Branding · Graphic Design',
      year: '2024',
      role: 'Brand Designer',
      challenge: 'DRIFT required a brand system that felt fluid and adaptive while maintaining visual coherence across a wide range of touchpoints.',
      direction: 'I built a flexible identity around organic shapes and a gradient-driven palette. Typography stays clean and functional, letting the color and form do the expressive work.',
      execution: 'The system was applied across print collateral, social media templates and a set of animated transitions that mirror the brand\'s flowing character.',
      result: 'A modular identity that adapts without breaking — DRIFT\'s visual language holds together whether it\'s a business card or an Instagram story.',
    },
    PULSE: {
      category: 'Motion Design',
      year: '2023',
      role: 'Motion Designer',
      challenge: 'PULSE needed an animated piece that captured energy and rhythm — something that moved with purpose and grabbed attention in under ten seconds.',
      direction: 'I designed a sequence built on rapid transitions, typographic motion and syncopated timing. Every frame earns its place.',
      execution: 'Using After Effects and Cinema 4D, I built a piece where form, type and color shift in tight choreography. Sound design was considered from the start.',
      result: 'The final piece performs across social platforms and event screens, consistently drawing engagement and praise for its pacing and visual punch.',
    },
    MERIDIAN: {
      category: 'Graphic Design · Art Direction',
      year: '2023',
      role: 'Art Director & Designer',
      challenge: 'MERIDIAN needed a campaign that could work across print, digital and environmental formats while telling a unified visual story.',
      direction: 'I established a grid-based system with strong typographic hierarchy and a restrained palette. The visual language is minimal but assertive.',
      execution: 'From poster series to digital banners, every piece was built on the same structural framework. Photography direction tied the campaign together emotionally.',
      result: 'A campaign that reads clearly at any scale — MERIDIAN\'s visual system has proven adaptable enough to extend into future brand phases.',
    },
    SOLARIS: {
      category: 'Graphic Design',
      year: '2023',
      role: 'Graphic Designer',
      challenge: 'SOLARIS called for a bold, warm identity that could cut through noise and feel instantly recognizable.',
      direction: 'I used a high-contrast palette of gold and dark tones with a custom wordmark that carries weight and warmth simultaneously.',
      execution: 'Deliverables included logo variations, pattern systems, social media kits and print-ready templates — all built for easy use by the SOLARIS team.',
      result: 'The identity is now live across all channels, giving SOLARIS a distinctive presence that stands apart in its space.',
    },
    VANTAGE: {
      category: 'Branding · Graphic Design',
      year: '2024',
      role: 'Brand Strategist & Designer',
      challenge: 'VANTAGE needed a brand that spoke to sophistication and clarity — a visual system that felt premium without being cold.',
      direction: 'I chose a refined serif-forward type system, a muted but warm palette, and a logo mark that references both precision and perspective.',
      execution: 'The brand was rolled out across a full suite of materials: print, digital, packaging and environmental graphics. Every touchpoint was designed to feel intentional.',
      result: 'VANTAGE now operates with a visual identity that matches the quality of its offering — premium, clear and unmistakably itself.',
    },
    ECHO: {
      category: 'Motion Design · Video',
      year: '2023',
      role: 'Motion Designer & Editor',
      challenge: 'ECHO needed a video piece that blended motion graphics with live footage seamlessly, creating a narrative that held attention from start to finish.',
      direction: 'I approached the edit as a rhythm problem — building momentum through pacing, transitions and graphic overlays that punctuate the story.',
      execution: 'The piece combines graded footage, custom title animations and a carefully built sound bed. Every cut serves the narrative.',
      result: 'ECHO\'s video now leads their campaign presence, praised for its pacing, visual consistency and emotional impact.',
    },
    ORBIT: {
      category: 'Video · Motion Design',
      year: '2024',
      role: 'Editor & Motion Designer',
      challenge: 'ORBIT required a launch film that moved at the speed of the product it represented — fast, precise and visually striking from the first frame.',
      direction: 'I built the piece around orbital motion: repeated circular paths, speeding elements and a kinetic typographic system that keeps the energy tight.',
      execution: 'The film was edited with a music-first approach, cutting rhythm to build and release tension. Motion graphics were layered carefully so the story never gets lost in the effects.',
      result: 'A launch film that holds attention end to end — fast enough for feeds, structured enough for a keynote stage, and built to loop.',
    },
    ZENITH: {
      category: 'Graphic Design · Branding',
      year: '2023',
      role: 'Brand Designer',
      challenge: 'ZENITH wanted an identity that felt elevated without being distant — a balance between luxury and accessibility across every touchpoint.',
      direction: 'The visual language leans on a refined palette and disciplined typography, with a wordmark that carries quiet confidence instead of loud claims.',
      execution: 'The system covers print, packaging, digital and environmental applications, each one built to feel like part of the same considered conversation.',
      result: 'A premium identity that reads as intentional at every scale and stays approachable — exactly the balance the brand was after.',
    },
    VECTOR: {
      category: 'Graphic Design',
      year: '2023',
      role: 'Graphic Designer',
      challenge: 'VECTOR needed a visual system for a technical audience that never felt cold — clarity without sterility.',
      direction: 'I paired a structured grid with generous spacing and a cool accent palette, letting precision feel human through the details.',
      execution: 'Deliverables included icon systems, technical document templates, signage and digital assets — each one built on the same clear logic.',
      result: 'A system that makes complex information feel orderly and calm, with enough warmth to keep the audience engaged.',
    },
    APEX: {
      category: 'Motion Design · Graphic Design',
      year: '2024',
      role: 'Art Director & Animator',
      challenge: 'APEX needed a motion-forward identity that could perform across social, broadcast and event environments without losing coherence.',
      direction: 'The identity was designed for movement from the start — shapes that reassemble, type that travels and a palette engineered for screen contrast.',
      execution: 'I directed and animated a full motion toolkit: logo stings, lower thirds, transitions and template packs, all governed by a shared animation language.',
      result: 'APEX now has a brand that moves as well as it prints, with motion assets any team can deploy consistently.',
    },
  };

  function initProjectOverlay() {
    const overlay = document.querySelector('.project-overlay');
    const workItems = document.querySelectorAll('.work-item');

    if (!gsapReady()) return;

    // No overlay on this page — work items navigate to the work archive.
    if (!overlay) {
      workItems.forEach((item) => {
        item.addEventListener('click', () => {
          window.location.href = 'work.html';
        });
      });
      return;
    }

    const closeBtn = overlay.querySelector('.project-close');

    workItems.forEach((item, idx) => {
      item.addEventListener('click', () => {
        const title = item.querySelector('.work-item-title');
        if (!title) return;

        currentIndex = idx;
        visibleItems = [...workItems].filter((el) => el.style.display !== 'none');

        const projectName = title.textContent.trim();
        const data = projectData[projectName];

        if (data) {
          populateOverlay(overlay, projectName, data);
        }

        openOverlay(overlay);
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeOverlay(overlay));
    }

    // Prev / next navigation through projects
    let currentIndex = 0;
    let visibleItems = [...workItems];

    function showProjectAt(index, overlay) {
      if (visibleItems.length === 0) return;
      currentIndex = (index + visibleItems.length) % visibleItems.length;
      const item = visibleItems[currentIndex];
      const title = item.querySelector('.work-item-title');
      if (!title) return;
      const name = title.textContent.trim();
      const data = projectData[name];
      if (data) {
        populateOverlay(overlay, name, data);
        const contents = overlay.querySelectorAll('.overlay-title, .overlay-category, .overlay-year, .overlay-role, .overlay-challenge, .overlay-direction, .overlay-execution, .overlay-result');
        if (!prefersReducedMotion && gsapReady()) {
          gsap.from(contents, { y: 20, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out' });
        }
      }
    }

    const prevBtn = overlay.querySelector('.project-prev');
    const nextBtn = overlay.querySelector('.project-next');

    if (prevBtn) prevBtn.addEventListener('click', () => showProjectAt(currentIndex - 1, overlay));
    if (nextBtn) nextBtn.addEventListener('click', () => showProjectAt(currentIndex + 1, overlay));

    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeOverlay(overlay);
      if (e.key === 'ArrowLeft') showProjectAt(currentIndex - 1, overlay);
      if (e.key === 'ArrowRight') showProjectAt(currentIndex + 1, overlay);
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeOverlay(overlay);
    });
  }

  function populateOverlay(overlay, name, data) {
    const titleEl = overlay.querySelector('.overlay-title');
    const categoryEl = overlay.querySelector('.overlay-category');
    const yearEl = overlay.querySelector('.overlay-year');
    const roleEl = overlay.querySelector('.overlay-role');
    const challengeEl = overlay.querySelector('.overlay-challenge');
    const directionEl = overlay.querySelector('.overlay-direction');
    const executionEl = overlay.querySelector('.overlay-execution');
    const resultEl = overlay.querySelector('.overlay-result');

    if (titleEl) titleEl.textContent = name;
    if (categoryEl) categoryEl.textContent = data.category;
    if (yearEl) yearEl.textContent = data.year;
    if (roleEl) roleEl.textContent = data.role;
    if (challengeEl) challengeEl.textContent = data.challenge;
    if (directionEl) directionEl.textContent = data.direction;
    if (executionEl) executionEl.textContent = data.execution;
    if (resultEl) resultEl.textContent = data.result;
  }

  function openOverlay(overlay) {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    if (!prefersReducedMotion && gsapReady()) {
      gsap.fromTo(overlay,
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 0.7, ease: 'power3.inOut' }
      );

      const content = overlay.querySelectorAll('.overlay-title, .overlay-category, .overlay-year, .overlay-role, .overlay-challenge, .overlay-direction, .overlay-execution, .overlay-result, .project-close');
      gsap.from(content, {
        y: 40,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power3.out',
        delay: 0.35,
      });
    }

    const firstFocusable = overlay.querySelector('.project-close');
    if (firstFocusable) firstFocusable.focus();
  }

  function closeOverlay(overlay) {
    if (!prefersReducedMotion && gsapReady()) {
      gsap.to(overlay, {
        clipPath: 'inset(100% 0 0 0)',
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => {
          overlay.classList.remove('is-open');
          document.body.style.overflow = '';
        },
      });
    } else {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  // ── 12. MAGNETIC BUTTON EFFECT ───────────────────────────
  function initMagneticButtons() {
    if (isTouchDevice || prefersReducedMotion || !gsapReady()) return;

    const magneticElements = document.querySelectorAll('.cta-link, .filter-btn');

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

  // ── 13. TEXT SCRAMBLE EFFECT ─────────────────────────────
  function initTextScramble() {
    if (isTouchDevice || prefersReducedMotion) return;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const titles = document.querySelectorAll('.work-item-title');

    titles.forEach((title) => {
      const originalText = title.textContent.trim();

      title.addEventListener('mouseenter', () => {
        let iterations = 0;
        const maxIterations = 6;

        const interval = setInterval(() => {
          title.textContent = originalText
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' ';
              if (i < iterations) return originalText[i];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

          iterations += 1 / 2;

          if (iterations >= maxIterations) {
            clearInterval(interval);
            title.textContent = originalText;
          }
        }, 40);
      });
    });
  }

  // ── 14. SMOOTH SCROLL INDICATOR ──────────────────────────
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

  // ── 15. ACCESSIBILITY ────────────────────────────────────
  function initAccessibility() {
    // Mark decorative elements as aria-hidden (reinforce HTML attributes via JS)
    document.querySelectorAll('.hero-visual, .scroll-line').forEach((el) => {
      el.setAttribute('aria-hidden', 'true');
    });

    // Trap focus inside open modals / overlays
    const overlay = document.querySelector('.project-overlay');
    if (overlay) {
      overlay.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab' || !overlay.classList.contains('is-open')) return;

        const focusable = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });
    }

    // Ensure all interactive elements have visible focus styles
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') document.body.classList.add('using-keyboard');
    });
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('using-keyboard');
    });
  }

  // ── 15.5 EXPERIENCE TIMER ────────────────────────────────
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

  // ── 15.6 CONTACT MODAL ─────────────────────────────────
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

  // ── 16. PERFORMANCE CLEANUP ──────────────────────────────
  window.addEventListener('beforeunload', () => {
    if (gsapReady()) {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf('*');
    }
  });

})();
