import type { RaceResultData } from '../entity/RaceResultData';
import type { HorseData } from '../entity/HorseData';
import type { RaceData } from '../entity/RaceData';

export interface HorseDataResponse {
  data: HorseData;
  results: RaceResultData[];
}

export interface RaceListResponse {
  races: RaceData[];
}
