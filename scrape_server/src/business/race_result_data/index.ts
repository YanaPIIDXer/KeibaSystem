import { fetchHtml } from '@/fetch';
import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';

export class RaceResultData {
  static async generate(id: string): Promise<RaceResultData> {
    const $ = await fetchHtml({
      url: `https://db.netkeiba.com/race/${id}`,
      waitForSelector: '.race_table_01',
    });
    return new RaceResultData($, id);
  }
  
  constructor (private $: CheerioAPI, private id: string) {}

  get no(): number {
    return Number(this.$('.racedata.fc > dt').text().trim().replace('R', ''));
  }

  get name(): string {
    return this.$('.racedata.fc > dd > h1').text().trim();
  }

  isMember(id: string): boolean {
    const mems = this.raceMember;
    for (const m of mems) {
      const $a = this.$(m.find('td')[3]).find('a');
      let href = $a.attr('href');
      if (!href) { continue; }
      if (href.endsWith('/')) {
        href = href.substring(0, href.length - 1);
      }
      const splited = href.split('/');
      const cmpId = splited[splited.length - 1];
      if (id === cmpId) { return true; }
    }
    return false;
  }

  private get raceMember (): Cheerio<Element>[] {
    return this.$('.race_table_01 > tbody > tr').toArray().splice(1).map(x => this.$(x));
  }
}
