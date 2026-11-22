
import { load, type CheerioAPI } from 'cheerio';
import axios from 'axios';
import type { HtmlRequestData, HtmlResponseData } from 'common/network/Html';

export async function fetchHtml (requestData: HtmlRequestData): Promise<CheerioAPI> {
  try {
    const response = await axios.post<HtmlResponseData>('http://localhost:3001', requestData);
    console.info('Fetch OK', requestData.url);
    return load(response.data.html);
  } catch (error) {
    console.info('Fetch Error', requestData.url);
    throw error;
  }
}
