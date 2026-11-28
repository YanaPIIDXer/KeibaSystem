import pandas as pd
import numpy as np
from pathlib import Path

root = Path(__file__).parent

class Instance:
  '''
  色々とやってくれるインスタンス
  '''
  
  def __init__(self):
    '''
    コンストラクタ
    '''
    self.__cache_df = None
  
  def load_data(self) -> pd.DataFrame:
    '''
    データ読み込みと前処理
    '''
    df = pd.read_csv(root / 'datas' / 'data.csv')
    df['RaceId'] = df['Year'].astype(str) + df['Month'].astype(str).str.zfill(2) + df['Day'].astype(str).str.zfill(2) + df['Place'] + df['RaceNo'].astype(str).str.zfill(2)
    df.insert(0, 'RaceId', df.pop('RaceId'))

    self.__cache_df = df.copy()
    return df

  def find_race(self, id: str) -> pd.DataFrame:
    '''
    特定のレースIDの結果を取得
    '''
    if self.__cache_df is None:
      self.load_data()
    return self.__cache_df[self.__cache_df['RaceId'] == id].sort_values('Result', ascending=True)
