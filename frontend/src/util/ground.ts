export function convertGroundName (v: string) {
  switch (v) {
    case 'ダ': return 'ダート';
    case '障': return '障害';
  }
  return v;
}