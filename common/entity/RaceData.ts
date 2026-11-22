export interface RaceCourse {
  place: string;
  ground: string;
  distance: number;
}

export interface RaceData {
  id: string;
  name: string;
  no: number;
  course: RaceCourse;
}

export interface RaceDeatilHorse {
  id: string;
  no: number;
  name: string;
  jockey: string;
  odds: number;
}

export interface RaceDetail {
  name: string;
  course: RaceCourse;
  horses: RaceDeatilHorse[];  
}
