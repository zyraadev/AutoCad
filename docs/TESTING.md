# Testing

## Current State

This project has no automated tests. It is a static HTML/CSS/JS application with no test framework, test runner, or CI/CD pipeline configured.

## Manual Testing Checklist

### Core Functionality

- [ ] Page loads without console errors
- [ ] Floor 1 PDF renders correctly on load
- [ ] Floor 2 PDF renders correctly when selected
- [ ] Floor switching updates header title and status bar
- [ ] Thumbnails appear in sidebar for both floors

### Camera Controls

- [ ] Mouse drag pans the view smoothly
- [ ] Scroll wheel zooms toward cursor position
- [ ] Double-click zooms 2x at click point
- [ ] Inertia continues panning after mouse release
- [ ] Zoom level clamps between 10% and 1000%
- [ ] `+`/`-` keys zoom in/out
- [ ] Arrow keys pan the view
- [ ] `0` key fits page to screen
- [ ] `1`/`2` keys switch floors

### UI Elements

- [ ] Floating toolbar buttons work (zoom in, zoom out, reset, fit, fullscreen)
- [ ] Sidebar collapses/expands via hamburger button
- [ ] Fullscreen enters/exits correctly
- [ ] Status bar shows correct zoom percentage
- [ ] Status bar shows correct floor name
- [ ] Status bar shows cursor coordinates

### Minimap

- [ ] Minimap renders floor plan thumbnail
- [ ] Blue viewport indicator tracks pan position
- [ ] Blue viewport indicator tracks zoom level
- [ ] Viewport indicator stays within bounds at extreme zoom

### Responsive

- [ ] Sidebar collapses to off-canvas on mobile (<900px)
- [ ] Toolbar repositions on smaller screens (<700px)
- [ ] Status bar adapts on narrow screens (<550px)
- [ ] Touch/mouse interactions work on mobile

### Visual

- [ ] No white flash on initial load
- [ ] No flash when switching floors
- [ ] Dark theme renders correctly
- [ ] Logo image displays in sidebar
- [ ] Thumbnails render with white backgrounds

## Browser Testing Matrix

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | Test | Test |
| Firefox | Test | Test |
| Edge | Test | — |
| Safari | Test | Test |

## Known Issues

- PDF.js requires HTTP server — `file://` protocol will fail with CORS errors
- Large PDF files may cause brief loading delays on slow connections
- `backdrop-filter: blur()` not supported in older browsers (graceful fallback)
