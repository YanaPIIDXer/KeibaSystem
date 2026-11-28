from calendar import monthrange
import datetime
import requests
import os
import json

def fetch_race_list(date_str: str, retry:int = 3):
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

def main():
  if not os.path.exists('datas/race_list'):
    os.makedirs('datas/race_list')
  for year in range(2020, 2026):
    for month in range(1, 13):
      for day in range(1, monthrange(year, month)[1] + 1):
        if datetime.date(year, month, day).weekday() < 5: continue
        if month == 1 and day <= 4: continue
        month_str = str(month).zfill(2)
        day_str = str(day).zfill(2)
        date_str = f'{year}{month_str}{day_str}'
        fetch_race_list(date_str)

if __name__ == '__main__':
  main()
