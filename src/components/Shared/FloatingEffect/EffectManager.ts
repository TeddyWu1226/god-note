import { createApp, h } from 'vue';
import FloatingEffect from './FloatingEffect.vue';

export const showEffect = (
    el: HTMLElement,
    text: string,
    type: 'buff' | 'debuff' = 'buff'
) => {
    // 1. 取得目標元素的位置
    const rect = el.getBoundingClientRect();

    // 2. 計算中心點 (隨機偏移讓多個特效不重疊)
    const x = rect.left + rect.width / 2 + (Math.random() * 40 - 20);
    const y = rect.top + (Math.random() * 20);

    // 3. 建立掛載容器
    const mountNode = document.createElement('div');
    document.body.appendChild(mountNode);

    // 4. 渲染組件
    const app = createApp({
        render() {
            return h(FloatingEffect, {
                text,
                type,
                x,
                y,
                onComplete: () => {
                    app.unmount();
                    mountNode.remove();
                }
            });
        }
    });

    app.mount(mountNode);
};