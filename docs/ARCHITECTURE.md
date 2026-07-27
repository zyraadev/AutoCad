# Architecture

## Overview

Zyra's Dream House Floor Plan Viewer is a single-page application built with vanilla HTML, CSS, and JavaScript. It renders PDF floor plans using PDF.js with a custom camera/viewport system for smooth pan and zoom interactions.

## System Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
├─────────────────────────────────────────────────┤
│  index.html                                      │
│  ├── styles.css (dark theme, layout, responsive) │
│  └── app.js (viewer engine)                      │
├─────────────────────────────────────────────────┤
│  PDF.js (CDN)                                    │
│  └── pdf.worker.min.js (Web Worker)              │
├─────────────────────────────────────────────────┤
│  Static PDF files                                │
│  └── My DreamHouse Residential-Floor-Plan/*.pdf  │
└─────────────────────────────────────────────────┘
```

## Module Breakdown

### Camera System (`app.js`)

The camera is a plain object tracking position (`x`, `y`) and zoom (`scale`, `targetScale`). The `update()` loop runs via `requestAnimationFrame`, interpolating `scale` toward `targetScale` each frame for smooth transitions.

```
camera = {
  x, y              — pan offset in screen pixels
  scale, targetScale — current and target zoom level
  minScale, maxScale — zoom bounds (0.1 to 10)
  velocityX, velocityY — inertia momentum
  dragging           — mouse drag state
}
```

### Rendering Pipeline

1. `loadSheet(index)` — loads PDF document, caches it, triggers render
2. `rerenderPDF()` — renders PDF page to offscreen canvas at `renderScale * devicePixelRatio`, then blits to visible canvas in one frame (double-buffering)
3. `update()` — applies camera transform to `canvasContainer` via CSS `translate()` + `scale()`
4. `renderMiniMap()` — renders PDF thumbnail into minimap canvas

### Multi-Sheet Support

Sheets are defined in a `sheets[]` array with `name` and `file` path. Loaded PDFs are cached in a `Map` to avoid re-fetching. Thumbnails are pre-rendered at 0.18x scale into the sidebar.

### Minimap

The minimap renders the current PDF page at a fixed scale (~170x120px). The viewport indicator (`#miniViewport`) position is calculated from camera offset and scale, showing what portion of the floor plan is currently visible.

### Controls

- **Mouse pan** — mousedown/mousemove/mouseup with inertia (velocity decays at 0.90/frame)
- **Scroll zoom** — wheel events with cursor-anchored zoom (zooms toward mouse position)
- **Double-click** — 2x zoom at cursor position
- **Keyboard** — number keys switch floors, +/- zoom, arrows pan, 0 fits
- **Toolbar buttons** — zoom in/out, reset, fit, fullscreen

## CSS Architecture

- CSS custom properties for theming (`--bg`, `--surface`, `--accent`, etc.)
- BEM-like naming without formal BEM (`.sheet-thumb`, `.sheet-info`, `#canvasContainer`)
- Responsive breakpoints at 1100px, 900px, 700px, 550px
- Floating UI elements use `backdrop-filter: blur()` for glassmorphism

## External Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| PDF.js | 3.11.174 | PDF parsing and rendering |
| Inter font | 300-700 | Typography |

No build tools, bundlers, or package managers required.
