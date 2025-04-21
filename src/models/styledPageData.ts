import { PageData } from "./pageData";

export class StyledPageData {
  pageData: PageData;
  styles: string[];

  constructor(pageData: PageData, styles: string[]) {
    this.pageData = pageData;
    this.styles = styles;
  }
}
