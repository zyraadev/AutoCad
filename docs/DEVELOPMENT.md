# Development

## Project Type

Static HTML/CSS/JS — no build step, no bundler, no package manager.

## File Overview

| File | Lines | Purpose |
|------|-------|---------|
| `index.html` | ~193 | HTML structure, sidebar, viewer, toolbar, minimap, status bar |
| `styles.css` | ~990 | Dark theme, layout, responsive breakpoints, animations |
| `app.js` | ~765 | PDF loading, camera system, rendering, controls, multi-sheet |

## Development Workflow

### Running Locally

```bash
cd AutoCad
python -m http.server 8080
# Open http://localhost:8080
```

Edit files directly — refresh the browser to see changes. No compilation needed.

### Code Organization in `app.js`

The file is organized into labeled sections:

```
ELEMENTS        — DOM references
CAMERA          — camera state object
PDF             — pdf/page state variables
LOAD PDF        — loadPDF() function
RENDER PDF      — rerenderPDF() with double-buffering
FIT PAGE        — fitPage() to center/scale PDF
UPDATE          — main render loop (requestAnimationFrame)
MINIMAP         — renderMiniMap(), updateMiniMap()
MOUSE PAN       — mousedown/mousemove/mouseup handlers
CURSOR          — cursor position tracking
SMOOTH CAMERA   — wheel zoom handler
INERTIA         — momentum decay loop
DOUBLE CLICK    — 2x zoom on dblclick
KEYBOARD        — keydown handler
TOOLBAR         — button click handlers
SIDEBAR TOGGLE  — hamburger menu
FULLSCREEN      — fullscreen API
RESIZE          — window resize handler
MULTI SHEET     — sheets array, loadSheet(), cache
GENERATE THUMBNAILS — sidebar thumbnail rendering
STATUS BAR      — zoom/floor/cursor display
STARTUP         — loadSheet(0)
```

### CSS Architecture

- **Design tokens** — CSS custom properties in `:root` for colors, spacing, shadows
- **Layout** — Flexbox for sidebar/main split, absolute positioning for floating UI
- **Responsive** — 4 breakpoints: 1100px, 900px, 700px, 550px
- **Animations** — `@keyframes` for fadeIn, pulse; CSS transitions for hover states

### Key Patterns

**Double-buffered rendering:**
PDF renders to an offscreen canvas first, then blits to the visible canvas in one `drawImage()` call. This eliminates the white flash that occurs when clearing and re-rendering.

**Camera interpolation:**
`camera.scale` lerps toward `camera.targetScale` at 0.18 factor per frame. This creates smooth zoom transitions without abrupt jumps.

**PDF caching:**
Loaded PDF documents are stored in a `Map` keyed by sheet index. Subsequent visits to the same floor skip the network request.

**Cursor-anchored zoom:**
When zooming with the scroll wheel, the world point under the cursor stays fixed. This is calculated by converting screen coordinates to world coordinates, scaling, then converting back.

## Browser Compatibility

Tested on:
- Chrome/Edge 90+
- Firefox 90+
- Safari 14+

Requires:
- `requestAnimationFrame`
- CSS `backdrop-filter` (falls back gracefully)
- Fullscreen API
- PDF.js Web Worker support

## Performance Notes

- Render scale is fixed at 3x (not adaptive) to avoid re-render flash
- Thumbnails render at 0.18x scale
- Minimap renders at ~170x120px
- Inertia decays at 0.90 per frame
- Status bar updates every 100ms via `setInterval`
