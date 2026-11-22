export interface HorseResultData {
  id: string;
  no: number;
  rank: number;
  name: string;
  jockey: string;
  time: number;
  last3Falong: number;
  odds: number;
  popular: number;
}

export interface RaceResultData {
  horses: HorseResultData[];
}
