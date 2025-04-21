export interface Config {
  dev: ConfigDev;
  styles: string[];
}

export interface ConfigDev {
  indexMD: string;
  pagesDir: string;
  componentsDir: string;
  componentCopyDir: string;
  outDir: string;
}
