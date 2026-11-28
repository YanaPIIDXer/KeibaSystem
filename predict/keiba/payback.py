import pandas as pd
import numpy as np
import re
from pathlib import Path

# 払い戻しクラス
class Payback:
  # コンストラクタ
  def __init__(self):
    self._df = pd.read_csv(Path(__file__).parent.parent / 'datasets' / 'payback.csv')
    # RaceIdを生成
    self._df['RaceId'] = self._df['Year'].astype(str) + self._df['Month'].astype(str).str.zfill(2) + self._df['Day'].astype(str).str.zfill(2) + self._df['Course'] + self._df['RaceNo'].astype(str).str.zfill(2)

  # 払い戻し取得
  def get(self, race_id: str, betting_type: str, horses_no: list[int]) -> float:
    row = self._df[(self._df['RaceId'] == race_id)]
    if row.empty:
      print(f'INVALID RACE ID: {race_id}')
      return 0.0

    def conv(v: str) -> int:
      translation_table = str.maketrans(
        '０１２３４５６７８９',
        '0123456789' 
      )
      return int(v.translate(translation_table))

    pb_list = []
    if betting_type in ['Place', 'QuinellaPlace']:
      s = row[betting_type].values[0]
      pattern = r'([\d\-]+) \\(\d+)'
      matches = re.findall(pattern, s)
      for m in matches:
        payback = int(m[1])
        no_list = list(map(conv, m[0].split('-')))
        pb_list.append((payback, no_list))
    else:
      s = row[betting_type].values[0]
      payback = int(s.split(' ')[1][1:])
      no_list = list(map(conv, s.split(' ')[0].split('-')))
      pb_list.append((payback, no_list))
    for payback, no_list in pb_list:
      payback = int(payback / 10) / 10
      if betting_type in ['Win', 'Place', 'Quinella', 'QuinellaPlace', 'Trio']:
        # 馬番が含まれていればよい式別
        is_win = True
        for no in horses_no:
          if no not in no_list:
            is_win = False
            break
        if is_win: return payback
      elif betting_type in ['Exacta', 'Trifecta']:
        # 完全一致を条件とする式別
        if no_list == horses_no: return payback
    return 0.0
