import { ref } from 'vue';
import axios from 'axios';
import type { RaceListResponse } from 'common/network/Scrape';
import type { RaceData } from 'common/entity/RaceData';

export const useRaceList = () => {
  interface Int {
    place: string;
    races: RaceData[];
  }
  const raceDatas = ref<Int[]>([]);
  
  const fetch = async (date: string) => {
    const url = `http://localhost:3000/race/list/${date.replaceAll('-', '')}`;
    const response = await axios.get<RaceListResponse>(url);
    const races = response.data.races;
    const places = races.map(x => x.course.place).filter((elem, index, self) => self.indexOf(elem) === index);
    raceDatas.value.splice(0);
    for (const pl of places) {
      const datas: Int = {
        place: pl,
        races: races.filter(x => x.course.place === pl),
      };
      raceDatas.value.push(datas);
    }
  };
  return {
    fetch,
    raceDatas,
  }
};
