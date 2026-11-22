import type { RaceListResponse } from 'common/network/Scrape';
import type { Cheerio, CheerioAPI } from 'cheerio';
import { fetchHtml } from '../fetch';
import type { Element } from 'domhandler';
import type { RaceData as APIData, RaceCourse } from 'common/entity/RaceData';

class RaceData {
  constructor (private $: CheerioAPI, private $item: Cheerio<Element>, private place: string) {}

  get id(): string {
    const $a = this.$(this.$item.find('a')[0]);
    const href = $a.attr('href') ?? '';
    const raceId = new URLSearchParams(href.split('?')[1] ?? '').get('race_id');
    return raceId ?? '';
  }
  get name(): string {
    return this.$item.find('.ItemTitle').text().trim();
  }
  get no(): number {
    return Number(this.$item.find('.Race_Num').text().trim().replace('R', '')) || -1;
  }
  get course(): RaceCourse {
    const courseStr = this.$item.find('.RaceData > .RaceList_ItemLong').text().replace('m', '');
    const ground = courseStr[0] ?? '';
    const distance = Number(courseStr.substring(1));
    return {
      place: this.place,
      ground,
      distance,
    }
  }
}

class RaceListData {
  static async generate(date: string): Promise<RaceListData> {
    const $ = await fetchHtml({
      url: `https://race.netkeiba.com/top/race_list.html?kaisai_date=${date}`,
      waitForSelector: '#RaceTopRace',
    });
    return new RaceListData($);
  }
  constructor (private $: CheerioAPI) {}

  getList(): APIData[] {
    const lists = this.$('.RaceList_DataList').toArray();
    const raceList: APIData[] = [];
    for (const list of lists) {
      const place = this.$(list).find('.RaceList_DataTitle').text().split(' ')[1] ?? '';
      const items = this.$(list).find('.RaceList_DataItem').toArray();
      const datas = items.map(item => new RaceData(this.$, this.$(item), place));
      for (const data of datas) {
        raceList.push({
          id: data.id,
          name: data.name,
          no: data.no,
          course: data.course,
        });
      }
    }
    return raceList;
  }
}

export async function fetchRaceList(date: string): Promise<RaceListResponse> {
  const data = await RaceListData.generate(date);
  
  return { races: data.getList(), }
}