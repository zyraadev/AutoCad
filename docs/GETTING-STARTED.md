# Getting Started

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- A local HTTP server (PDF.js cannot load files via `file://` due to CORS)

## Quick Start

### 1. Clone or download the project

```bash
git clone <repository-url>
cd AutoCad
```

### 2. Start a local server

Choose one:

```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080

# Node.js (npx)
npx serve .

# PHP
php -S localhost:8080

# VS Code
# Install "Live Server" extension, then right-click index.html → "Open with Live Server"
```

### 3. Open in browser

Navigate to `http://localhost:8080`. The viewer loads Floor 1 automatically.

## What You'll See

- **Left sidebar** — floor selector with thumbnail previews
- **Main viewer** — the PDF floor plan with pan/zoom controls
- **Floating toolbar** — zoom, reset, fit, fullscreen buttons
- **Minimap** (bottom-right) — viewport indicator on the floor plan
- **Status bar** (bottom-center) — zoom level, current floor, cursor coordinates

## Basic Navigation

| Action | How |
|--------|-----|
| Pan | Click and drag |
| Zoom | Scroll wheel (zooms toward cursor) |
| Switch floor | Click floor in sidebar, or press `1`/`2` |
| Fit to screen | Click fit button, or press `0` |
| Fullscreen | Click fullscreen button |
| Collapse sidebar | Click hamburger icon (top-left) |

## Adding More Floors

To add a third floor, edit `app.js`:

1. Place the PDF in `My DreamHouse Residential-Floor-Plan/`

2. Add an entry to the `sheets` array:
   ```javascript
   const sheets = [
     { name: "Floor 1", file: "My DreamHouse Residential-Floor-Plan/floor1.pdf" },
     { name: "Floor 2", file: "My DreamHouse Residential-Floor-Plan/floor2.pdf" },
     { name: "Floor 3", file: "My DreamHouse Residential-Floor-Plan/floor3.pdf" }
   ];
   ```

3. Add a matching button in `index.html` inside `#sheetList`:
   ```html
   <button class="sheet">
     <div class="sheet-thumb"></div>
     <div class="sheet-info">
       <strong>Floor 3</strong>
       <small>Basement</small>
     </div>
   </button>
   ```

4. Add a keyboard shortcut in the keydown handler:
   ```javascript
   if (e.key === "3") loadSheet(2);
   ```
