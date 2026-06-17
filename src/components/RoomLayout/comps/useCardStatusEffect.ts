import { createVNode, render } from 'vue';
import CardStatusEffect from './CardStatusEffect.vue';

interface CardStatusEffectOptions {
  target: HTMLElement;    // 目標卡片的 DOM 元素 (例如 MonsterCard 元素)
  message: string;        // 特效顯示文字
  color?: string;         // 漸層與文字發光的主色調 (例如 '#2ecc71', '#e74c3c' 等)
  icon?: string;          // 顯示的圖示 (例如 '⚔️', '🛡️' 等)
  duration?: number;      // 特效持續時間 (毫秒，預設 1500)
}

/**
 * 針對指定元素 (例如 MonsterCard 的卡片 DOM) 播放卡片範圍內的 BUFF/DEBUFF 特效 (免修改 MonsterCard)
 */
export function useCardStatusEffect(options: CardStatusEffectOptions) {
  const {
    target,
    message,
    color = '#add8e6',
    icon = '',
    duration = 1500,
  } = options;

  if (!target) return;

  // 1. 確保目標元素具備定位屬性，讓 absolute 覆蓋層能正確附著在卡片內部
  const originalPosition = target.style.position;
  const computedStyle = getComputedStyle(target);
  if (computedStyle.position === 'static') {
    target.style.position = 'relative';
  }

  // 2. 建立一個容器
  const container = document.createElement('div');
  // 讓容器完全覆蓋目標元素，並繼承其 border-radius 以避免溢出
  container.style.position = 'absolute';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.overflow = 'hidden';
  container.style.borderRadius = computedStyle.borderRadius || 'inherit';
  container.style.zIndex = '999';

  target.appendChild(container);

  // 3. 銷毀與還原邏輯
  const destroy = () => {
    if (container) {
      render(null, container);
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
      // 還原可能被改動的定位屬性
      if (computedStyle.position === 'static' && target.style.position === 'relative') {
        target.style.position = originalPosition;
      }
    }
  };

  // 4. 建立虛擬節點
  const vnode = createVNode(CardStatusEffect, {
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
