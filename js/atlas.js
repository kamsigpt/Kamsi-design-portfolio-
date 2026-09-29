/* ============================================
   ATLAS — Art-Directed Media Collage
   Asset-aware packed layout engine for work.html
   ============================================ */

(function () {
  'use strict';

  var root = document.getElementById('atlas');
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
     1. ASSET MANIFEST
     Intrinsic width / height read from the real files in
     assets/images and assets/videos. Every value below is
     measured, never assumed — the layout is driven by them.
     --------------------------------------------------------------- */
  var MEDIA = [
    { id: 'hyle-motion', kind: 'video', w: 1920, h: 1080, file: 'hyle-motion.mp4', poster: 'hyle-studios-motion.jpg',
      name: 'HYLE STUDIOS', cat: 'Motion Graphics · Video', tags: ['motion', 'video', 'branding'] },
    { id: 'hyle-logo', kind: 'image', w: 1200, h: 896, file: 'hyle studios logo.jpg',
      name: 'HYLE STUDIOS', cat: 'Brand Identity · Logo', tags: ['branding'] },
    { id: 'hyle-merch', kind: 'image', w: 1536, h: 1024, file: 'hyle studio merch drop concept.jpg',
      name: 'HYLE STUDIOS', cat: 'Merch Drop · Product Design', tags: ['product', 'graphic'] },

    { id: 'ko-showcase', kind: 'video', w: 1920, h: 1080, file: 'ko-showcase.mp4', poster: 'ko-showcase.jpg',
      name: 'K.O', cat: 'Design Showcase · Motion', tags: ['motion', 'video'] },
    { id: 'ko-shirt', kind: 'image', w: 1536, h: 1024, file: 'KO clothing shirt design.jpg',
      name: 'K.O', cat: 'Apparel Graphic Design', tags: ['graphic', 'product'] },
    { id: 'ko-hoodie', kind: 'image', w: 800, h: 800, file: 'KO  clothing color hoodie design.jpg',
      name: 'K.O', cat: 'Colourway · Apparel Design', tags: ['graphic', 'product'] },

    { id: 'forge', kind: 'image', w: 639, h: 141, file: 'forge flow logo.PNG',
      name: 'FORGE FLOW', cat: 'Brand Identity · Wordmark', tags: ['branding'] },

    { id: 'curio-video', kind: 'video', w: 1920, h: 1080, file: 'curio.mp4', poster: 'curio.jpg',
      name: 'CURIO', cat: 'Motion Design · Product Film', tags: ['motion', 'video', 'branding'] },
    { id: 'curio-logo', kind: 'image', w: 612, h: 408, file: 'Curio logo.jpg',
      name: 'CURIO', cat: 'Brand Identity · Logo', tags: ['branding'] },

    { id: 'hair-care', kind: 'image', w: 896, h: 1200, file: 'hair care flyer for instagram.jpg',
      name: 'HAIR CARE', cat: 'Instagram Flyer · Social', tags: ['graphic', 'social'] },
    { id: 'restaurant', kind: 'image', w: 896, h: 1200, file: 'Resturant flyer.jpg',
      name: 'MENU DESIGN', cat: 'Flyer · Graphic Design', tags: ['graphic'] },
    { id: 'vendtill', kind: 'image', w: 1080, h: 1350, file: 'vendtill Brand flyer.jpg',
      name: 'VENDTILL', cat: 'Brand Flyer · Social', tags: ['branding', 'graphic', 'social'] },
    { id: 'bca', kind: 'image', w: 896, h: 1200, file: 'BCA Business card.jpg',
      name: 'BCA', cat: 'Business Card · Stationery', tags: ['branding', 'product'] },

    { id: 'itel', kind: 'video', w: 1920, h: 1080, file: 'itel.mp4', poster: 'itel.jpg',
      name: 'ITEL', cat: 'Concept Video · Motion', tags: ['motion', 'video'] },
    { id: 'renmoney', kind: 'video', w: 1920, h: 1080, file: 'renmoney.mp4', poster: 'renmoney.jpg',
      name: 'RENMONEY', cat: 'Loans Ad · Video Edit', tags: ['video'] },
    { id: 'vanguard', kind: 'image', w: 1440, h: 1028, file: 'vanguard flyer.jpg',
      name: 'VANGUARD', cat: 'Campaign Flyer', tags: ['graphic'] },
    { id: 'clothing-ad', kind: 'image', w: 1024, h: 1024, file: 'clothing instagram ad flyer.jpg',
      name: 'CLOTHING DROP', cat: 'Instagram Ad · Social', tags: ['graphic', 'social'] },
    { id: 'smartraq', kind: 'image', w: 2000, h: 2000, file: 'smartraq logo.jpg',
      name: 'SMARTRAX', cat: 'Brand Identity · Logo', tags: ['branding'] },

    { id: 'portfolio-motion', kind: 'video', w: 1920, h: 1080, file: 'portfolio-motion.mp4', poster: 'portfolio-motion.jpg',
      name: 'MOTION REEL', cat: 'Motion Graphics · Title Sequence', tags: ['motion'] }
  ];

  var byId = {};
  MEDIA.forEach(function (m) {
    m.ratio = m.w / m.h;
    m.src = assetURL(m.kind === 'video' ? VID_DIR : IMG_DIR, m.file);
    m.poster = m.poster ? assetURL(POST_DIR, m.poster) : '';
    byId[m.id] = m;
  });

  /* ---------------------------------------------------------------
     2. ART-DIRECTED COMPOSITION
     The wall is authored as bands. Each band is a row of
     columns; each column is a vertical stack of pieces. Span
     numbers are relative to the breakpoint's track count, so the
     same composition reads as 6 / 4 / 2 columns.
     The layout engine keeps original aspect ratios — the span
     only sets the width, the height is always width ÷ ratio.
     --------------------------------------------------------------- */
  var BANDS = {
    d: [
      [{ w: 4, i: ['hyle-motion'] }, { w: 2, i: ['hyle-logo', 'hyle-merch'] }],
      [{ w: 3, i: ['ko-showcase'] }, { w: 3, i: ['ko-shirt'] }],
      [{ w: 6, i: ['forge'] }],
      [{ w: 3, i: ['curio-video'] }, { w: 3, i: ['curio-logo'] }],
      [{ w: 2, i: ['hair-care'] }, { w: 2, i: ['restaurant'] }, { w: 2, i: ['vendtill'] }],
      [{ w: 4, i: ['itel'] }, { w: 2, i: ['bca'] }],
      [{ w: 3, i: ['renmoney'] }, { w: 3, i: ['vanguard'] }],
      [{ w: 2, i: ['ko-hoodie'] }, { w: 2, i: ['clothing-ad'] }, { w: 2, i: ['smartraq'] }],
      [{ w: 6, i: ['portfolio-motion'] }]
    ],
    t: [
      [{ w: 4, i: ['hyle-motion'] }],
      [{ w: 2, i: ['hyle-logo'] }, { w: 2, i: ['hyle-merch'] }],
      [{ w: 2, i: ['ko-showcase'] }, { w: 2, i: ['ko-shirt'] }],
      [{ w: 4, i: ['forge'] }],
      [{ w: 2, i: ['curio-video'] }, { w: 2, i: ['curio-logo'] }],
      [{ w: 2, i: ['hair-care'] }, { w: 2, i: ['restaurant'] }],
      [{ w: 2, i: ['vendtill'] }, { w: 2, i: ['bca'] }],
      [{ w: 4, i: ['itel'] }],
      [{ w: 2, i: ['renmoney'] }, { w: 2, i: ['vanguard'] }],
      [{ w: 2, i: ['ko-hoodie'] }, { w: 2, i: ['clothing-ad'] }],
      [{ w: 4, i: ['smartraq'] }],
      [{ w: 4, i: ['portfolio-motion'] }]
    ],
    m: [
      [{ w: 2, i: ['hyle-motion'] }],
      [{ w: 1, i: ['hyle-logo'] }, { w: 1, i: ['hyle-merch'] }],
      [{ w: 2, i: ['ko-showcase'] }],
      [{ w: 1, i: ['ko-shirt'] }, { w: 1, i: ['ko-hoodie'] }],
      [{ w: 2, i: ['forge'] }],
      [{ w: 2, i: ['curio-video'] }],
      [{ w: 1, i: ['curio-logo'] }, { w: 1, i: ['hair-care'] }],
      [{ w: 1, i: ['restaurant'] }, { w: 1, i: ['vendtill'] }],
      [{ w: 1, i: ['bca'] }, { w: 1, i: ['clothing-ad'] }],
      [{ w: 2, i: ['itel'] }],
      [{ w: 2, i: ['renmoney'] }],
      [{ w: 1, i: ['vanguard'] }, { w: 1, i: ['smartraq'] }],
      [{ w: 2, i: ['portfolio-motion'] }]
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
     3. FILTERS
     --------------------------------------------------------------- */
  var FILTERS = [
    { id: 'all', label: 'ALL' },
    { id: 'branding', label: 'BRANDING' },
    { id: 'graphic', label: 'GRAPHIC DESIGN' },
    { id: 'motion', label: 'MOTION' },
    { id: 'video', label: 'VIDEO' },
    { id: 'product', label: 'PRODUCT' },
    { id: 'social', label: 'SOCIAL' }
  ];

  var activeFilter = 'all';

  /* ---------------------------------------------------------------
     4. TILE FACTORY
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
     5. PACKING ENGINE
     Bands are laid out top to bottom. Inside a band every column
     starts at the band top; a stack flows downward. Band height is
     the tallest column, so raggedness only ever appears inside a
     band and never between bands.
     --------------------------------------------------------------- */
  function pack(bands, visible, track) {
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
        var used = 0;

        col.i.forEach(function (id) {
          if (!visible[id]) return;
          var item = byId[id];
          var h = w / item.ratio;
          placements[id] = { x: x, y: cy, w: w, h: h };
          cy += h + gap;
          used++;
        });

        if (used) bandHeight = Math.max(bandHeight, cy - bandTop - gap);
        x += w + gap;
      });

      y = bandTop + bandHeight + gap;
    });

    return { placements: placements, height: Math.max(0, y - gap) };
  }

  /* Filtered views collapse to one row of equal columns. A category
     therefore always reads the same way — a single line, one rhythm —
     rather than a ragged collage with empty tracks wherever a piece
     was filtered out. Heights still follow each piece's real ratio. */
  function packRow(list, track) {
    var gap = track.gap;
    var total = root.clientWidth;
    if (!total || !list.length) return null;

    var n = list.length;
    var colW = (total - (n - 1) * gap) / n;
    var placements = {};
    var tallest = 0;

    list.forEach(function (item, i) {
      var h = colW / item.ratio;
      placements[item.id] = { x: i * (colW + gap), y: 0, w: colW, h: h };
      if (h > tallest) tallest = h;
    });

    return { placements: placements, height: tallest };
  }

  function rowItemWidth(n, track) {
    var total = root.clientWidth;
    if (!total || !n) return 0;
    return (total - (n - 1) * track.gap) / n;
  }

  /* When a single row would squeeze a category down to thumbnails —
     eight pieces across a phone, for instance — fall back to an even
     grid of equal cells. Still uniform, just wrapped, so the pieces
     stay big enough to actually read. */
  function packGrid(list, track) {
    var gap = track.gap;
    var total = root.clientWidth;
    if (!total || !list.length) return null;

    var cols = track.cols;
    var colW = (total - (cols - 1) * gap) / cols;
    var placements = {};
    var y = 0;

    for (var i = 0; i < list.length; i += cols) {
      var row = list.slice(i, i + cols);
      var tallest = 0;
      row.forEach(function (item, j) {
        var h = colW / item.ratio;
        placements[item.id] = { x: j * (colW + gap), y: y, w: colW, h: h };
        if (h > tallest) tallest = h;
      });
      y += tallest + gap;
    }

    return { placements: placements, height: Math.max(0, y - gap) };
  }

  // Narrowest a piece may get in a single-line view before it stops
  // reading as the work and starts reading as a thumbnail.
  var MIN_ROW_ITEM = 120;

  function visibleSet() {
    var set = {};
    MEDIA.forEach(function (item) {
      set[item.id] = activeFilter === 'all' || item.tags.indexOf(activeFilter) !== -1;
    });
    return set;
  }

  function visibleList() {
    return MEDIA.filter(function (item) {
      return activeFilter === 'all' || item.tags.indexOf(activeFilter) !== -1;
    });
  }

  /* ---------------------------------------------------------------
     6. RENDER
     --------------------------------------------------------------- */
  function apply() {
    var key = currentKey();
    var track = TRACKS[key];
    var visible = visibleSet();

    var result;
    if (activeFilter === 'all') {
      result = pack(BANDS[key], visible, track);
    } else {
      var list = visibleList();
      result = rowItemWidth(list.length, track) >= MIN_ROW_ITEM
        ? packRow(list, track)
        : packGrid(list, track);
    }
    if (!result) return;

    var total = root.clientWidth;

    MEDIA.forEach(function (item) {
      var tile = tiles[item.id];
      var slot = result.placements[item.id];
      var wasOut = tile.classList.contains('is-out');

      if (!slot) {
        tile.classList.add('is-out');
        tile.setAttribute('aria-hidden', 'true');
        tile.tabIndex = -1;
        return;
      }

      tile.classList.remove('is-out');
      tile.removeAttribute('aria-hidden');
      tile.tabIndex = 0;
      // A piece brought back by a filter can't wait for the scroll
      // reveal: while it was hidden it could never intersect.
      if (wasOut) tile.classList.add('is-in');
      tile.classList.toggle('is-slim', slot.h < 165);

      // Rounding x and w independently can push the last column of a
      // band a pixel past the canvas and raise a horizontal scrollbar.
      var x = Math.round(slot.x);
      var w = Math.min(Math.round(slot.w), Math.max(0, total - x));
      tile.style.width = w + 'px';
      tile.style.height = Math.round(slot.h) + 'px';
      tile.style.transform = 'translate3d(' + x + 'px,' + Math.round(slot.y) + 'px,0)';
    });

    root.style.height = Math.round(result.height) + 'px';
    root.setAttribute('data-count', visibleList().length);

    root.classList.add('is-ready');
  }

  /* ---------------------------------------------------------------
     7. VIDEO SCHEDULING
     Sources are only attached when a piece approaches the
     viewport, and off-screen videos are paused.
     --------------------------------------------------------------- */
  function scheduleVideos() {
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
     8. HOVER / FOCUS
     --------------------------------------------------------------- */
  if (HOVERABLE && !REDUCED) {
    root.addEventListener('pointerover', function (e) {
      var tile = e.target.closest ? e.target.closest('.atlas-tile') : null;
      if (!tile || tile.classList.contains('is-out')) return;
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
     9. FILTERS
     --------------------------------------------------------------- */
  var filterBar = document.querySelector('[data-atlas-filters]');

  if (filterBar) {
    FILTERS.forEach(function (f) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'atlas-filter';
      btn.dataset.filter = f.id;
      btn.textContent = f.label;
      var on = f.id === 'all';
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      filterBar.appendChild(btn);
    });

    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.atlas-filter');
      if (!btn) return;

      activeFilter = btn.dataset.filter;
      filterBar.querySelectorAll('.atlas-filter').forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      pauseAll();
      apply();
      if (typeof window.ScrollTrigger !== 'undefined' && HAS_GSAP) {
        window.ScrollTrigger.refresh();
      }
    });
  }

  /* ---------------------------------------------------------------
     10. LIGHTBOX
     --------------------------------------------------------------- */
  var viewer = null;
  var frame = null;
  var indexLabel = null;
  var kindEl = null;
  var titleEl = null;
  var metaEl = null;
  var currentIndex = 0;
  var lastFocus = null;
  var navList = MEDIA.slice();

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
        '<div class="viewer-meta"><span class="viewer-index">01 / 19</span><span class="viewer-kind">IMAGE</span></div>' +
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
    if (!navList.length) return;
    currentIndex = (index + navList.length) % navList.length;
    var item = navList[currentIndex];

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
    indexLabel.textContent = pad(currentIndex + 1) + ' / ' + pad(navList.length);
    titleEl.textContent = item.name;
    metaEl.textContent = item.cat;
    kindEl.textContent = item.kind === 'video' ? 'VIDEO' : item.ratio >= 2 ? 'WIDE FORMAT' : 'STILL';
  }

  function openViewer(id) {
    if (!viewer) buildViewer();

    navList = visibleList();
    var idx = navList.findIndex(function (item) { return item.id === id; });
    if (idx < 0) {
      navList = MEDIA.slice();
      idx = navList.findIndex(function (item) { return item.id === id; });
    }
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
    if (!tile || tile.classList.contains('is-out')) return;
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
     11. RESIZE
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
     12. REVEAL
     Handled in CSS on .atlas-frame so the reveal never fights
     the layout transform the packer writes to the tile.
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
     13. BOOT
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
