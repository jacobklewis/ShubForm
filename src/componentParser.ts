import { load } from "js-yaml";
import { readFileSync, existsSync, mkdir, mkdirSync } from "fs";
import { Attributes } from "./attributes";
import { marked } from "./marked.js";
import { Config } from "./config";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const compParse = (body: string, attrs: Attributes, config: Config) => {
  const re = new RegExp("\\={3}\\n(.*?)\\n\\={3}", "gms").exec(body);
  if (!re || re?.length === 0) {
    return [new SegmentResult(marked.parse(body, { async: false }))];
  }
  // Separate body into segments
  let segments = [] as SegmentResult[];
  // console.log("re:", re);
  const index = re.index;
  const firstPart = body.slice(0, index);
  const firstSegment = new SegmentResult(
    marked.parse(firstPart, { async: false })
  );
  segments.push(firstSegment);
  const lastPart = body.slice(index + re[0].length);
  body = lastPart;

  const match = re[1];
  // console.log("Building component:", match);
  const component = new SegmentResult(
    parseComponent(match, attrs, config),
    true
  );
  // console.log("component:", component);
  segments.push(component);
  if (body) {
    // If there is more to the body, parse it
    const otherSegments = compParse(body, attrs, config);
    segments.push(...otherSegments);
  }

  return segments;
};

const parseComponent = (
  component: string,
  attrs: Attributes,
  config: Config
) => {
  const yamlObj = load(component) as any;
  const crit = ComponentCriteria.create(yamlObj);
  return buildComponent(crit, attrs, config);
};

const buildComponent = (
  comp: ComponentCriteria,
  attrs: Attributes,
  config: Config
) => {
  let isError = false;
  // loaded component html
  const dir = config.dev.componentsDir;
  // Check if native components exist
  let componentPath = "";
  let jsPath = "";
  const nativePath = join(
    __dirname,
    `nativeComponents`,
    `${comp.component}.html`
  );
  if (existsSync(nativePath)) {
    componentPath = nativePath;
    jsPath = join(__dirname, `nativeComponents`, `${comp.component}.js`);
  } else {
    // mkdirSync("nativeComponents", { recursive: true });
    componentPath = `${dir}/${comp.component}.html`;
    jsPath = `${dir}/${comp.component}.js`;
  }
  const componentHTML = readFileSync(componentPath, "utf8");
  // loaded component js
  const js = readFileSync(jsPath, "utf8");
  // loaded component copy
  const copyHTML = [] as string[];
  if (comp.copy) {
    comp.copy.forEach((copy: string) => {
      const copyPath = `${config.dev.componentCopyDir}/${attrs.componentCopyDir}/${copy}.md`;
      if (existsSync(copyPath) === false) {
        console.error(
          "\x1b[31m%s\x1b[0m",
          "Copy file does not exist: " + copyPath
        );
        isError = true;
        return;
      }
      const copyText = readFileSync(copyPath, "utf8");
      // console.log("copyText:", copyText);
      copyHTML.push(
        compParse(copyText, attrs, config).reduce((acc, x) => acc + x.body, "")
      );
    });
  }
  if (comp.comps) {
    comp.comps.forEach((comp: ComponentCriteria) => {
      const subComp = buildComponent(comp, attrs, config);
      // console.log(subComp);
      copyHTML.push(subComp);
    });
  }
  if (isError) {
    throw Error("Check above for error");
  }
  // execute js loaded from file
  const jsBuildComp = eval("(" + js + ")");
  // execute js function to build component
  const jsResult = jsBuildComp(copyHTML, componentHTML, comp.style);
  return jsResult;
};

class ComponentCriteria {
  component: string;
  copy: string[];
  comps: ComponentCriteria[];
  style: { [key: string]: string };
  constructor(
    component: string,
    copy: string[],
    comps: ComponentCriteria[],
    style: { [key: string]: string } = {}
  ) {
    this.component = component;
    this.copy = copy;
    this.comps = comps;
    this.style = style;
  }
  static create(obj: any): ComponentCriteria {
    const component = obj["component"];
    const copy = obj["copy"];
    const comps =
      obj["comps"]?.map((comp: any) => ComponentCriteria.create(comp)) ?? [];
    const style = obj["style"] ?? {};
    return new ComponentCriteria(component, copy, comps, style);
  }
}

class SegmentResult {
  body: string;
  isComponent: boolean;
  constructor(body: string, isComponent: boolean = false) {
    this.body = body;
    this.isComponent = isComponent;
  }
}
