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

  get no(): number {
    return Number(this.$(this.$td[2]).text().trim());
  }

  get name(): string {
    return this.$(this.$td[3]).text().trim();
  }
  
  get rank(): number {
    return Number(this.$(this.$td[0]).text().trim());
  }

  get jockey(): string {
    return this.$(this.$td[6]).text().trim();
  }

  get time(): number {
    const timeStr = this.$(this.$td[7]).text().trim();
    const minute = Number(timeStr.split(':')[0]);
    const second = Number(timeStr.split(':')[1]?.split('.')[0]);
    const milliSecond = Number(timeStr.split(':')[1]?.split('.')[1]);
    return ((minute * 60) + second + milliSecond) / 10;
  }

  get last3Falong(): number {
    const val = Number(this.$(this.$td[15]).text().trim());
    return Number.isNaN(val) ? -1 : val;
  }
  get odds(): number {
    const val = Number(this.$(this.$td[16]).text().trim());
    return Number.isNaN(val) ? -1 : val;
  }
  get popular(): number {
    const val = Number(this.$(this.$td[17]).text().trim());
    return Number.isNaN(val) ? -1 : val;
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

  getMember(id: string): HorseResult | null {
    const mems = this.raceMember;
    for (const m of mems) {
      if (m.id === id) { return m; }
    }
    return null;
  }

  get raceMember (): HorseResult[] {
    return this.$('.race_table_01 > tbody > tr').toArray().splice(1).map(x => new HorseResult(this.$, this.$(x)));
  }
}
