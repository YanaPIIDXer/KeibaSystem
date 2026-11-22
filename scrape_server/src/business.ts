import type { HorseDataResponse } from 'common/network/Scrape';

export async function fetchHorseData (horseId: string): Promise<HorseDataResponse> {
  return {
    name: 'いくいのっくす',
  };
}
