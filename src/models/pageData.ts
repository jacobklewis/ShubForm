import { Attributes } from "../attributes";

export class PageData {
  attributes: Attributes;
  body: string;
  path: string;

  constructor(attributes: Attributes, body: string, path: string) {
    this.attributes = attributes;
    this.body = body;
    this.path = path;
  }
}
