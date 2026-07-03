import {createVNode, render} from 'vue';
import CardImpactEffect from './CardImpactEffect.vue';

export type ImpactType =
    | 'physical'
    | 'magic'
    | 'heal'
    | 'buff'
    | 'vertical-slash'
    | 'horizontal-slash'
    | 'thrust'
    | 'assassinate'
    | 'poison';

/**
 * 在目標 DOM 元素正上方播放打擊特效覆蓋層
 * @param targetElement 目標 HTMLElement (若為 null 則掛在螢幕中央)
 * @param type 特效類型：'physical' | 'magic' | 'heal' | 'buff'
 */
export function useCardImpactEffect(
    targetElement: HTMLElement | null,
    type: ImpactType = 'physical'
) {
    // 1. 建立 DOM 容器
    const container = document.createElement('div');
    let positionStyle = {};

    if (targetElement) {
        // 確保目標元件 position 不是 static，以便 absolute 定位容器能正確對齊
        const computedStyle = window.getComputedStyle(targetElement);
        if (computedStyle.position === 'static') {
            targetElement.style.position = 'relative';
        }

        // 將容器掛載至目標元件內部，隨元件一同銷毀/隱藏
        targetElement.appendChild(container);
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.overflow = 'visible';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '10'; // 卡片內部的 z-index

        positionStyle = {
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            position: 'absolute',
        };
    } else {
        // 若無目標元件，則作為 fallback 掛載到 document.body 進行 fixed 全域定位
        document.body.appendChild(container);
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '0';
        container.style.height = '0';
        container.style.overflow = 'visible';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '9998';

        const playerEl = document.querySelector('.player-value-card');
        if (playerEl) {
            const rect = playerEl.getBoundingClientRect();
            positionStyle = {
                top: `${rect.top}px`,
                left: `${rect.left}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                position: 'fixed',
            };
        } else {
            // 預設在螢幕中央顯示小區域特效
            positionStyle = {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120px',
                height: '180px',
                position: 'fixed',
            };
        }
    }

    // 銷毀清理邏輯
    const destroy = () => {
        if (container) {
            render(null, container);
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }
    };

    // 2. 算繪 Vue 虛擬節點
    const vnode = createVNode(CardImpactEffect, {
        type,
        positionStyle,
        onUnmount: destroy
    });

    render(vnode, container);

    // 3. 自動清理 (1000ms 確保動畫全部播完)
    setTimeout(destroy, 1000);

    return {close: destroy};
}
