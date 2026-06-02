# agent-deploy

CustomGPT Deploy → Share prototype. Custom subdomain modal + live chat settings. Next.js 16 App Router, React 19, Tailwind v4, TypeScript.

## Stack rules
- App Router only — no `pages/` directory
- Tailwind v4: config lives in `app/globals.css` (`@theme`), not `tailwind.config.*`
- Server Components by default; add `"use client"` only when you need interactivity or browser APIs
- `components/modal/` — subdomain modal; `components/ui/` — shared primitives

## Design
- Desktop-only — CustomGPT.ai has no mobile app; don't add responsive breakpoints
- CustomGPT design tokens: use `--cg-*` CSS variables for colour, spacing, radius
- Tooltips: white bg `#fff`, shadow `0 1px 2.2px rgba(0,0,0,0.25)` — never dark
- Card hover: `--cg-shadow-card` only — no coloured primary shadows

## Deploy
- Vercel, **customgpt.ai team** account — never personal account
- Production: https://agent-deploy-three.vercel.app

## Next.js version note
This is Next.js 16 — APIs may differ from training data. Check `node_modules/next/dist/docs/` before using an unfamiliar API.
