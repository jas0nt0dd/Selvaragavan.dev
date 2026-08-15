# Site assets

Drop these files into this folder with the exact names below to replace the
built-in fallbacks. No code changes are required.

| File | Purpose | Current fallback |
|---|---|---|
| `bat-black-silhouette-with-opened-wings.png` | Large background watermark used on every page | Hand-drawn inline SVG bat |
| `hero-portrait.jpg` | Portrait shown in the About → Identity section | Geometric "SM" monogram frame |
| `resume.pdf` | Downloadable resume on the Credentials page | Download button hides itself automatically until this file exists |

`favicon-16x16.png`, `favicon-32x32.png` and `apple-touch-icon.png` have
already been generated from the hand-built `public/favicon.svg` bat emblem,
so the favicon works out of the box. Replace them here if you'd rather use
your own artwork — filenames must stay the same.

A custom pointer image was requested but a custom, hand-drawn crimson
reticle cursor (`src/components/effects/CustomCursor.tsx`) is built in and
active by default — no image asset needed. It automatically disables itself
on touch devices and when the user has `prefers-reduced-motion` enabled.
