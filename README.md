# Candidate Profile Website

Personal portfolio site for AI content operations, Vibe Coding, AIGC workflow automation, and short-video project experience.

## Pages

- `/` cyber candidate entrance
- `/profile` candidate overview
- `/?stage=profile` candidate overview fallback
- `/resume` detailed resume

## Local Development

```bash
npm install
npm run dev:web
```

Local URLs:

```text
http://localhost:3001/
http://localhost:3001/profile
http://localhost:3001/resume
```

## Production Build

```bash
npm run typecheck
npm run build:web
```

Static output directory:

```text
dist
```

Deploy `dist` as the website root.

## Vercel

`vercel.json` is included.

Expected settings:

```text
Build Command: npm run build:web
Output Directory: dist
```

The `/profile` and `/resume` routes are rewritten to `index.html`, so page refresh works.

## Pre-Launch Check

```bash
npm run typecheck
npm run build:web
npm run preview:web
```

Check:

```text
http://localhost:3001/
http://localhost:3001/profile
http://localhost:3001/resume
```

## Asset Notes

Source assets live in:

```text
src/renderer/src/assets
```

Generated build assets are emitted into `dist/assets`. Do not commit or deploy `node_modules`, local logs, environment files, or build caches.
