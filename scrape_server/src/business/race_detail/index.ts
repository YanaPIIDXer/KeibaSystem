import { fetchHtml } from '../fetch';
import type { Cheerio, CheerioAPI } from 'cheerio';
import type { RaceCourse } from 'common/entity/RaceData';
import type { RaceDetailResponse } from 'common/network/Scrape';
import type { Element } from 'domhandler';

class Horse {
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
    return Number(this.$(this.$td[1]).text().trim());
  }

  get name(): string {
    return this.$(this.$td[3]).text().trim();
  }
  
  get jockey(): string {
    return this.$(this.$td[6]).text().trim();
  }

  get odds(): number {
    const val = Number(this.$(this.$td[9]).text().trim());
    return Number.isNaN(val) ? -1 : val;
  }
}

export class RaceDetailData {
  static async generate(id: string): Promise<RaceDetailData> {
    const $ = await fetchHtml({
      url: `https://race.netkeiba.com/race/shutuba.html?race_id=${id}`,
      waitForSelector: '.Shutuba_Table',
    });
    return new RaceDetailData($);
  }
  
  constructor (private $: CheerioAPI) {}

  get no(): number {
    return Number(this.$('.RaceNum').text().trim().replace('R', ''));
  }

  get name(): string {
    return this.$('.RaceName').text().trim();
  }

  get course(): RaceCourse {
    const courseStr = (() => {
      return this.$(this.$('.RaceData01 > span').toArray()[0]).text().trim();
    })().replace('m', '');
    const ground = courseStr[0] ?? '';
    const distance = Number(courseStr.substring(1));
    const place = this.$(this.$('.RaceData02 > span')[1]).text().trim();
    return {
      place,
      ground,
      distance,
    }
  }

  get raceMember (): Horse[] {
    return this.$('.Shutuba_Table > tbody > .HorseList').toArray().map(x => new Horse(this.$, this.$(x)));
  }
}

export async function fetchRaceDetail(id: string): Promise<RaceDetailResponse> {
  const data = await RaceDetailData.generate(id);
  
  return {
    detail: {
      name: data.name,
      course: data.course,
      horses: data.raceMember.map(x => {
        return {
          id: x.id,
          no: x.no,
          name: x.name,
          jockey: x.jockey,
          odds: x.odds,
        }
      }),
    }
  };
}