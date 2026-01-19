import {ComponentPublicInstance} from "vue";

export interface MonsterCardExposed extends ComponentPublicInstance {
    shake: () => void;
    monsterMove:()=>void;
    // 如果 MonsterCard 內部還有其他 exposed 函數，也寫在這裡
}