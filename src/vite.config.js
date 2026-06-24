import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import { mkdirSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { loadDynamicPages, dynamicPagesDefine } from "./vite-helpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dynamicPages = loadDynamicPages(
  resolve(__dirname, "resources/admin/src/dynamic-pages")
);

function ensureBuildPanelGitignore() {
  return {
    name: "ensure-build-panel-gitignore",
    apply: "build",
    closeBundle() {
      try {
        const outDir = resolve(__dirname, "public", "build-panel");
        mkdirSync(outDir, { recursive: true });
        const gitignorePath = resolve(outDir, ".gitignore");
        writeFileSync(gitignorePath, "*\n!.gitignore\n", {
          encoding: "utf8",
        });
      } catch (e) {
        console.warn("⚠️  Could not write build-panel/.gitignore:", e.message);
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    laravel({
      input: [
        "resources/admin/src/assets/index.css",
        "resources/admin/src/assets/custom.css",
        "resources/admin/src/main.jsx",
      ],
      buildDirectory: "build-panel",
      refresh: true,
      detectTls: false,
      serverUrl: "https://localhost:5173",
    }),
    ensureBuildPanelGitignore(),
  ],

  define: dynamicPagesDefine(dynamicPages),

  server: {
    https: false,
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    origin: "http://localhost:5173",
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5173,
    },
  },
});
