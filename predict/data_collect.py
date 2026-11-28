from calendar import monthrange
import datetime
import requests
import os
import json
import glob

def fetch_race_list(date_str: str, retry:int = 3):
  if not os.path.exists('datas/race_list'):
    os.makedirs('datas/race_list')
  path = f'datas/race_list/{date_str}.json'
  if os.path.exists(path): return
  try:
    response = requests.get(f'http://localhost:3000/race/list/{date_str}')
    data = response.json()
    with open(path, 'w', encoding='utf-8') as f:
      json.dump(data, f, ensure_ascii=False, indent=2)
  except Exception as e:
    if retry >= 0:
      fetch_race_list(date_str, retry - 1)
    else: raise e

def fetch_race_data(race_id: str, retry:int = 3):
  if not os.path.exists('datas/race_data'):
    os.makedirs('datas/race_data')
  path = f'datas/race_data/{race_id}.json'
  if os.path.exists(path): return
  try:
    response = requests.get(f'http://localhost:3000/race/{race_id}')
    data = response.json()
    with open(path, 'w', encoding='utf-8') as f:
      json.dump(data, f, ensure_ascii=False, indent=2)
  except Exception as e:
    if retry >= 0:
      fetch_race_data(race_id, retry - 1)
    else: raise e

def fetch_horse_data(horse_id: str, retry:int = 3):
  if not os.path.exists('datas/horse_data'):
    os.makedirs('datas/horse_data')
  path = f'datas/horse_data/{horse_id}.json'
  if os.path.exists(path): return
  try:
    response = requests.get(f'http://localhost:3000/horse/{horse_id}')
    data = response.json()
    with open(path, 'w', encoding='utf-8') as f:
      json.dump(data, f, ensure_ascii=False, indent=2)
  except Exception as e:
    if retry >= 0:
      fetch_horse_data(horse_id, retry - 1)
    else: raise e

def main():
  for year in range(2020, 2026):
    for month in range(1, 13):
      for day in range(1, monthrange(year, month)[1] + 1):
        if datetime.date(year, month, day).weekday() < 5: continue
        if month == 1 and day <= 4: continue
        month_str = str(month).zfill(2)
        day_str = str(day).zfill(2)
        date_str = f'{year}{month_str}{day_str}'
        fetch_race_list(date_str)

  for file in glob.glob('datas/race_list/*.json'):
    with open(file, 'r', encoding='utf-8') as f:
      data = json.load(f)
    for race in data['races']:
      fetch_race_data(race['id'])

  for file in glob.glob('datas/race_data/*.json'):
    with open(file, 'r', encoding='utf-8') as f:
      data = json.load(f)
    for horse in data['detail']['horses']:
      fetch_horse_data(horse['id'])
    

if __name__ == '__main__':
  main()
