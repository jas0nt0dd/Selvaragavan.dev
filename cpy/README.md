# Selvaragavan M — Portfolio Website

A production-ready personal portfolio built as a single `index.html` file.

## 🚀 Deploy to Vercel (3 ways)

### Option 1: Drag & Drop (Fastest — 60 seconds)
1. Go to https://vercel.com and sign in (free account)
2. Click **"Add New Project"** → **"Deploy"**
3. Drag the `portfolio/` folder into the upload area
4. Click **Deploy** — done! You'll get a `*.vercel.app` URL instantly.

### Option 2: Via GitHub (Recommended for updates)
1. Create a new repo on https://github.com/new
2. Upload the `portfolio/` folder contents (just `index.html`)
3. Go to https://vercel.com → **"Add New Project"**
4. Import your GitHub repo
5. Click **Deploy** — Vercel auto-detects it as a static site
6. Every future `git push` auto-redeploys 🎉

### Option 3: Vercel CLI
```bash
npm install -g vercel
cd portfolio
vercel --prod
```

## 🌐 Custom Domain (Optional)
1. In Vercel dashboard → your project → **Settings → Domains**
2. Add your domain (e.g., `selvaragavan.com`)
3. Follow DNS instructions (usually takes 5 mins to propagate)

## ✏️ How to Update Content

All content is in `index.html`. Search for these markers to find sections:

| Section | Search for |
|---------|-----------|
| Hero name/bio | `hero-content` |
| About text | `id="about"` |
| Skills | `skills-wrapper` |
| Projects | `projects-grid` |
| Achievements | `achievements-grid` |
| Contact links | `contact-links` |

After editing, just re-upload or push to GitHub.

## 📁 File Structure
```
portfolio/
└── index.html   ← entire site (CSS + JS embedded)
```

No build step. No dependencies. No config needed.

## ✅ Features
- Matrix/Katakana animated canvas background
- Typewriter effect cycling roles
- Smooth scroll reveal animations
- Dark / Light theme toggle
- Project category filter (All / AI / Cybersecurity / Robotics)
- Custom cursor with trail
- Magnetic CTA button
- Responsive: 375px → 4K
- Loading screen with terminal boot sequence
- Number counter animations
- Sticky navbar with scroll spy
- `prefers-reduced-motion` accessible
