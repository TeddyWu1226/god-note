// useFloatingMessage.ts
import {createVNode, render, VNode} from 'vue';
import FloatingMessage from './FloatingMessage.vue';

export function useFloatingMessage(
    message: string,
    targetElement: HTMLElement | null = null,
    options: { duration?: number; color?: string; messageClass?: string } = {}
) {
    // 1. 創建一個 DOM 容器
    const container = document.createElement('div');
    document.body.appendChild(container);

    let positionStyle = {};

    if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        positionStyle = {
            top: `${rect.top + window.scrollY}px`,
            left: `${rect.right + window.scrollX}px`,
            transform: 'translate(10px, -50%)',
            position: 'absolute',
            width: 'auto',
            minWidth: '5rem',
            zIndex: 9999, // 確保在最上層
        };
    } else {
        positionStyle = {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            position: 'fixed',
            zIndex: 9999,
        };
    }

    // 定義一個徹底銷毀的函式
    const destroy = () => {
        if (container) {
            // 卸載 Vue 組件
            render(null, container);
            // 從 body 中徹底移除這個 div 容器
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }
    };

    // 3. 創建 Vue VNode
    const vnode: VNode = createVNode(FloatingMessage, {
        message: message,
        duration: options.duration || 1500,
        color: options.color,
        messageClass: options.messageClass,
        customStyle: positionStyle,
        // 確保組件內部生命週期結束時回報
        onUnmount: destroy
    });

    // 渲染
    render(vnode, container);

    // 如果 1.5 秒後組件還沒自己銷毀，強制執行
    setTimeout(destroy, (options.duration || 1500) + 500); // 多加 500ms 緩衝動畫

    return {close: destroy};
}