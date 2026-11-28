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
    pass
  
  def load_data(self) -> pd.DataFrame:
    '''
    データ読み込みと前処理
    '''
    df = pd.read_csv(root / 'datas' / 'data.csv')
    return df

  
