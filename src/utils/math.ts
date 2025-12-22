/**
 * 計算百分比並回傳四捨五入到指定小數位後的數值 (非字串)。
 * @param numerator 分子 (e.g., 15)
 * @param denominator 分母 (e.g., 40)
 * @param precision 需要保留的小數位數 (N)
 * @returns 四捨五入後的百分比數值 (e.g., 37.5)
 */
export function calculatePercentageAsNumber(
  numerator: number,
  denominator: number,
  precision: number = 2
): number {
  // 1. 處理特殊情況：分母為 0
  if (denominator === 0) {
    return 0;
  }

  // 2. 執行除法並轉換為百分比 (e.g., 0.375 -> 37.5)
  const percentage = (numerator / denominator) * 100;

  // 3. 處理四捨五入的關鍵步驟
  // 3a. 計算乘數 (例如 N=2 時為 100, N=3 時為 1000)
  const factor = Math.pow(10, precision);

  // 3b. 四捨五入：(percentage * factor) 四捨五入 / factor
  // Math.round() 執行四捨五入
	// 4. 回傳數值
  return Math.round(percentage * factor) / factor;
}


/**
 * 根據傳入的機率回傳是否觸發成功
 * @param chance 機率數值 (0 到 1 之間，例如 0.8 代表 80%)
 * @returns boolean
 */
export const checkProbability = (chance: number): boolean => {
  // 安全檢查：如果機率小於等於 0，絕對不觸發
  if (chance <= 0) return false;
  // 安全檢查：如果機率大於等於 1，絕對觸發
  if (chance >= 1) return true;

  // Math.random() 會產生一個 [0, 1) 之間的浮點數
  return Math.random() < chance;
};