import type { HorseDataResponse } from 'common/network/Scrape';
import { load, type CheerioAPI } from 'cheerio';
import axios from 'axios';
import type { HtmlRequestData, HtmlResponseData } from 'common/network/Html';

async function fetchHtml (requestData: HtmlRequestData): Promise<CheerioAPI> {
  const response = await axios.post<HtmlResponseData>('http://localhost:3001', requestData);
  return load(response.data.html);
}

export async function fetchHorseData (horseId: string): Promise<HorseDataResponse> {  
  const $ = await fetchHtml({
    url: `https://db.netkeiba.com/horse/${horseId}`,
    waitForSelector: '#horse_results_box',
  });

  const name = $('.horse_title > h1').text();
  
  return {
    name,
  };
}
