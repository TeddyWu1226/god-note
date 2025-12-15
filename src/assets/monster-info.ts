import {MonsterType} from "@/types";
import {WorldDefault} from "@/assets/const";
import {reactive, Reactive} from "vue";


/**
 * 建立怪物
 *
 * @param source 要複製的基礎物件定義。
 * @returns 一個新的、深度獨立、且響應式的物件。
 */
export function createMonster<T extends object>(source: T): Reactive<T> {
    let deepCopy: T;

    // 1. 執行深複製
    try {
        // 使用 structuredClone：現代且最穩健的深複製標準，支持 Date, RegExp, Map, Set 及循環引用。
        if (typeof structuredClone === 'function') {
            deepCopy = structuredClone(source);
        } else {
            // 備用方案：如果環境不支持 structuredClone (例如舊版 Node.js)，退回到 JSON 方法
            // ⚠️ 注意：此方法無法複製函數或 Date/RegExp 等特殊類型。
            deepCopy = JSON.parse(JSON.stringify(source)) as T;
        }
    } catch (e) {
        console.error("深複製失敗，可能存在循環引用或無法序列化的特殊結構。", e);
        // 如果深複製失敗，退回到淺複製（這可能會導致部分屬性仍有引用關聯）
        deepCopy = {...source};
    }

    // 2. 轉換為響應式物件
    return reactive(deepCopy) as Reactive<T>;
}

export const Monster = {
    Slime: {
        icon: '🟢',
        name: '史萊姆',
        description: '閃避率較高的初級魔物',
        ad: 5,
        critIncrease: WorldDefault.critIncrease,
        critRate: WorldDefault.critRate,
        adDefend: 0,
        dodge: 5,
        hit: 1,
        hp: 20,
        hpLimit: 20,
        level: 1,
        dropGold:5
    } as MonsterType
}