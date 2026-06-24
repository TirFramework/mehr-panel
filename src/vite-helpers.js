import { readdirSync } from "fs";
import { extname } from "path";

export function loadDynamicPages(dynamicPagesPath) {
  const dynamicPages = [];

  try {
    const files = readdirSync(dynamicPagesPath);

    files.forEach((file) => {
      const ext = extname(file);
      if (ext === ".jsx" || ext === ".js") {
        dynamicPages.push(file.replace(ext, ""));
      }
    });

    console.log("📦 Dynamic pages found:", dynamicPages);
  } catch (error) {
    console.warn("⚠️  Could not read dynamic-pages directory:", error.message);
  }

  return dynamicPages;
}

export function dynamicPagesDefine(dynamicPages) {
  return {
    "import.meta.env.VITE_DYNAMIC_PAGES": JSON.stringify(
      JSON.stringify(dynamicPages)
    ),
  };
}
