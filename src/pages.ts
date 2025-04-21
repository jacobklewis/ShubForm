import fm, { FrontMatterResult } from "front-matter";
import { existsSync, mkdirSync, readFileSync, writeFile } from "fs";
import { PageData } from "./models/pageData.js";
import { compParse } from "./componentParser.js";
import { homepageHtml } from "./pages/homePage.js";
import { pagehtml } from "./pages/generalPage.js";
import { Config } from "./config.js";

export const createPage = (pagePath: string, config: Config) => {
  const data = readFileSync(`${config.dev.pagesDir}/${pagePath}.md`, "utf8");
  const content: FrontMatterResult<any> = fm<any>(data);
  //   console.log(content.body);
  // Parse the body segments
  const bodyComps = compParse(content.body, content.attributes, config);
  const pageData = new PageData(
    content.attributes,
    bodyComps.reduce((acc, x) => acc + x.body, ""),
    pagePath
  );
  return pageData;
};

export const exportHomePage = (pages: PageData[], config: Config) => {
  const indexMD = readFileSync(`${config.dev.indexMD}`, "utf8");
  const content: FrontMatterResult<any> = fm<any>(indexMD);
  // Parse the body segments
  const bodyComps = compParse(content.body, content.attributes, config);
  const data = new PageData(
    content.attributes,
    bodyComps.reduce((acc, x) => acc + x.body, ""),
    "/"
  );
  writeFile(
    `${config.dev.outDir}/index.html`,
    homepageHtml(data, pages, config),
    (e) => {
      if (e) throw e;
      console.log(`index.html was created successfully`);
    }
  );
};

export const exportPages = (pages: PageData[], config: Config) => {
  pages.forEach((page) => {
    if (!existsSync(`${config.dev.outDir}/${page.path}`))
      mkdirSync(`${config.dev.outDir}/${page.path}`);

    writeFile(
      `${config.dev.outDir}/${page.path}/index.html`,
      pagehtml(page, config),
      (e) => {
        if (e) throw e;
        console.log(`${page.path}/index.html was created successfully`);
      }
    );
  });
};
