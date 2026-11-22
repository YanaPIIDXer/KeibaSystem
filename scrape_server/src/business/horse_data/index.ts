import { fetchHtml } from '@/fetch';
import type { HorseDataResponse } from 'common/network/Scrape';

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
