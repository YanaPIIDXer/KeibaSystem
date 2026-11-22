import axios from 'axios';
import type { RaceListResponse } from 'common/network/Scrape';

export const useRaceList = () => {
  const fetch = async (date: string) => {
    const url = `http://localhost:3000/race/list/${date.replaceAll('-', '')}`;
    const response = await axios.get<RaceListResponse>(url);
    const places = response.data.races.map(x => x.course.place).filter((elem, index, self) => self.indexOf(elem) === index);
    console.log(places);
  };
  return {
    fetch,
  }
};
