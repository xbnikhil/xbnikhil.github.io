# Nikhil's Portfolio

My personal portfolio website — built with **React + Vite + React Router**, and deployed automatically to **GitHub Pages** on every push to `main`.

**Live site:** https://xbnikhil.github.io/

> 📓 Project activity and decision history is tracked in [`PROJECT_LOG.md`](./PROJECT_LOG.md).

## Tech stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) (client-side routing, no page reloads)
- GitHub Actions (build & deploy)

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

## Deployment

Every push to `main` triggers the workflow in `.github/workflows/deploy.yml`, which builds the site and deploys it to GitHub Pages.

- **Live URL:** https://xbnikhil.github.io/
- **Actions:** https://github.com/xbnikhil/xbnikhil.github.io/actions

### How changes go live

```bash
git add .
git commit -m "your message"
git push
```

The site updates automatically within a minute or two. ✅

## Project structure

```
src/
  components/   # Navbar, Footer, Reveal (scroll animations), Marquee
  pages/        # Home, About, Projects, Contact, NotFound
  main.jsx      # App entry (BrowserRouter)
  App.jsx       # Routes + page transitions
  index.css     # Design system, animations, responsive styles
```
