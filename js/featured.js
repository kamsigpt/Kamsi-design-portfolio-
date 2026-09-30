/* ============================================
   FEATURED — Art-directed collage for the home page
   Same packing approach as the gallery wall, authored
   for a fixed set of six pieces. Each piece keeps its
   own aspect ratio, so the media itself is the layout.
   ============================================ */

(function () {
  'use strict';

  var root = document.getElementById('featured-collage');
  if (!root) return;

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var HOVERABLE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var HAS_GSAP = typeof window.gsap !== 'undefined';

  // Corner-outward arrows: signals "click to open fullscreen".
  var EXPAND_ICON =
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.9" ' +
    'stroke-linecap="round" stroke-linejoin="round" focusable="false">' +
    '<path d="M6 1.5H1.5V6"/><path d="M10 1.5h4.5V6"/>' +
    '<path d="M14.5 10v4.5H10"/><path d="M1.5 10v4.5H6"/></svg>';

  var IMG_DIR = 'assets/images/';
  var VID_DIR = 'assets/videos/web/';
  var POST_DIR = 'assets/posters/';

  function assetURL(dir, file) {
    return dir + encodeURIComponent(file);
  }

  /* ---------------------------------------------------------------
     1. MEDIA — six picks, dimensions measured from the real files.
     Each row pairs one video with one still, so the preview reads as a
     gallery rather than a grid of a single discipline.
     --------------------------------------------------------------- */
  var MEDIA = [
    { id: 'hyle-motion', kind: 'video', w: 1920, h: 1080, file: 'hyle-motion.mp4', poster: 'hyle-studios-motion.jpg',
      name: 'HYLE STUDIOS', cat: 'Motion Graphics · Video' },
    { id: 'ko-shirt', kind: 'image', w: 1536, h: 1024, file: 'KO clothing shirt design.jpg',
      name: 'K.O', cat: 'Apparel Graphic Design' },

    { id: 'ko-showcase', kind: 'video', w: 1920, h: 1080, file: 'ko-showcase.mp4', poster: 'ko-showcase.jpg',
      name: 'K.O', cat: 'Design Showcase · Motion' },
    { id: 'hyle-logo', kind: 'image', w: 1200, h: 896, file: 'hyle studios logo.jpg',
      name: 'HYLE STUDIOS', cat: 'Brand Identity · Logo' },

    { id: 'curio-video', kind: 'video', w: 1920, h: 1080, file: 'curio.mp4', poster: 'curio.jpg',
      name: 'CURIO', cat: 'Motion Design · Product Film' },
    { id: 'vanguard', kind: 'image', w: 1440, h: 1028, file: 'vanguard flyer.jpg',
      name: 'VANGUARD', cat: 'Campaign Flyer' }
  ];

  var byId = {};
  MEDIA.forEach(function (m) {
    m.ratio = m.w / m.h;
    m.src = assetURL(m.kind === 'video' ? VID_DIR : IMG_DIR, m.file);
    m.poster = m.poster ? assetURL(POST_DIR, m.poster) : '';
    byId[m.id] = m;
  });

  /* ---------------------------------------------------------------
     2. COMPOSITION
     Authored as bands of columns. Spans are relative to the
     breakpoint's track count, so the same six pieces read as three
     rows on desktop and tablet and a wrapped set on mobile.
     --------------------------------------------------------------- */
  var BANDS = {
    d: [
      [{ w: 3, i: ['hyle-motion'] }, { w: 3, i: ['ko-shirt'] }],
      [{ w: 3, i: ['ko-showcase'] }, { w: 3, i: ['hyle-logo'] }],
      [{ w: 3, i: ['curio-video'] }, { w: 3, i: ['vanguard'] }]
    ],
    t: [
      [{ w: 2, i: ['hyle-motion'] }, { w: 2, i: ['ko-shirt'] }],
      [{ w: 2, i: ['ko-showcase'] }, { w: 2, i: ['hyle-logo'] }],
      [{ w: 2, i: ['curio-video'] }, { w: 2, i: ['vanguard'] }]
    ],
    m: [
      [{ w: 2, i: ['hyle-motion'] }],
      [{ w: 2, i: ['hyle-logo'] }],
      [{ w: 2, i: ['ko-showcase'] }],
      [{ w: 1, i: ['vanguard'] }, { w: 1, i: ['ko-shirt'] }],
      [{ w: 2, i: ['curio-video'] }]
    ]
  };

  var TRACKS = { d: { cols: 6, gap: 11 }, t: { cols: 4, gap: 10 }, m: { cols: 2, gap: 8 } };

  var BREAKPOINTS = [
    { key: 'm', max: 767 },
    { key: 't', max: 1199 },
    { key: 'd', max: Infinity }
  ];

  function currentKey() {
    var w = window.innerWidth;
    for (var i = 0; i < BREAKPOINTS.length; i++) {
      if (w <= BREAKPOINTS[i].max) return BREAKPOINTS[i].key;
    }
    return 'd';
  }

  /* ---------------------------------------------------------------
     3. TILE FACTORY
     Reuses the gallery's .atlas-* markup so hover, labels, focus
     rings and video badges behave identically on both pages.
     --------------------------------------------------------------- */
  var tiles = {};

  function buildTile(item) {
    var tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'atlas-tile' + (item.kind === 'video' ? ' is-video' : '');
    tile.dataset.id = item.id;
    tile.setAttribute('aria-label', 'Open ' + item.name + ' — ' + item.cat);

    var frame = document.createElement('span');
    frame.className = 'atlas-frame';

    var media = document.createElement('span');
    media.className = 'atlas-media';

    if (item.kind === 'video') {
      var video = document.createElement('video');
      video.className = 'atlas-video';
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('muted', '');
      video.setAttribute('webkit-playsinline', '');
      video.preload = 'none';
      video.poster = item.poster;
      video.setAttribute('aria-hidden', 'true');
      media.appendChild(video);
      item.video = video;
    } else {
      var img = document.createElement('img');
      img.className = 'atlas-image';
      img.src = item.src;
      img.alt = item.name + ' — ' + item.cat;
      img.width = item.w;
      img.height = item.h;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.draggable = false;
      media.appendChild(img);
    }

    var scrim = document.createElement('span');
    scrim.className = 'atlas-scrim';

    var badge = document.createElement('span');
    badge.className = 'atlas-badge';
    badge.setAttribute('aria-hidden', 'true');
    badge.innerHTML = EXPAND_ICON;

    var open = document.createElement('span');
    open.className = 'atlas-open';
    open.setAttribute('aria-hidden', 'true');
    open.textContent = 'OPEN';

    var caption = document.createElement('span');
    caption.className = 'atlas-caption';
    var cat = document.createElement('span');
    cat.className = 'atlas-cat';
    cat.textContent = item.cat;
    var name = document.createElement('span');
    name.className = 'atlas-name';
    name.textContent = item.name;
    caption.appendChild(cat);
    caption.appendChild(name);

    frame.appendChild(media);
    frame.appendChild(scrim);
    frame.appendChild(badge);
    frame.appendChild(open);
    frame.appendChild(caption);
    tile.appendChild(frame);
    return tile;
  }

  MEDIA.forEach(function (item) {
    var tile = buildTile(item);
    tiles[item.id] = tile;
    root.appendChild(tile);
  });

  /* ---------------------------------------------------------------
     4. PACKING ENGINE
     Bands run top to bottom, every column starts at the band top and
     a stack flows down. Band height is the tallest column, so the
     raggedness stays inside a band instead of leaking between them.
     Width comes from the span; height is always width ÷ real ratio.
     --------------------------------------------------------------- */
  function pack(bands, track) {
    var gap = track.gap;
    var total = root.clientWidth;
    if (!total) return null;
    var colW = (total - (track.cols - 1) * gap) / track.cols;
    var placements = {};
    var y = 0;

    bands.forEach(function (band) {
      var bandTop = y;
      var bandHeight = 0;
      var x = 0;

      band.forEach(function (col) {
        var w = col.w * colW + (col.w - 1) * gap;
        var cy = bandTop;

        col.i.forEach(function (id) {
          var item = byId[id];
          if (!item) return;
          var h = w / item.ratio;
          placements[id] = { x: x, y: cy, w: w, h: h };
          cy += h + gap;
        });

        bandHeight = Math.max(bandHeight, cy - bandTop - gap);
        x += w + gap;
      });

      y = bandTop + bandHeight + gap;
    });

    return { placements: placements, height: Math.max(0, y - gap) };
  }

  /* ---------------------------------------------------------------
     5. RENDER
     --------------------------------------------------------------- */
  function apply() {
    var key = currentKey();
    var result = pack(BANDS[key], TRACKS[key]);
    if (!result) return;

    var total = root.clientWidth;

    MEDIA.forEach(function (item) {
      var slot = result.placements[item.id];
      var tile = tiles[item.id];
      if (!slot) return;

      // Rounding x and w independently can push the last column of a
      // band a pixel past the canvas and raise a horizontal scrollbar.
      var x = Math.round(slot.x);
      var w = Math.min(Math.round(slot.w), Math.max(0, total - x));
      tile.style.width = w + 'px';
      tile.style.height = Math.round(slot.h) + 'px';
      tile.style.transform = 'translate3d(' + x + 'px,' + Math.round(slot.y) + 'px,0)';
      tile.classList.toggle('is-slim', slot.h < 165);
    });

    root.style.height = Math.round(result.height) + 'px';
    root.classList.add('is-ready');
  }

  /* ---------------------------------------------------------------
     6. VIDEO SCHEDULING
     Sources attach only as a piece nears the viewport; anything
     scrolled away is paused so the page never decodes six at once.
     --------------------------------------------------------------- */
  function scheduleVideos() {
    if (!('IntersectionObserver' in window)) return;

    var loadObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var item = byId[entry.target.dataset.id];
        if (!item || !item.video) return;
        if (entry.isIntersecting && !item.loaded) {
          item.loaded = true;
          item.video.src = item.src;
          item.video.load();
        }
      });
    }, { rootMargin: '400px 0px' });

    var playObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var item = byId[entry.target.dataset.id];
        if (!item || !item.video || !item.loaded) return;
        if (entry.isIntersecting) {
          var p = item.video.play();
          if (p && p.catch) p.catch(function () {});
          entry.target.classList.add('is-playing');
        } else {
          item.video.pause();
          entry.target.classList.remove('is-playing');
        }
      });
    }, { threshold: 0.12 });

    MEDIA.forEach(function (item) {
      if (!item.video) return;
      loadObserver.observe(tiles[item.id]);
      playObserver.observe(tiles[item.id]);
    });
  }

  function pauseAll() {
    MEDIA.forEach(function (item) {
      if (item.video) item.video.pause();
    });
  }

  /* ---------------------------------------------------------------
     7. HOVER / FOCUS — neighbours recede behind the hovered piece
     --------------------------------------------------------------- */
  if (HOVERABLE && !REDUCED) {
    root.addEventListener('pointerover', function (e) {
      var tile = e.target.closest ? e.target.closest('.atlas-tile') : null;
      if (!tile) return;
      if (root.dataset.hover === tile.dataset.id) return;
      root.dataset.hover = tile.dataset.id;
      root.classList.add('is-hovering');
    });

    root.addEventListener('pointerout', function (e) {
      var tile = e.target.closest ? e.target.closest('.atlas-tile') : null;
      if (tile && e.relatedTarget && tile.contains(e.relatedTarget)) return;
      delete root.dataset.hover;
      root.classList.remove('is-hovering');
    });
  }

  /* ---------------------------------------------------------------
     8. VIEWER — same lightbox the gallery uses, scoped to six pieces
     --------------------------------------------------------------- */
  var viewer = null;
  var frame = null;
  var indexLabel = null;
  var kindEl = null;
  var titleEl = null;
  var metaEl = null;
  var currentIndex = 0;
  var lastFocus = null;

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function buildViewer() {
    viewer = document.createElement('div');
    viewer.className = 'viewer';
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-modal', 'true');
    viewer.setAttribute('aria-label', 'Media viewer');
    viewer.setAttribute('aria-hidden', 'true');

    viewer.innerHTML =
      '<div class="viewer-backdrop" data-viewer-close></div>' +
      '<div class="viewer-bar">' +
        '<div class="viewer-meta"><span class="viewer-index">01 / 06</span><span class="viewer-kind">IMAGE</span></div>' +
        '<button class="viewer-close" type="button" aria-label="Close viewer">' +
          '<span aria-hidden="true">&times;</span>' +
        '</button>' +
      '</div>' +
      '<div class="viewer-stage">' +
        '<button class="viewer-nav viewer-prev" type="button" aria-label="Previous piece"><span aria-hidden="true">&larr;</span></button>' +
        '<div class="viewer-frame"></div>' +
        '<button class="viewer-nav viewer-next" type="button" aria-label="Next piece"><span aria-hidden="true">&rarr;</span></button>' +
      '</div>' +
      '<div class="viewer-caption">' +
        '<h2 class="viewer-title"></h2>' +
        '<p class="viewer-sub"></p>' +
      '</div>';

    document.body.appendChild(viewer);

    frame = viewer.querySelector('.viewer-frame');
    indexLabel = viewer.querySelector('.viewer-index');
    kindEl = viewer.querySelector('.viewer-kind');
    titleEl = viewer.querySelector('.viewer-title');
    metaEl = viewer.querySelector('.viewer-sub');

    viewer.querySelector('.viewer-close').addEventListener('click', closeViewer);
    viewer.querySelector('[data-viewer-close]').addEventListener('click', closeViewer);
    viewer.querySelector('.viewer-prev').addEventListener('click', function () { step(-1); });
    viewer.querySelector('.viewer-next').addEventListener('click', function () { step(1); });

    var touchX = null;
    viewer.addEventListener('touchstart', function (e) {
      touchX = e.changedTouches[0].clientX;
    }, { passive: true });
    viewer.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
      touchX = null;
    }, { passive: true });
  }

  function clearFrame() {
    var v = frame.querySelector('video');
    if (v) {
      v.pause();
      v.removeAttribute('src');
      v.load();
    }
    frame.innerHTML = '';
  }

  function show(index) {
    currentIndex = (index + MEDIA.length) % MEDIA.length;
    var item = MEDIA[currentIndex];

    clearFrame();

    if (item.kind === 'video') {
      var v = document.createElement('video');
      v.className = 'viewer-video';
      v.src = item.src;
      v.poster = item.poster;
      v.controls = true;
      v.autoplay = true;
      v.loop = true;
      v.muted = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.setAttribute('muted', '');
      frame.appendChild(v);
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    } else {
      var img = document.createElement('img');
      img.className = 'viewer-image';
      img.src = item.src;
      img.alt = item.name + ' — ' + item.cat;
      frame.appendChild(img);
    }

    frame.style.setProperty('--ratio', item.ratio);
    indexLabel.textContent = pad(currentIndex + 1) + ' / ' + pad(MEDIA.length);
    titleEl.textContent = item.name;
    metaEl.textContent = item.cat;
    kindEl.textContent = item.kind === 'video' ? 'VIDEO' : item.ratio >= 2 ? 'WIDE FORMAT' : 'STILL';
  }

  function openViewer(id) {
    if (!viewer) buildViewer();

    var idx = MEDIA.findIndex(function (item) { return item.id === id; });
    if (idx < 0) return;

    lastFocus = document.activeElement;
    pauseAll();

    viewer.classList.add('is-open');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    show(idx);
    viewer.querySelector('.viewer-close').focus();

    if (HAS_GSAP && !REDUCED) {
      window.gsap.fromTo(frame,
        { opacity: 0, scale: 0.965, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.44, ease: 'power3.out' }
      );
      window.gsap.fromTo(viewer.querySelector('.viewer-caption'),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.08, ease: 'power2.out' }
      );
    }
  }

  function closeViewer() {
    if (!viewer || !viewer.classList.contains('is-open')) return;
    clearFrame();
    viewer.classList.remove('is-open');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function step(dir) {
    show(currentIndex + dir);
  }

  root.addEventListener('click', function (e) {
    var tile = e.target.closest ? e.target.closest('.atlas-tile') : null;
    if (!tile) return;
    openViewer(tile.dataset.id);
  });

  document.addEventListener('keydown', function (e) {
    if (!viewer || !viewer.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeViewer();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'Tab') {
      var focusable = viewer.querySelectorAll('button');
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ---------------------------------------------------------------
     9. RESIZE
     --------------------------------------------------------------- */
  var resizeTimer = null;

  function onResize() {
    root.classList.add('is-reflowing');
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      apply();
      root.classList.remove('is-reflowing');
    }, 120);
  }

  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize, { passive: true });

  /* ---------------------------------------------------------------
     10. REVEAL
     Handled in CSS on .atlas-frame so it never fights the layout
     transform the packer writes onto the tile.
     --------------------------------------------------------------- */
  function reveal() {
    if (!('IntersectionObserver' in window)) {
      MEDIA.forEach(function (item) { tiles[item.id].classList.add('is-in'); });
      return;
    }

    var seen = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    MEDIA.forEach(function (item) { seen.observe(tiles[item.id]); });
  }

  /* ---------------------------------------------------------------
     11. BOOT
     --------------------------------------------------------------- */
  function boot() {
    apply();
    scheduleVideos();
    reveal();

    if (typeof window.ScrollTrigger !== 'undefined' && HAS_GSAP) {
      window.ScrollTrigger.refresh();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
