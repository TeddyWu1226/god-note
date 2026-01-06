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


/**
 * 從陣列中隨機抽取元素
 * @param arr 來源陣列
 * @param count 抽取數量 (預設 1)
 * @param allowDuplicate 是否允許重複抽取 (預設 false)
 * @returns 抽出的元素陣列
 */
export const getRandomElements = <T>(
	arr: T[],
	count: number = 1,
	allowDuplicate: boolean = false
): T[] => {
	// 安全檢查
	if (arr.length === 0) return [];
	if (!allowDuplicate && count > arr.length) {
		console.warn("抽取數量超過陣列長度且不允許重複，將回傳陣列最大長度");
		count = arr.length;
	}

	const result: T[] = [];
	const source = [...arr]; // 複製原陣列，避免修改到原始資料

	for (let i = 0; i < count; i++) {
		const randomIndex = Math.floor(Math.random() * source.length);

		if (allowDuplicate) {
			// 允許重複：直接取值，不移除原陣列內容
			result.push(source[randomIndex]);
		} else {
			// 不允許重複：取值後從來源中移除 (使用 splice)
			const element = source.splice(randomIndex, 1)[0];
			result.push(element);
		}
	}

	return result;
};


/**
 * 格式化數值精度
 * @param val 原始數值
 * @param precision 小數點位數 (預設 3)
 */
export const formatPrecision = (val: number, precision: number = 3): number => {
	const multiplier = Math.pow(10, precision);
	return Math.round(val * multiplier) / multiplier;
};

/**
 * 洗牌
 * @param array 原始數值
 */
export const shuffleArray = <T>(array: T[]): T[] => {
	const result = [...array]; // 建立副本，避免修改到原始陣列
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		// 交換位置
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}