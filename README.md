# SAMIP UDAS — EA FC 25 Style Portfolio

An interactive personal portfolio website built as a single-page React application, themed after EA FC 25's Ultimate Team interface. The site presents resume content — education, work experience, technical skills, projects, and leadership — through FIFA-inspired UI patterns like player cards, squad formations, match results, and transfer bids.

**Live Stack:** React (no external dependencies) · CSS-in-JS · SF Pro Display font stack

---

## Architecture

The app uses a simple client-side page router (`useState`) with four views:

```
Landing Page (Hub)
├── Overview Page   → Player card + stat radar
├── Career Page     → Education + work experience + skills formation
└── Matches Page    → Projects + leadership
```

No React Router or external libraries required. Navigation is handled through state, and each page transition includes a fade-in animation.

---

## Pages & Sections

### Landing Page

The entry point. Contains three navigation boxes styled as FUT gold player cards and a contact section.

- **Navigation Boxes** — Three clickable cards (Overview, Career, Matches) with gold shimmer overlays, hover-lift animations, and accent-colored top borders. Each displays a subtitle, description, and faded rating watermark. Clicking routes to the corresponding page.
- **Contact Section ("Submit Transfer Bid")** — Email and phone as interactive links, plus GitHub/LinkedIn buttons with gold gradient styling. Sits directly below the navigation boxes.
- **Footer** — Minimal branding line.

### Overview Page

The player profile view.

- **Player Card** — A 400×560px FUT TOTY-style card showing an overall rating (92), position (DEV), club badge (CU), avatar placeholder (initials), name, and a 3×2 stat grid (PYT, JAV, SQL, DAT, ML, LDR). Includes a shimmer animation and floating hover effect.
- **Stat Radar (Hexagon)** — An SVG-rendered hexagonal chart plotting six skill attributes. Three concentric grid layers with connecting spokes. The filled polygon uses green (#00e5a0) against gold gridlines.
- **Bio Text** — Name, tagline ("Team of the Year Nominee"), and a short summary paragraph.

### Career Page

Education, work history, and technical skills.

- **Education ("Club History")** — A card with a crimson Caldwell University banner, animated GPA counter (3.92), Dean's List count (7x), and coursework listed as green "Training Module" badges.
- **Work Experience ("Transfer History")** — Two transfer-style cards (IT Technician, Student Researcher) each showing a season badge, key stat row, and bullet-point highlights. Cards animate in with staggered fade-slide-up.
- **Technical Skills ("Squad Builder")** — An interactive football pitch rendered in CSS with 11 skill "players" in a 3-4-3 formation. Each player is a mini card showing position abbreviation, rating, and skill name. Cards scale on hover.

### Matches Page

Projects and leadership.

- **Projects ("Match Highlights")** — Two match result cards (Financial Data Reconciliation, Food Recognition App) with match type labels, completion status badges, tech stack pill tags, and bullet-point details.
- **Leadership ("Captain's Armband")** — A single card for the NSO President role with a gold "C" captain badge, stat row ($5000+ budget, 500+ attendees, Tihar flagship event), and highlight bullets. The card has a pulsing gold glow animation.

---

## Visual Design System

| Element | Value |
|---|---|
| Primary Background | `#0a0b0f` (near-black) |
| Gold Accent | `#d4a843` / `#f0d078` (light) / `#8a6d2b` (dark) |
| Green Accent | `#00e5a0` (stats, badges) |
| Blue Accent | `#00b4ff` (status indicators) |
| Font Stack | SF Pro Display → -apple-system → BlinkMacSystemFont → Helvetica Neue |
| Card Style | Dark gradient backgrounds with 1px gold borders, shimmer overlays |

### Background Layers (FUT Texture)

The background is composed of seven fixed layers stacked via `position: fixed`:

1. Dark radial gradient base
2. Gold ambient glow (top-left)
3. Gold ambient glow (bottom-right)
4. 45° diagonal line pattern (opacity 0.025)
5. Horizontal scanlines (opacity 0.015)
6. Dot grid pattern (opacity 0.012)
7. Radial vignette
8. 12 floating gold particles with staggered CSS animations

---

## Setup

```bash
npx create-react-app fifa-portfolio
cd fifa-portfolio
```

Replace `src/index.js`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import FIFAPortfolio from './FIFAPortfolio';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FIFAPortfolio />);
```

Copy `FIFAPortfolio.jsx` into `src/`, then:

```bash
npm start
```

Add `<style>* { margin: 0; padding: 0; box-sizing: border-box; }</style>` to `public/index.html` `<head>` for clean rendering.

---

## Customization Points

- **Avatar** — Replace the `SU` initials div in `PlayerCard` with an `<img>` tag
- **Social Links** — Update the `window.open("#")` calls in the contact section with actual GitHub/LinkedIn URLs
- **Ratings/Stats** — All skill ratings are defined as plain numbers in each component's data arrays
- **Colors** — All colors are centralized in the `COLORS` object at the top of the file
- **Navigation Box Images** — The three landing page boxes have placeholder areas ready for background images
- **Content** — All resume text is stored as plain strings in component-level data arrays, not in a separate data file

---

## File Structure

```
src/
└── FIFAPortfolio.jsx    ← Entire app (single file, ~600 lines)
```

Everything — components, styles, data, routing — lives in one file for portability. No external CSS, no asset dependencies, no API calls.
