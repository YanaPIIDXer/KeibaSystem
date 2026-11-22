import { fetchHtml } from '@/fetch';
import type { CheerioAPI } from 'cheerio';

export class RaceData {
  static async generate(id: string): Promise<RaceData> {
    const $ = await fetchHtml({
      url: `https://db.netkeiba.com/race/${id}`,
      waitForSelector: '.race_table_01',
    });
    return new RaceData($);
  }
  
  constructor (private $: CheerioAPI) {}

  get no(): number {
    return Number(this.$('.racedata fc > dt').text().trim().replace('R', ''));
  }

  get name(): string {
    return this.$('.racedata fc > dd > h1').text();
  }
}
