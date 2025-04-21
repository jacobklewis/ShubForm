import { existsSync, mkdirSync, readdirSync } from "fs";
import { Config } from "./config.js";
import { createPage, exportHomePage, exportPages } from "./pages.js";

export const createStatic = (config: Config) => {
  const pages = readdirSync(config.dev.pagesDir)
    .map((page) => page.slice(0, -3))
    .map((page) => createPage(page, config));

  // console.log(pages);

  if (!existsSync(config.dev.outDir)) mkdirSync(config.dev.outDir);

  // Export Pages
  exportHomePage(pages, config);
  exportPages(pages, config);
};

const config = {
  dev: {
    indexMD: "./test_forms/index.md",
    pagesDir: "./test_forms/pages",
    componentsDir: "./test_forms/components",
    componentCopyDir: "./test_forms/componentCopy",
    outDir: "./public",
  },
  styles: [
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/styles/default.min.css",
    "/styles/main.css",
  ],
} as Config;

createStatic(config);
