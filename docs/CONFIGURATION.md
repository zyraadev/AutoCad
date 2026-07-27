# Configuration

## Overview

This project has no configuration files, environment variables, or build configuration. All settings are hardcoded in the source files.

## Customizable Constants

### Camera Settings (`app.js`)

| Constant | Value | Location | Description |
|----------|-------|----------|-------------|
| `camera.minScale` | `0.1` | Line 32 | Minimum zoom level (10%) |
| `camera.maxScale` | `10` | Line 33 | Maximum zoom level (1000%) |
| `renderScale` | `3` | Line 51 | PDF render resolution multiplier |
| Zoom factor | `1.12` | Line 327 | Scroll wheel zoom step (12% per tick) |
| Inertia decay | `0.90` | Line 381 | Pan momentum decay per frame |
| Lerp factor | `0.18` | Line 153 | Smooth zoom interpolation speed |

### Minimap Settings (`app.js`)

| Constant | Value | Description |
|----------|-------|-------------|
| Fit scale | `Math.min(170/pageW, 120/pageH)` | Minimap thumbnail scale |
| Viewport clamping | `5%–100%` | Minimap viewport indicator bounds |

### PDF Files (`app.js`)

```javascript
const sheets = [
  {
    name: "Floor 1",
    file: "My DreamHouse Residential-Floor-Plan/Autodesk Viewer _firstfloor.pdf"
  },
  {
    name: "Floor 2",
    file: "My DreamHouse Residential-Floor-Plan/Autodesk Viewer _ SecondFloor.pdf"
  }
];
```

Change `name` to update display labels. Change `file` to point to different PDFs.

### CSS Design Tokens (`styles.css`)

```css
:root {
  --bg: #171717;              /* Page background */
  --surface: #202124;         /* Sidebar/header background */
  --surface-2: #26282b;       /* Hover states */
  --surface-3: #2d3136;       /* Elevated surfaces */
  --border: rgba(255,255,255,.07); /* Subtle borders */
  --text: #f5f5f5;            /* Primary text */
  --muted: #9ca3af;           /* Secondary text */
  --accent: #3b82f6;          /* Blue accent (buttons, minimap) */
  --danger: #ef4444;          /* Error color (unused) */
  --shadow: 0 10px 40px rgba(0,0,0,.35); /* Drop shadow */
  --radius: 14px;             /* Border radius */
  --transition: .18s cubic-bezier(.2,.8,.2,1); /* Animation timing */
  --sidebar-width: 300px;     /* Sidebar width (expanded) */
}
```

### Responsive Breakpoints (`styles.css`)

| Breakpoint | Changes |
|------------|---------|
| `≤1100px` | Sidebar narrows to 260px |
| `≤900px` | Sidebar goes off-canvas, toggle via hamburger |
| `≤700px` | Toolbar repositions, status bar shrinks |
| `≤550px` | Header title hides, status bar full-width |

## External Dependencies

| Dependency | CDN URL | Version |
|------------|---------|---------|
| PDF.js | `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js` | 3.11.174 |
| PDF.js Worker | `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js` | 3.11.174 |
| Inter font | `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap` | — |
