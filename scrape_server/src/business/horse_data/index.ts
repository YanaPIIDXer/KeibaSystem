import { fetchHtml } from '@/fetch';
import type { CheerioAPI } from 'cheerio';
import type { HorseDataResponse } from 'common/network/Scrape';
import { RaceResultData } from '../race_result_data';

export class HorseData {
  static async generate(id: string): Promise<HorseData> {
    const $ = await fetchHtml({
      url: `https://db.netkeiba.com/horse/${id}`,
      waitForSelector: '#horse_results_box',
    });
    return new HorseData($, id);
  }
  
  constructor (private $: CheerioAPI, private id: string) {}

  get name(): string {
    return this.$('.horse_title > h1').text();
  }

  get raceidList(): string[] {
    return this.$('.db_h_race_results > tbody > tr').toArray().map(r => {
      const $a = this.$(this.$(r).find('td')[4]).find('a');
      let href = $a.attr('href');
      if (!href) { return ''; }

      if (href.endsWith('/')) {
        href = href.substring(0, href.length - 1);
      }
      const splited = href.split('/');
      return splited[splited.length - 1] ?? '';
    });
  }
}

export async function fetchHorseData (horseId: string): Promise<HorseDataResponse> {  
  const data = await HorseData.generate(horseId);
  const races = await Promise.all(data.raceidList.map(id => RaceResultData.generate(id)));
  console.log(races.map(x => x.getMember(horseId)?.jockey));
  return {
    data: {
      name: data.name,
    }
  };
}
