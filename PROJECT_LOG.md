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

### 2026-10-25 — New header brand

**Changed**
- Header wordmark changed from “nikhil” to “littleCorner” in Space Grotesk (a distinctive geometric font loaded from Google Fonts).
- Logo changed from the single “N” tile to a colorful “xb.” mark made of three flat, sharp-cornered color blocks: green `x`, purple `b`, orange `.` (no gradients).
- Brand text now stays visible down to phones; hidden only below 640px to save space.
- Logo mark lifts slightly on hover.

---

### 2026-10-25 — Marquee restyled to match running-bar reference

**Changed**
- Replaced the single lime strip with flat colored blocks separated by gaps on the off-white canvas: bright green `#60ff90`, light purple `#b080ff`, and a gold `#c0a010` block every fifth item.
- Text switched to a monospace ticker style with a trailing “↗” arrow instead of ✦ separators.
- Marquee items rewritten in sentence case (“Coming soon”, “Colorful by design”, etc.).
- Strip now uses thin hairlines instead of heavy ink borders, with the same infinite scroll + pause-on-hover behavior.

---

### 2026-10-25 — Hero headline copy

**Changed**
- Hero headline changed from “A happy little corner of the internet.” to “My little corner of the internet.”
- Updated the page title and meta description to match.

---

### 2026-10-25 — Interactive CSS dog in the hero

**Changed**
- Added `HeroDog.jsx`: a dog drawn entirely with CSS (body, head, ears, legs, tail, eyes, nose, mouth, purple collar) — no images.
- The dog roams slowly along the bottom of the hero section.
- Its pupils follow the mouse cursor, and its head tilts slightly toward the pointer.
- Clicking anywhere on the page makes the dog jump happily.
- Clicking the dog hides it at the bottom-right corner of the page; it peeks out, then returns to roaming after ~3.5 seconds.
- Keyboard accessible (Enter/Space), with a focus outline; animations respect reduced motion.
- Hero now clips overflow horizontally so roaming stays contained.

---

### 2026-10-25 — Detailed animated SVG dog

**Changed**
- Rebuilt `HeroDog.jsx` from blocky CSS shapes into a layered SVG character: four articulated legs, layered chest/body fur, floppy ears, wagging tail, expressive eyes with highlights and lids, brows, muzzle, freckles, nose highlight, tongue, purple collar with gold tag, soft shadow, and speed lines/sparkles.
- Art faces right; turning is a single `scaleX(var(--facing))` flip on `.dog-face`, with a springy transition so the dog visibly turns around.
- Chase loop now runs on a `requestAnimationFrame` state machine constrained to the hero's bottom lane; speed scales with distance (walk vs. run gait), and idle wandering takes over ~5s after the cursor stops.
- Eyes track the cursor; the head tilts toward it, and both look away shyly during the shy/return phases.
- Three distinct jump routines (`jump-1/2/3`) picked at random and never repeated back-to-back: a straight hop, a double bounce, and a big twisting leap, each with squash/stretch, paddling legs, sparkles, and a pulsing shadow.
- Dog click sequence: blush + drooped ears/head + tucked tail + wavy mouth → sprint to the viewport's bottom-right corner → hide → peek back into the page → return to mid-hero shy → resume chasing.
- Dog gained a dedicated lane in the hero (`--dog-size` plus matching `padding-bottom`) so it never overlaps the badges; the old scroll hint was removed to offset the extra height, and a short-screen query keeps the color strip above the fold down to 360×640.
- `pageIn` page transition is now opacity-only: its former `translateY` created a containing block for `position: fixed`, which offset the dog's corner peek by the 73px header.
- Keyboard accessible (Enter/Space) with `aria-label` and a focus ring; `prefers-reduced-motion` parks the dog and disables the chase.

**Notes**
- Verified in headless Chrome: all phases and expressions fire, jump variants alternate, peek lands at the viewport corner, return lands inside the hero, no console errors, no horizontal overflow, and dog colors render as intended (amber `#e9ae64`, cream `#f7e6c8`, brown `#a96a2f`, ink `#3f2817`, purple `#6040f0`).

---

### 2026-10-25 — Simple WALL-E-style robot pet (art replacement)

**Changed**
- Replaced the detailed dog SVG with a simpler chibi robot companion: beige `#f0e6d2` body with rust `#c05000` accents, big round lens eyes `#2b2b2b`, single head antenna, side-panel ears, tread feet, chest button, and rosy blush cheeks — while keeping every behavior identical.
- Same hero bottom-lane chase, cursor tracking, head tilt, blink, three jump variants (random, never consecutive), and the shy → corner flee → peek → return sequence.
- All behavior class names (`dog-leg`, `dog-eye`, `dog-ear`, `dog-tail`, `dog-shadow`, `dog-spark`, `dog-mouth`, `dog-blush`, `dog-brows`) kept so the existing CSS animations still drive movement; head orientation is owned by the JS transform attribute rather than CSS to avoid double transforms.
- Head rotation pivot moved to center (`105 72`) to match the robot's centered head.

**Notes**
- Verified in headless Chrome: mount, chase left/right, jump variants alternate, peek lands at `x≈1326 y≈823`, return inside hero, zero console errors. Colors pixel-verified (`#f0e6d2`, `#faf6ec`, `#4a3728`, `#e0d4b8`).

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
