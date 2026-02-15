import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname, extname } from "path";
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
          const cleanValue = value.replace(/^["']|["']$/g, "");
          const trimmedKey = key.trim();
          // فقط متغیرهایی که با VITE_ شروع می‌شوند را وارد کن
          if (trimmedKey.startsWith("VITE_")) {
            env[trimmedKey] = cleanValue;
          }
        }
      }
    });
  } catch (error) {
    console.warn("⚠️  Could not read .env file:", error.message);
  }

  return env;
}

const laravelEnv = loadLaravelEnv();

// خواندن فایل‌های dynamic pages (همان پوشه‌ای که Custom.jsx از آن import می‌کند)
function loadDynamicPages() {
  const dynamicPagesPath = resolve(__dirname, "src/dynamic-pages");
  const dynamicPages = [];

  try {
    // خواندن فایل‌های موجود در پوشه dynamic-pages
    const files = readdirSync(dynamicPagesPath);

    // فیلتر کردن فایل‌های .jsx و .js و استخراج نام آن‌ها (بدون پسوند)
    files.forEach((file) => {
      const ext = extname(file);
      if (ext === ".jsx" || ext === ".js") {
        const fileName = file.replace(ext, "");
        dynamicPages.push(fileName);
      }
    });

    console.log("📦 Dynamic pages found:", dynamicPages);
  } catch (error) {
    console.warn("⚠️  Could not read dynamic-pages directory:", error.message);
  }

  return dynamicPages;
}

const dynamicPages = loadDynamicPages();


// پلاگین ماژول مجازی برای TopHeader: اگر CustomTopHeader.jsx وجود داشت از آن استفاده می‌شود، وگرنه DefaultTopHeader
const customTopHeaderPath = resolve(__dirname, "src/dynamic-layouts/CustomTopHeader.jsx");

function topHeaderVirtualPlugin() {
  const virtualId = "\0virtual:top-header";
  const useCustom = existsSync(customTopHeaderPath);
  const exportPath = useCustom
    ? "./src/dynamic-layouts/CustomTopHeader.jsx"
    : "./src/blocks/DefaultTopHeader.jsx";

  return {
    name: "virtual:top-header",
    resolveId(id) {
      if (id === "virtual:top-header") return virtualId;
      return null;
    },
    load(id) {
      if (id !== virtualId) return null;
      // مسیر نسبی از root پروژه (همان پوشه vite.config)
      return `export { default } from "${exportPath}";`;
    },
  };
}

export default defineConfig({
  plugins: [react(), topHeaderVirtualPlugin()],
  define: {
    "process.env": JSON.stringify({
      // اولویت با process.env Node.js، سپس .env لاراول
      ...laravelEnv,
      // اضافه کردن لیست dynamic pages به process.env
      // مقدار به صورت JSON stringified array خواهد بود و باید در کد با JSON.parse() parse شود
      VITE_DYNAMIC_PAGES: JSON.stringify(dynamicPages),
    }),
  },

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
