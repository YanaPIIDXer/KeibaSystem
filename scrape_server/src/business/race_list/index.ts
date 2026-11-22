import type { RaceListResponse } from 'common/network/Scrape';

export async function fetchRaceList(date: string): Promise<RaceListResponse> {
  return { races: [], }
}