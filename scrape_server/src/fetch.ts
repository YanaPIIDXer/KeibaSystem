
import { load, type CheerioAPI } from 'cheerio';
import axios from 'axios';
import type { HtmlRequestData, HtmlResponseData } from 'common/network/Html';

export async function fetchHtml (requestData: HtmlRequestData): Promise<CheerioAPI> {
  const response = await axios.post<HtmlResponseData>('http://localhost:3001', requestData);
  return load(response.data.html);
}
