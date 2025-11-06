import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// خواندن فایل .env لاراول
function loadLaravelEnv() {
  const envPath = resolve(__dirname, ".env");
  const env = {};

  try {
    const envFile = readFileSync(envPath, "utf-8");
    envFile.split("\n").forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const [key, ...valueParts] = trimmedLine.split("=");
        if (key) {
          const value = valueParts.join("=").trim();
          // حذف کوتیشن‌ها اگر وجود داشته باشند
          env[key.trim()] = value.replace(/^["']|["']$/g, "");
        }
      }
    });
  } catch (error) {
    console.warn("⚠️  Could not read .env file:", error.message);
  }

  return env;
}

const laravelEnv = loadLaravelEnv();

export default defineConfig({
  plugins: [
    react(),
    laravel({
      input: [
        "resources/admin/src/assets/index.css",
        "resources/admin/src/main.jsx",
      ],
      refresh: true,
      detectTls: false,
      serverUrl: "https://localhost:5173",
    }),
  ],

  define: {
    "process.env": JSON.stringify({
      // اولویت با process.env Node.js، سپس .env لاراول
      ...laravelEnv,
    }),
  },

  server: {
    https: true,
    host: "localhost",
    port: 5173,
    strictPort: true,
    origin: "https://localhost:5173",
    hmr: {
      protocol: "wss",
      host: "localhost",
      port: 5173,
    },
  },
});
