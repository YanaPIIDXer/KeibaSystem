import { fetchHtml } from '@/fetch';
import type { CheerioAPI } from 'cheerio';
import type { HorseDataResponse } from 'common/network/Scrape';

export class HorseData {
  static async generate(id: string): Promise<HorseData> {
    const $ = await fetchHtml({
      url: `https://db.netkeiba.com/horse/${id}`,
      waitForSelector: '#horse_results_box',
    });
    return new HorseData($);
  }
  
  constructor (private $: CheerioAPI) {}

  get name(): string {
    return this.$('.horse_title > h1').text();
  }
}

export async function fetchHorseData (horseId: string): Promise<HorseDataResponse> {  
  const data = await HorseData.generate(horseId);
  return {
    name: data.name,
  };
}
