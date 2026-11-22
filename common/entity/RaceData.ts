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
