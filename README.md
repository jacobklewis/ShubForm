# Shubform

Shubform is a static website generator.

## Installation

```bash
npm install shubform
```

## Usage
```ts
import { createStatic } from "shubform";

const config = {
  dev: {
    indexMD: "./forms/index.md",
    pagesDir: "./forms/pages",
    componentsDir: "./forms/components",
    componentCopyDir: "./forms/componentCopy",
    outDir: "./public",
  },
  styles: [
    "/styles/main.css",
  ],
} as Config;

createStatic(config);
```