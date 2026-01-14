import {createVNode, render} from 'vue';
import FullScreenEffect from './FullScreenEffect.vue';

interface FullScreenEffectOptions {
	message?: string;    // 中間顯示的文字
	duration?: number;   // 持續時間 (毫秒)
	color?: string;      // 漸層與文字發光的主色調
}

/**
 * 顯示全畫面漸層光暈與文字特效
 */
export function useFullScreenEffect(options: FullScreenEffectOptions) {
	const {
		message = '',
		duration = 1000,   // 漸層效果建議至少 2 秒比較有感
		color = '#0f670d'  // 預設森林綠
	} = options;

	// 1. 尋找遊戲容器
	const gameContainer = document.getElementsByClassName('common-layout')[0] as HTMLElement || document.body;

	// 2. 確保容器具備定位屬性，讓 absolute 的特效能正確附著
	if (gameContainer && getComputedStyle(gameContainer).position === 'static') {
		gameContainer.style.position = 'relative';
	}

	const container = document.createElement('div');
	gameContainer.appendChild(container);

	// 3. 銷毀邏輯
	const destroy = () => {
		if (container) {
			render(null, container);
			if (container.parentNode) {
				container.parentNode.removeChild(container);
			}
		}
	};

	// 4. 建立虛擬節點 (移除 icons, iconCount)
	const vnode = createVNode(FullScreenEffect, {
		message,
		duration,
		color,
		onUnmount: destroy
	});

	render(vnode, container);

	// 5. 自動清理 (比持續時間多給一點點緩衝讓動畫跑完)
	setTimeout(destroy, duration + 500);

	return {close: destroy};
}