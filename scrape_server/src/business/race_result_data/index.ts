import { fetchHtml } from '@/fetch';
import type { Cheerio, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';

class HorseResult {
  private $td;
  
  constructor (private $: CheerioAPI, private $elem: Cheerio<Element>) {
    this.$td = this.$elem.find('td');
  }

  get id(): string {
    const $a = this.$(this.$td[3]).find('a');
    let href = $a.attr('href');
    if (!href) { return ''; }
    if (href.endsWith('/')) {
      href = href.substring(0, href.length - 1);
    }
    const splited = href.split('/');
    return splited[splited.length - 1] ?? '';
  }
}

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
      if (m.id === id) { return true; }
    }
    return false;
  }

  get raceMember (): HorseResult[] {
    return this.$('.race_table_01 > tbody > tr').toArray().splice(1).map(x => new HorseResult(this.$, this.$(x)));
  }
}
