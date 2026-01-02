import {defineStore} from 'pinia';
import {ref} from 'vue';
import {usePlayerStore} from './player-store';
import {useGameStateStore} from './game-state-store';
import CryptoJS from 'crypto-js';

// 加密金鑰 (請更換為你自己的字串)
const SECRET_KEY = 'god-note@teddywu1226';

export const useSaveStore = defineStore('save-management', () => {
	const playerStore = usePlayerStore();
	const gameStore = useGameStateStore();

	// 歷史存檔列表 (加密後的字串)
	const savedSlots = ref<string[]>([]);

	/**
	 * 加密數據
	 */
	const encrypt = (data: any): string => {
		return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
	};

	/**
	 * 解密數據
	 */
	const decrypt = (ciphertext: string): any => {
		try {
			const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
			return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
		} catch (e) {
			console.error('解密失敗或數據損壞', e);
			return null;
		}
	};

	/**
	 * 【存檔】Save All
	 * 抓取當前所有重要 Store 的 State 並加密儲存
	 */
	const saveAll = (slotIndex: number = 0) => {
		const fullState = {
			player: playerStore.$state,
			game: gameStore.$state,
			timestamp: Date.now(),
			version: __APP_VERSION__
		};
		// 儲存到本地或 state 中
		savedSlots.value[slotIndex] = encrypt(fullState);

	};

	/**
	 * 【回檔】Restore All
	 * 從指定位置解密數據並還原到各個 Store
	 */
	const loadAll = (slotIndex: number = 0): boolean => {
		const encryptedData = savedSlots.value[slotIndex] || localStorage.getItem(`ext_save_${slotIndex}`);

		if (!encryptedData) {
			console.warn('找不到該位置的存檔');
			return false;
		}

		const rawData = decrypt(encryptedData);
		if (!rawData) return false;

		// --- 還原 Player Store ---
		// 使用 $patch 可以一次更新多個屬性，且性能較好
		playerStore.$patch((state) => {
			Object.assign(state, rawData.player);
		});

		// --- 還原 Game State Store ---
		gameStore.$patch((state) => {
			Object.assign(state, rawData.game);
		});

		console.log('數據回檔完成');
		return true;
	};

	/**
	 * 清除所有存檔
	 */
	const clearSaves = () => {
		savedSlots.value = [];
		for (let i = 0; i < 5; i++) {
			localStorage.removeItem(`ext_save_${i}`);
		}
	};

	return {
		savedSlots,
		saveAll,
		loadAll,
		clearSaves
	};
}, {
	persist: true // 這個 Store 自己也需要持久化，記住有哪些存檔位
});