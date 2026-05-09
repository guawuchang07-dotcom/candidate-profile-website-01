# Deployment Notes

## Current Production URL

- Homepage: https://candidate-profile-website-01.pages.dev/
- Resume page: https://candidate-profile-website-01.pages.dev/resume

## GitHub Repository

- Repository: https://github.com/guawuchang07-dotcom/candidate-profile-website-01
- Branch: main

## Cloudflare Pages Setup

Use Cloudflare Pages, not Workers.

When creating a new deployment:

1. Go to Workers & Pages.
2. Choose Pages.
3. Choose `Import an existing Git repository`.
4. Select `guawuchang07-dotcom/candidate-profile-website-01`.
5. Use these build settings:
   - Framework preset: `None`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: leave empty
   - Environment variables: leave empty
6. Do not use `npx wrangler deploy`.
7. Do not use Worker `Edit code`.

## SPA Route Fallback

The site uses browser routes such as `/resume`.

Cloudflare Pages needs this redirect file in `dist`:

```text
/* /index.html 200
```

The Vite config writes this file automatically during build:

- `vite.web.config.ts` writes `dist/_redirects`

## Local Update Flow

```powershell
cd "D:\自动化工具\_website_publish\candidate-profile-website-01"
npm run typecheck
npm run build:web
git add .
git commit -m "Update portfolio"
git push
```

Cloudflare Pages will automatically redeploy after `git push`.

