import type { RaceResultData } from '../entity/RaceResultData';
import type { HorseData } from '../entity/HorseData';

export interface HorseDataResponse {
  data: HorseData;
  results: RaceResultData[];
}
