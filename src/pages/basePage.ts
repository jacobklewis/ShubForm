import { PageData } from "../models/pageData";
import { StyledPageData } from "../models/styledPageData";

export const basePage = (
  data: StyledPageData,
  body: (pd: PageData) => string
) => `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${
          data.pageData.attributes.description
        }" />
        ${data.styles
          .map((s) => '<link rel="stylesheet" href="' + s + '"/>')
          .join("\n")}
        <title>${data.pageData.attributes.title}</title>
    </head>
    <body>
        ${body(data.pageData)}
    </body>
</html>
`;
