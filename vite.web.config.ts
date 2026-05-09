import { resolve } from "node:path";
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const distDir = resolve(__dirname, "dist");

export default defineConfig({
  root: resolve(__dirname, "src/renderer"),
  base: "./",
  plugins: [
    react(),
    {
      name: "static-hosting-extras",
      writeBundle() {
        const assetsDir = resolve(distDir, "assets");
        mkdirSync(assetsDir, { recursive: true });
        copyFileSync(resolve(__dirname, "src/renderer/src/assets/static/favicon.svg"), resolve(assetsDir, "favicon.svg"));
        copyFileSync(resolve(distDir, "index.html"), resolve(distDir, "404.html"));
        writeFileSync(resolve(distDir, "robots.txt"), "User-agent: *\nAllow: /\n", "utf8");
        writeFileSync(resolve(distDir, "_redirects"), "/* /index.html 200\n", "utf8");
        writeFileSync(
          resolve(distDir, "STATIC_HOSTING_FALLBACK.md"),
          [
            "# Static Hosting Fallback",
            "",
            "This site is a SPA with browser routes:",
            "",
            "- /",
            "- /profile",
            "- /resume",
            "",
            "Tencent Cloud COS:",
            "",
            "1. Enable Static Website Hosting.",
            "2. Set Index Document to index.html.",
            "3. Set Error Document to index.html. If the console requires a 404 file, use 404.html.",
            "4. Upload every file in this dist folder while preserving directory structure.",
            "",
            "Alibaba Cloud OSS:",
            "",
            "1. Enable Static Website Hosting.",
            "2. Set Default Homepage to index.html.",
            "3. Set Default 404 Page or Error Document to index.html. If the console requires a 404 file, use 404.html.",
            "4. Upload every file in this dist folder while preserving directory structure.",
            "",
            "Important:",
            "",
            "- Keep the assets directory at the same level as index.html.",
            "- Use paths without a trailing slash for SPA routes, for example /resume and /profile.",
            "- If deploying into a subdirectory, upload this whole dist folder content into that subdirectory."
          ].join("\n"),
          "utf8"
        );
      }
    }
  ],
  publicDir: false,
  server: {
    port: 3001,
    strictPort: true
  },
  preview: {
    port: 3001,
    strictPort: true
  },
  build: {
    outDir: distDir,
    assetsDir: "assets",
    emptyOutDir: true
  }
});
