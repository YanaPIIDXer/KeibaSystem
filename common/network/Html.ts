export interface HtmlRequestData {
  url: string;
  waitForSelector?: string;
  useCache?: boolean;
}

export interface HtmlResponseData {
  html: string;
}
