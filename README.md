# Selvaragavan M — Portfolio

A cinematic, dark Batman × Red Hood inspired portfolio built with **Vite + React 18 + TypeScript + React Router 6**. No animation library, no icon library, no UI framework — the motion system runs on the native **View Transitions API** + `IntersectionObserver` + hand-tuned CSS, and every icon is a hand-drawn SVG component.

---

## ⚠️ Before you do anything: run the install yourself

This project was hand-written in an environment with **no network access**, so I was not able to run `npm install`, start the dev server, or run a production build to verify it end-to-end. Every file was written and manually cross-checked (imports, CSS-module class names, and a best-effort TypeScript pass — see **Validation notes** below), but you are the first person who will actually boot this app. Please run it locally before you consider it "done":

```bash
npm install
npm run dev
```

Then open the printed local URL. If anything doesn't compile, it's most likely a small typo I couldn't catch without a real TypeScript/React install — check the terminal error, it will point straight at the file and line.

---

## Tech stack & why

| Choice | Reasoning |
|---|---|
| **Vite** | Fast dev server, simple static output, no server required — matches the "frontend-only unless a real requirement demands a backend" instruction. |
| **React 18 + TypeScript** | Requested explicitly; strict mode is on. |
| **React Router 6** | Real client-side routing across the 6 primary routes + `/projects/:slug`. |
| **No Framer Motion** | The brief allows "Framer Motion or an equivalent." Route transitions use the native **View Transitions API** (`document.startViewTransition`, wrapped with `flushSync` for correct timing) with a CSS fallback for unsupported browsers — one fewer dependency, and it's the direction the web platform itself is moving. Scroll reveals use `IntersectionObserver`. Everything else is CSS keyframes/transitions. |
| **No icon library** | 22 hand-built SVG icons in `src/icons/icons.tsx`, matching the tactical/cyber-noir line language instead of a generic icon set. |
| **CSS Modules + design tokens** | `src/styles/tokens.css` is the single source of truth for color, type, spacing, radius, shadow and motion timing — change the accent red or the whole palette in one file. |

---

## Local development

```bash
npm install
npm run dev        # start dev server
npm run build       # type-check + production build to dist/
npm run preview     # preview the production build locally
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
```

---

## Architecture

```text
src/
├── App.tsx                  # <BrowserRouter> + route table
├── main.tsx                 # React root + global CSS imports
├── styles/                  # tokens.css, globals.css, utilities.css
├── types/index.ts            # every content shape (Project, Service, Award, ...)
├── data/                    # ALL editable content lives here — see below
│   ├── profile.ts            # identity, headline, bio, socials
│   ├── experience.ts         # work history + Objectways start-date logic
│   ├── skills.ts              # 8 skill modules + languages/tools
│   ├── projects.ts            # the 7 case files
│   ├── services.ts            # the 9 mission modules
│   ├── credentials.ts         # awards, education, certifications
│   └── site.ts                 # navigation + external link inventory
├── hooks/                   # useMotionHooks.ts, useSwipeNavigation.ts
├── lib/viewTransition.ts     # native View Transitions helper
├── icons/icons.tsx           # hand-built SVG icon set
├── components/
│   ├── layout/                # SiteShell, CinematicNav, RouteLink, Footer
│   ├── effects/                # BackgroundFX, CustomCursor, Preloader
│   ├── ui/                     # Button, Tag, SectionLabel, PageHeader, Reveal…
│   ├── hero/                   # Hero.tsx (Home entrance sequence)
│   ├── shared/                 # Timeline + AwardsWall (reused across pages)
│   ├── about/                  # IdentitySection, SkillsMatrix
│   ├── services/               # ServiceCard
│   ├── projects/               # ProjectCard, ProjectFilter
│   └── contact/                 # ContactForm, ContactChannels
└── pages/                    # one file per route, composed from the above
```

Pages never hold content — they only compose components and pull from `src/data/`. To restyle or restructure a page, edit the page + its `.module.css`. To change *what it says*, edit `src/data/`.

### Routing & the "signal sweep" page transition

Every internal link goes through `components/layout/RouteLink.tsx`, a small wrapper around `useNavigate()`/`useLocation()` that calls `document.startViewTransition()` (via `lib/viewTransition.ts`) around the navigation. The CSS in `styles/globals.css` (`::view-transition-old/new`) defines a crimson wipe/fade — the searchlight-sweep motif that also shows up as the hover-scan on project cards and the scroll cue on Home. Browsers without View Transitions support (or with `prefers-reduced-motion` on) just navigate instantly — no broken animation, no dependency.

### Mobile swipe navigation

`hooks/useSwipeNavigation.ts` listens for horizontal touch gestures on the main content area and moves forward/backward through the primary nav order (`data/site.ts`), using the same view-transition helper.

### Reduced motion & touch

Every animated piece — background scanline, custom cursor, video autoplay, preloader, scroll reveals, page transitions — checks `prefers-reduced-motion` and/or coarse-pointer (touch) via `hooks/useMotionHooks.ts` and degrades gracefully rather than disabling the page.

---

## Editing content

### Add a new project

Edit `src/data/projects.ts` and push a new object into the `projects` array (see the existing 7 for the shape — `types/index.ts` has the full `Project` interface). Drop the matching video/poster into `public/assets/projects/` — see that folder's `README.md` for exact filenames and fallback behavior. No component changes needed.

### Add a new experience entry

Edit `src/data/experience.ts` and push a new object into the `experience` array. The `Timeline` component (`components/shared/Timeline.tsx`) picks it up automatically on the About page. Use `status: "current" | "completed" | "upcoming"` to control the timeline dot/badge color.

### Replace images, the bat watermark, or the resume PDF

See `public/assets/README.md`. Filenames are fixed; drop the file in and the built-in fallback (inline SVG bat / monogram avatar / hidden download button) is automatically replaced.

### Change the color palette, type scale, or motion timing

Everything lives in `src/styles/tokens.css` as CSS custom properties. Changing `--color-red-signal` alone will re-theme every accent across the entire app.

---

## Assumptions that need your confirmation

1. **Employment overlap** — both Robential Kinetics (Dec 2025–Present) and Objectways Technologies (Aug 10 2026–Present) are shown as currently active, per the supplied source data. The About page includes a small note flagging this; update `src/data/experience.ts` if the actual engagement type (full-time/part-time/parallel) differs.
2. **No live assets were supplied** to this build session — project videos, the bat silhouette PNG, hero portrait, resume PDF and favicon source art weren't included as uploaded files, so the site ships with fully designed, functional fallbacks (inline SVG bat, CSS-drawn poster placeholders, a hand-built favicon rasterized to PNG, a custom-drawn cursor) instead of guessed placeholder images. Drop your real files in per the two asset READMEs to upgrade automatically.
3. **Certificate links** — AWS, Udemy, IIT Madras, Wadhwani Foundation, LeSuccess and Amypo Technologies certifications are listed but marked "Unverified" with no link, exactly as the source instructed ("do not create placeholder URLs that look real"). Add a `url` and flip `verified: true` in `src/data/credentials.ts` once you have them.
4. **Missing links** — the AI QA Test-Case Generator, PolicyLens live demo, Truck Parking repo, and ZKBot video are absent from the supplied source and are left empty/omitted rather than guessed.

---

## Deployment recommendation

**Vercel** is the better default here even though this is a Vite (not Next.js) app — it auto-detects Vite, has excellent static-asset caching, and your existing live portfolio link (`selvaragavan-dev.vercel.app`) is already on Vercel, so it's a drop-in replacement. **Netlify** is an equally valid alternative for a static Vite build if you'd rather diversify away from Vercel — both are frontend-only static hosts and either is sufficient since this app has no server component.

Before shipping:

- Set the build command to `npm run build` and the output directory to `dist/`.
- No environment variables are required for the current feature set (everything is static data + a `mailto:` contact fallback).
- **Video hosting**: keep short, compressed previews (10–20s, well under a few MB each) in `public/assets/projects/` for simplicity. If you outgrow that, move them to object storage (e.g. Cloudflare R2, S3) or a media host and just update the `video` path in `src/data/projects.ts` — component code doesn't need to change either way.
- A real contact backend, CMS-managed projects, analytics, or an admin dashboard would each need a small serverless function or separate backend — none of that exists today, and the Contact page is explicit in the UI that submitting opens a pre-filled `mailto:` link rather than posting to a server.

---

## Validation notes (what I could and couldn't check here)

I don't have network access in this build environment, so I could not run `npm install`, `vite dev`, or `vite build`. To compensate, I:

- Manually cross-referenced every `styles.xxx` usage in every component against its `.module.css` file to catch typos (and fixed the ones I found).
- Ran the TypeScript compiler against the source with a best-effort config (ignoring the expected "module not found" noise from the absent `node_modules`) to catch real type/syntax errors, and fixed everything it surfaced (a couple of `React.X` namespace references that needed explicit type imports, one unused import).
- Manually reviewed routing, prop flow, and accessibility attributes (focus trap, `aria-*`, keyboard handling) by reading, not by running.

What I could **not** do: actually render the app, click through it, or confirm pixel-level layout. Please run `npm run build` (and ideally `npm run dev` and click through all 6 routes + a project detail page + the mobile nav) before treating this as production-ready, and use the browser console to catch anything that slipped through.
