# Project media

Drop your project videos and poster images into this folder using the exact
filenames below. Nothing else needs to change — `src/data/projects.ts`
already points at these paths, and every card/detail view gracefully falls
back to a "no preview on file" panel until the file exists.

| File | Used by |
|---|---|
| `armurai.mp4` / `armurai-poster.jpg` | ArmurAI — Autonomous Pentesting Framework |
| `gnn-malware.mp4` / `gnn-malware-poster.jpg` | GNN Malware Detector |
| `mlops-incident.mp4` / `mlops-incident-poster.jpg` | MLOps Incident Response Environment |
| `truck-parking.mp4` / `truck-parking-poster.jpg` | Smart Truck Parking Management System |
| `policylens-poster.jpg` | PolicyLens AI (poster only — no video supplied) |
| `testcase-gen-poster.jpg` | AI-Powered Intelligent Test Case Generator (poster only) |
| `zkbot-poster.jpg` | ZKBot — Autonomous Cup Washing Robot (poster only; add `zkbot.mp4` too if you have the clip) |

Guidelines:

- Keep videos short (10–20s loops work best) and compress them — large
  files should live in object storage / a media host rather than this repo
  once you deploy (see the main README's deployment section).
- Poster images should be roughly 16:9 for the card grid and detail hero.
- Video previews autoplay muted on hover for pointer devices only; touch
  devices and `prefers-reduced-motion` always show the poster instead.
