# Kamsi Okoro — Design Portfolio

A premium, cinematic design portfolio for **Kamsi Okoro** — Graphic Designer, Motion Designer and Video Editor.

## Overview

This is a hand-crafted, art-directed portfolio website built with vanilla HTML, CSS and JavaScript (GSAP for animation). It positions Kamsi as a serious independent creative designer, with a vibrant **sky / ice blue** visual language (deep-navy-on-blue) that grabs attention while staying premium and cinematic.

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Home — one continuous cinematic story: hero, background, disciplines, selected work, credentials, CTA |
| `work.html` | Work — digital-gallery archive with filterable grid (ALL / GRAPHIC / MOTION / VIDEO / BRANDING) and project detail overlay |
| `project.html` | Project detail template (Challenge → Creative Direction → Execution → Result) |

## Features

- Custom loading experience with staggered letter reveal + progress bar
- Custom cursor (dot + trailing outline, "VIEW PROJECT →" on work items)
- Cinematic scroll animations with GSAP ScrollTrigger (image reveals, parallax, staggered entrances)
- Editorial/art-directed irregular work grid (varying sizes, not a 3-column template)
- Magnetic buttons, text-scramble hover, discipline hover interactions
- Work page filtering with animated transitions
- Full project overlay with prev/next navigation and keyboard (Arrow keys, Escape)
- Fully responsive (desktop → laptop → tablet → mobile) with intentional mobile compositions
- `prefers-reduced-motion` support — disabled animations still show complete content
- Semantic HTML, ARIA labels, keyboard accessible

## Tech

- Vanilla HTML5 / CSS3 (custom properties, grid, clamp() fluid type)
- JavaScript (ES6+) with **GSAP 3.12.5** + ScrollTrigger via CDN
- Font: **Inter** (Google Fonts)

## Getting Started

Serve the folder with any static server, e.g.:

```bash
npx serve .
```

or just open `index.html` in a browser (note: GSAP loads from CDN, so an internet connection is needed for animations).

## Replacing the Assets

Project visuals currently use styled gradient placeholders in the HTML (`<div class="image-placeholder">`). To add real work:

1. Drop images into `assets/images/` and video files into `assets/videos/`
2. Replace each `.image-placeholder` with `<img src="assets/images/your-file.jpg" alt="...">` or a `<video autoplay muted loop>` element
3. Update project copy in `js/main.js` (`projectData`) and `project.html`

## Contact

hello@kamsiokoro.com