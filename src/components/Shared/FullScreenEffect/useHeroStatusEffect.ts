import {createVNode, render} from 'vue';
import HeroStatusEffect from './HeroStatusEffect.vue';

interface HeroStatusEffectOptions {
    message: string;    // 特效顯示文字
    color?: string;     // 漸層與文字發光的主色調 (例如 '#2ecc71', '#e74c3c' 等)
    icon?: string;      // 顯示的圖示 (例如 '⚔️', '🛡️' 等)
    duration?: number;  // 持續時間 (毫秒，預設 2000)
}

/**
 * 顯示勇者 (Hero) 獲得 BUFF 或 DEBUFF 的短暫全畫面特效 (可傳入顏色、文字、Icon)
 */
export function useHeroStatusEffect(options: HeroStatusEffectOptions = {message: ''}) {
    const {
        message,
        color = '#add8e6',
        icon = '',
        duration = 2000,
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

    // 4. 建立虛擬節點
    const vnode = createVNode(HeroStatusEffect, {
        message,
        icon,
        color,
        duration,
        onUnmount: destroy
    });

    render(vnode, container);

    // 5. 自動清理 (比持續時間多給一點點緩衝讓動畫跑完)
    const timer = setTimeout(destroy, duration + 200);

    return {
        close: () => {
            clearTimeout(timer);
            destroy();
        }
    };
}
