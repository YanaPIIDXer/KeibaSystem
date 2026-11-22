import type { RaceCourse } from "./RaceData";

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
  positions: number[];
}

export interface RaceResultData {
  name: string;
  course: RaceCourse;
  horses: HorseResultData[];
}
