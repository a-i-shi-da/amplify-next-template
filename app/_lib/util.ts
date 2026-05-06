export function shuffleArray<T>(array: T[]): T[] {
  // 元の配列を変更したくない場合は、スプレッド構文でコピーを作成
  const shuffled = [...array]; 
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 分割代入で入れ替え
  }
  return shuffled;
}
