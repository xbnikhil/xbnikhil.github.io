# Project Activity Log

All notable activities, decisions, and changes for **Nikhil's Portfolio** are tracked here.

---

## Project Overview

| | |
|---|---|
| **Project** | Nikhil's Portfolio website |
| **Repo** | https://github.com/xbnikhil/xbnikhil.github.io |
| **Live site** | https://xbnikhil.github.io/ |
| **Local folder** | `Desktop/Opencode/Portfolio-Nikhil` |
| **Tech stack** | React 19 + Vite + React Router |
| **Hosting** | GitHub Pages (auto-deploy via GitHub Actions) |

---

## Activity Log

### 2026-10-25 — Project kickoff & first deployment

**Planning**
- Discussed requirements: React portfolio (SPA, no page reloads), design inspired by githubuniverse.com, first version simple, content to be provided later.
- Chose repo name `Nikhil-Portfolio` under GitHub account `xbnikhil`.
- Decided on GitHub Pages with automatic deployment on every push to `main`.

**Setup & build**
- Scaffolded a Vite + React app and moved it to `Desktop/Opencode/Portfolio-Nikhil`.
- Installed dependencies (`npm install`) and `react-router-dom`.
- Added `base: '/Nikhil-Portfolio/'` in `vite.config.js` for GitHub Pages project-site paths.
- Created the app structure:
  - `src/components/Navbar.jsx` — sticky navbar with active link highlighting + GitHub link
  - `src/components/Footer.jsx` — footer with nav links and GitHub link
  - `src/pages/Home.jsx` — hero with headline, description, and CTAs
  - `src/pages/About.jsx`, `Projects.jsx`, `Contact.jsx` — placeholder pages
  - `src/pages/NotFound.jsx` — 404 page
  - `src/App.jsx` — routes; `src/main.jsx` — BrowserRouter entry
  - `src/index.css` — global styles (GitHub Universe-inspired light theme, mono kickers, responsive layout)
- Initial design: light theme, big bold hero typography, accent green, rounded buttons, sticky blurred navbar.

**Deployment**
- Created the GitHub repository `xbnikhil/Nikhil-Portfolio` (public).
- Added `.github/workflows/deploy.yml` — builds on push to `main` and deploys to GitHub Pages (with `404.html` SPA fallback for deep links).
- Enabled GitHub Pages with `build_type: workflow`.
- Pushed `main` and confirmed the first deployment succeeded.
- Verified live site returns HTTP 200 and SPA deep links (e.g. `/projects`) work.
- Set repo homepage to the live URL and added topics: `portfolio`, `react`, `vite`, `github-pages`, `react-router`.
- Cleaned up unused Vite starter assets.
- Wrote project `README.md` with local dev and deployment instructions.

**Verification**
- `npm run build` succeeds.
- GitHub Actions workflow runs completed successfully.
- Live URL: https://xbnikhil.github.io/Nikhil-Portfolio/

**Pending / TODO**
- Replace all placeholder content (name, bio, projects, contact email, social links, resume, photos).
- Replace default favicon with a custom one.
- Design refinements once real content is available (sections, animations, dark mode toggle, etc.).

---

### 2026-10-25 — Colorful redesign & animations (Universe-inspired)

**Direction**
- Feedback: avoid the typical portfolio look (no big photo, no "world-class developer" quote). Wanted a colorful, playful, chill "happy place" vibe similar to githubuniverse.com, with nice animated buttons.
- Note: the reference screenshot couldn't be viewed (model doesn't support image input); button styling is Universe-inspired and can be matched exactly once described.

**Changed**
- Extracted the real GitHub Universe palette from their CSS: cream canvas (`#f7f8f2`), neon lime (`#5fed83`), deep green (`#08872b`), plus purple, orange, yellow, pink, and blue accents.
- Added display font **Bricolage Grotesque** + **Inter** (Google Fonts) for a friendlier personality.
- Rebuilt `src/index.css` as a full design system:
  - Pill buttons with ink borders, hard offset shadows, tilt/lift on hover, and arrows that slide.
  - Sticker-style badges, pastel cards, bold rounded sections with playful shadows.
  - Animated gradient text (`shimmer`), floating gradient blobs, doodles, spinning sparkles.
- Hero rework: cursor-follow glow, floating blobs, rotating/bobbing stickers, animated "hey, I'm Nikhil" pill, scroll hint.
- New components: `Reveal.jsx` (IntersectionObserver scroll animations) and `Marquee.jsx` (infinite scrolling strips).
- Added page-transition animation + scroll-to-top on route change.
- Reworked Home, About, Projects, Contact, and 404 pages with playful, honest placeholder copy and colorful page heroes.
- New gradient favicon; updated `index.html` title, meta description, and font links.
- Full `prefers-reduced-motion` support so animations can be disabled.

**Pending / TODO**
- Match the exact button style from the user's screenshot once described.
- Real content (bio, projects, contact details, socials) still TBD.
- Keep iterating on animations and colorful design details.

---

### 2026-10-25 — Flat minimal redesign (no gradients, square buttons)

**Direction**
- Feedback: the site had too many gradients, and the buttons looked like the WhatsApp website (rounded pill) — not wanted. Requested: 0px button border radius, no gradients anywhere, whole site colorful but minimal.

**Changed**
- Removed every gradient: no gradient backgrounds, gradient text, glows, or blurs.
- Buttons rebuilt: `0px` border radius, flat solid or transparent fills, 1px borders, no shadows; hover simply swaps colors (e.g. ink → lime).
- Simplified the visual language: removed floating blobs, doodles, cursor-follow glow, hard offset shadows, and rotated stickers.
- Sharp corners across the UI, hairline borders, generous whitespace, flat pastel color blocks.
- Added a 6-color segmented strip under the hero for color without noise.
- Reduced to one lime marquee strip; restyled badges/pills/tags as flat squares.
- Cleaned up unused CSS animations/classes (`shimmer`, `float`, `pulse`, blobs, doodles) and removed the now-unneeded hero decoration JSX.
- All button styling now uses only `border-radius: 0` (the single radius declaration in the stylesheet).

**Pending / TODO**
- Confirm the exact button design with the user (screenshots can't be viewed by this model).
- Real content still TBD.

---

### 2026-10-25 — Moved to root GitHub Pages domain

**Direction**
- The site should live at `https://xbnikhil.github.io/` (root user site), not `https://xbnikhil.github.io/Nikhil-Portfolio/`. The logo should point at the root, and the old project subpath should not be the canonical site.

**Changed**
- Created the public repo `xbnikhil/xbnikhil.github.io` (required for a GitHub Pages root site).
- Set `base: '/'` in `vite.config.js` and rebuilt.
- Pushed the site source to the new repo and enabled GitHub Pages (GitHub Actions build) at the root.
- Internal navigation uses React Router relative paths, so the site works unchanged at the root.
- Updated README and this log with the new live URL and repo.
- Unpublished GitHub Pages on the old `Nikhil-Portfolio` repo, so `https://xbnikhil.github.io/Nikhil-Portfolio/` now returns 404 and the root site is the single canonical deployment.
- Verified: root URL 200, deep links (e.g. `/projects`) serve the SPA via `404.html`, and the profile image loads.
- The old `Nikhil-Portfolio` repo remains as an archive.

---

### 2026-10-25 — Added profile photo to About page

**Changed**
- Copied `Desktop/profile.PNG` into `public/assets/profile.png`.
- About page now shows a circular portrait (4px ink border, no gradient) beside the intro text.
- Added `.about-intro` / `.portrait` styles with responsive stacking on smaller screens.

**Notes**
- The photo is served from `public/assets/profile.png`, so it deploys automatically with the site.
- Portrait is intentionally compact (not a giant hero photo) to keep the minimal feel.

---

### 2026-10-25 — Hero trim, shorter hero, photo crop adjustment

**Changed**
- Removed the opener (“Not your average portfolio. No giant photo…” ) from the hero paragraph; the remaining sentence is kept.
- Reduced hero height with fluid padding (`clamp` using `vh`), tighter margins, and a slightly smaller max title size so the color strip is visible without scrolling and adapts to device height.
- Nudged the profile photo up inside the circular crop (`object-position: center 18%`).

---

<!--
Template for future entries:

### YYYY-MM-DD — Short title

**Changed**
- ...

**Decisions**
- ...

**Notes / TODO**
- ...

Remember to commit and push after updating this log.
-->
