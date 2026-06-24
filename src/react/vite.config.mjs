import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { loadDynamicPages, dynamicPagesDefine } from "../vite-helpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dynamicPages = loadDynamicPages(resolve(__dirname, "src/dynamic-pages"));

export default defineConfig({
  plugins: [react()],
  define: dynamicPagesDefine(dynamicPages),
});
