import { Config } from "../config.js";
import { PageData } from "../models/pageData.js";
import { StyledPageData } from "../models/styledPageData.js";
import { basePage } from "./basePage.js";

export const pagehtml = (data: PageData, config: Config) =>
  basePage(new StyledPageData(data, config.styles), (data) => data.body);
